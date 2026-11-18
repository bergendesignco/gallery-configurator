import { pageSaveContext, savePageHeader } from './page-save.js';
import { defaults, presets, spiralDefaults, usesMinimumHeight, editingNativePage, listenForEditMode, embed } from './runtime.js';
import { discoverSources, readSource } from './sources.js';
import { createPanel, controlGroups } from './inline-panel.js';
import launcherCSS from './inline-launcher.css';

const layouts = new Map(presets.map(layout => [layout.id, layout]));
const customColors = new Set(['background', 'ink', 'accent', 'borderColor', 'overlayColor']);
// These preset defaults are shared by the live controls and compact page code.
function settings(preset, overrides = {}) {
  const layout = layouts.get(preset);
  const base = {
    ...defaults, ...(preset === 'spiral' ? spiralDefaults : {}), preset,
    colorSource: 'section', typeSource: 'native',
    cardWidth: layout.width, stageHeight: usesMinimumHeight(preset) ? 0 : preset === 'spiral' ? 680 : preset === 'wall' ? 660 : 540,
    autoplay: preset === 'timed', ...(preset === 'wall' ? {background:'#101720', ink:'#f2f5f8'} : {})
  };
  for (const [key,value] of Object.entries(overrides)) {
    if (key === 'mobileCardWidth' || key === 'mobileGap') {
      if (Number.isFinite(value) && value >= 0) base[key] = value;
    } else if (key !== 'preset' && Object.hasOwn(base,key) && typeof value === typeof base[key]) base[key] = value;
  }
  return base;
}

// A style contains only transferable controls. Content, destinations and
// section-specific color/type choices always come from the receiving source.
const localStyleKeys = new Set([...customColors, 'colorSource', 'typeSource', 'clickAction']);
function transferableFields(options) {
  return controlGroups(options).flatMap(group => group.fields).filter(field => !localStyleKeys.has(field.key));
}
function copyStyle(options) {
  const values = Object.fromEntries(transferableFields(options).map(({key}) => [key, options[key]]));
  return JSON.stringify({format:'gallery-studio-style', version:1, preset:options.preset, values});
}
function readStyle(text, destination) {
  let style;
  try { style = JSON.parse(text); } catch { return null; }
  if (style?.format !== 'gallery-studio-style' || style.version !== 1 || !layouts.has(style.preset) ||
      !style.values || typeof style.values !== 'object' || Array.isArray(style.values)) return null;
  const next = settings(style.preset);
  for (const key of localStyleKeys) next[key] = destination[key];
  for (const field of transferableFields(next)) {
    const value = style.values[field.key];
    if (value === undefined) continue;
    if (field.type === 'range') {
      if (field.inherits && value === null) continue;
      const bounds = field.percent && style.values.spiralRiseUnit === 'percent' ? field.percent : field;
      if (!Number.isFinite(value) || value < bounds.min || value > bounds.max) return null;
    } else if (field.type === 'checkbox' && typeof value !== 'boolean') return null;
    else if (field.type === 'select' && !field.choices.some(choice => choice.value === value)) return null;
    next[field.key] = value;
  }
  return next;
}

function installedSettings(options) {
  // Earlier v1 snippets used the layout palette and typography, including
  // when the author kept every default and exported just a preset ID.
  return settings(options.preset, {
    ...options,
    colorSource: options.colorSource === 'section' ? 'section' : 'custom',
    typeSource: options.typeSource === 'native' ? 'native' : 'preset',
  });
}

function pageCode(source, options) {
  const base = settings(options.preset);
  const opts = {preset:options.preset, colorSource:options.colorSource, typeSource:options.typeSource};
  if (usesMinimumHeight(options.preset)) opts.stageHeight = options.stageHeight;
  for (const key of Object.keys(base)) {
    if (options.colorSource === 'section' && customColors.has(key)) continue;
    if (options[key] !== base[key]) opts[key] = options[key];
  }
  const data = {v:1, selector:source.selector, type:source.type, options:opts};
  return '<script type="application/json" data-gallery-layout>\n' +
    JSON.stringify(data,null,2).replaceAll('<','\\u003c') + '\n</script>';
}

export function startInline() {
  if (window.GalleryStudioInline?.version === 1) return window.GalleryStudioInline;
  const author = window.self !== window.top && window.frameElement?.id === 'sqs-site-frame' && !!document.querySelector('script[type="application/json"][data-gallery-configure]');
  const snippets = document.querySelectorAll('script[type="application/json"][data-gallery-layout]');
  if (!author && !snippets.length) return null;
  const sources = discoverSources();
  const records = new Map(sources.map(source => [source.root,{source,installed:null,options:null,mounted:null,presets:new Map()}]));
  let panel=null, editing=null, css=null, saving=false;
  const cleanups=[];
  function apply(record, options) {
    if (record.mounted) record.mounted.instance.update({...options,previewScroll:false});
    else record.mounted=embed({selector:record.source.selector,type:record.source.type,options});
    if (record.mounted) record.options={...options};
    return !!record.mounted;
  }
  function close(focus = true) {
    if (!editing) return;
    const previous=editing;
    editing=null;panel?.destroy();panel=null;
    previous.button?.setAttribute('aria-expanded','false');
    if (focus) previous.button?.focus({preventScroll:true});
  }
  function restore(record) {
    close();
    record.presets.clear();
    if (record.installed) apply(record,record.installed);
    else {record.mounted?.destroy();record.mounted=null;record.options=null;}
  }
  function open(record) {
    if (editing === record) {close();return;}
    close(false);
    const {source}=record;
    if(!record.mounted) source.items=readSource(source.root,source.type);
    if (!source.items.length) return;
    let initial = record.options || record.installed || settings('arc-tabs',source.type==='gallery'?{galleryWidth:'source'}:{});
    if(source.type==='gallery' && initial.preset==='stack'){
      initial=settings('arc-tabs',{galleryWidth:'source'});
      apply(record,initial);
    }
    if (!record.mounted && !apply(record,initial)) {
      record.button.textContent='No supported layout here';return;
    }
    editing=record;
    const change = options => {
      apply(record,options);record.presets.set(options.preset,{...options});
    };
    panel=createPanel({source,options:{...record.options},onClose:()=>close(),onRestore:()=>restore(record),
      onPreset:id=>{
        if (!layouts.has(id)||(source.type==='gallery'&&id==='stack')) return;
        record.presets.set(record.options.preset,{...record.options});
        change({...(record.presets.get(id)||settings(id)),galleryWidth:record.options.galleryWidth,galleryHeight:record.options.galleryHeight});
        panel.update({source,options:{...record.options}});
      },
      onOption:(key,value)=>{
        if (!Object.hasOwn(record.options,key) || key==='preset') return;
        const next={...record.options,[key]:value};
        change(next);
      },
      getSaveState:()=>{
        if(!record.installed)return 'Not saved yet';
        return pageCode(source,record.options)===pageCode(source,record.installed)
          ? 'Saved to page' : 'Unsaved changes';
      },
      getCode:()=>pageCode(source,record.options),
      onSave:async (onBackup, remove = false)=>{
        if(saving) throw Error('Another gallery is still saving. Please wait.');
        const savedOptions={...record.options};
        const context=pageSaveContext();
        saving=true;
        try {
          await savePageHeader({snippet:pageCode(source,savedOptions),context,onBackup,remove});
          if(remove){
            record.installed=null;
            if(editing===record)restore(record);
            else {
              record.presets.clear();
              record.mounted?.destroy();
              record.mounted=null;
              record.options=null;
            }
          }else record.installed=savedOptions;
        } finally {saving=false;}
      },
      getStyle:()=>copyStyle(record.options),
      applyStyle:text=>{
        const next=readStyle(text,record.options);
        if (!next || (source.type==='gallery'&&next.preset==='stack')) return false;
        record.presets.set(record.options.preset,{...record.options});
        change(next);
        panel.update({source,options:record.options});
        return true;
      }
    });
    panel.element.setAttribute('data-gc-author-panel','');
    record.button.setAttribute('aria-expanded','true');
  }
  // Resolve every saved target against this page. Multiple snippets on one
  // page are independent; ambiguous selectors never affect a second source.
  for (const script of snippets) {
    try {
      const data=JSON.parse(script.textContent),matches=document.querySelectorAll(data.selector);
      const record=matches.length===1&&records.get(matches[0]);
      if(!record || data.v!==1 || data.type!==record.source.type || !layouts.has(data.options?.preset)) continue;
      record.installed=installedSettings(data.options);
    } catch { console.warn('Gallery Studio: skipped an invalid page layout.'); }
  }
  for(const record of records.values()) if(record.installed) apply(record,record.installed);
  if(author && records.size) {
    css=document.createElement('style');css.textContent=launcherCSS;document.head.append(css);
    const eye=document.createElement('button');
    eye.type='button';
    eye.className='gc-edit-eye';
    eye.setAttribute('aria-label','Preview gallery layouts');
    eye.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span></span>';
    function updateEye(active=false){
      eye.setAttribute('aria-pressed',String(active));
      eye.querySelector('span').textContent=active?'Edit native content':'Preview galleries';
      eye.hidden=!editingNativePage() || ![...records.values()].some(record=>record.mounted);
    }
    // Fluid Engine can replace the block element when entering or leaving Edit.
    function reconnect(record){
      if(!record.mounted || record.source.root.isConnected)return;
      const previous=record.source.root;
      const matches=document.querySelectorAll(record.source.selector);
      if(matches.length!==1)return;
      const root=matches[0];
      record.mounted.destroy();
      record.mounted=null;
      record.source.root=root;
      records.delete(previous);
      records.set(root,record);
      apply(record,record.options);
      const anchor=root.querySelector(record.source.type==='list'?'.user-items-list':'.sqs-block-content')||root;
      if(record.button){
        if(getComputedStyle(anchor).position==='static')anchor.classList.add('gc-config-position');
        anchor.append(record.button);
      }
    }
    eye.onclick=()=>{
      const active=eye.getAttribute('aria-pressed')!=='true';
      for(const record of [...records.values()]){
        reconnect(record);
        record.mounted?.instance.setEditPreview(active);
      }
      updateEye(active);
    };
    document.body.append(eye);
    updateEye();
    const stopEye=listenForEditMode(editing=>{
      if(!editing)requestAnimationFrame(()=>{if(eye.isConnected)for(const record of [...records.values()])reconnect(record);});
      updateEye();
    });
    cleanups.push(()=>{stopEye();eye.remove();});
    for(const record of records.values()) {
      const {source}=record;
      if (!source.selector) continue;
      const anchor=source.root.querySelector(source.type==='list'?'.user-items-list':'.sqs-block-content')||source.root;
      const position=getComputedStyle(anchor).position==='static';
      if (position) anchor.classList.add('gc-config-position');
      const button=document.createElement('button');
      button.type='button';button.className='gc-config-launch';button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Configure '+source.name+' layout');
      button.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>';
      if(!source.items.length){button.disabled=true;button.title='Add images in Squarespace to configure this source.';}
      button.addEventListener('click',()=>open(record));anchor.append(button);record.button=button;
      cleanups.push(()=>{button.remove();if(position) anchor.classList.remove('gc-config-position');});
    }
  }
  const api={version:1,destroy(){
    close(false);for(const record of records.values())record.mounted?.destroy();
    for(const cleanup of cleanups)cleanup();css?.remove();delete window.GalleryStudioInline;
  }};
  window.GalleryStudioInline=api;return api;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startInline,{once:true});
else startInline();
