import { pageSaveContext, savePageHeader } from './page-save.js';
import { defaults, presets, spiralDefaults, usesMinimumHeight, editingNativePage, listenForEditMode, embed } from './runtime.js';
import { discoverSources, readSource } from './sources.js';
import { createPanel, controlGroups } from './inline-panel.js';
import { editorBlocks } from './editor-blocks.js';
import launcherCSS from './inline-launcher.css';

import {layoutDesignDefaults} from './card-design.js';
const layouts = new Map(presets.map(layout => [layout.id, layout]));
const customColors = new Set(['background', 'ink', 'accent']);
// These preset defaults are shared by the live controls and compact page code.
function settings(preset, overrides = {}, sourceType) {
  const layout = layouts.get(preset);
  const base = {
    ...defaults, ...(preset === 'spiral' ? spiralDefaults : layoutDesignDefaults(preset,overrides)), preset,
    colorSource: 'section', typeSource: 'native',
    ...(sourceType==='summary'?{showButton:false}:{}),cardWidth: layout.width, stageHeight: usesMinimumHeight(preset) ? 0 : preset === 'spiral' ? 680 : preset === 'wall' ? 660 : 540,
    autoplay: preset === 'timed', ...(preset === 'wall' ? {background:'#101720', ink:'#f2f5f8'} : {})
  };
  for (const [key,value] of Object.entries(overrides)) {
    if (key.startsWith('mobile') && base[key]===null) {
      if (Number.isFinite(value) && value >= 0) base[key] = value;
    } else if (key !== 'preset' && Object.hasOwn(base,key) && typeof value === typeof base[key]) base[key] = value;
  }
  if(base.popupDesktopLayout!=='drawer')base.popupDesktopLayout='split';
  if(preset==='spiral'){
    if(!('mobileSizing' in overrides))base.mobileSizing=base.mobileGap!=null||base.mobileCardWidth!=null;
    if(!('titleCustom' in overrides))base.titleCustom=Boolean(base.titleSize||base.titlePalette==='custom'||base.titleWeight!=='inherit');
    if(!('bodyCustom' in overrides))base.bodyCustom=Boolean(base.descriptionCustom||base.descriptionSize);
    if(!('overlayEnabled' in overrides))base.overlayEnabled=base.imageTintOpacity>0;
    if(!('cardBorderEnabled' in overrides))base.cardBorderEnabled=base.borderWidth>0;
  }
  return base;
}

// A style contains only transferable controls. Content, destinations and
// section-specific color/type choices always come from the receiving source.
const localStyleKeys = new Set([...customColors, 'colorSource', 'typeSource', 'clickAction', 'popupDesktopLayout']);
function transferableFields(options) {
  return controlGroups(options).flatMap(group => group.typography ? [...group.fields,{key:group.typography,type:'checkbox'}] : group.fields).filter(field => !localStyleKeys.has(field.key));
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
    else if (['select','palette'].includes(field.type) && !field.choices.some(choice => choice.value === value)) return null;
    if (field.type === 'color' && !/^#[0-9a-f]{6}$/i.test(value)) return null;
    next[field.key] = value;
  }
  return next;
}

// Only explicit design choices travel. Each preset keeps its own geometry.
function sharedName(key){
  return key.replace(/^spiralRim/,'borderColor').replace(/^spiralRadius$/,'radius');
}
function sharedFields(options,type){
  const fields=new Map();
  for(const group of controlGroups(options,type)){
    if(!['Elements','Image','Title','Description','Card','Control styling','Theme'].includes(group.title))continue;
    for(const field of group.fields){
      if(field.key!=='cardWidth')fields.set(sharedName(field.key),field);
    }
    if(group.typography)fields.set(group.typography,{key:group.typography});
  }
  for(const key of ['titlePalette','descriptionCustom'])fields.set(key,{key});
  return fields;
}
function rememberStyle(record,options){
  const base=settings(options.preset,{},record.source.type);
  for(const [name,field] of sharedFields(options,record.source.type)){
    if(options[field.key]!==base[field.key])record.shared.set(name,options[field.key]);
  }
}
function installedSettings(options,sourceType) {
  // Earlier v1 snippets used the layout palette and typography, including
  // when the author kept every default and exported just a preset ID.
  return settings(options.preset, {
    ...options,
    colorSource: options.colorSource === 'section' ? 'section' : 'custom',
    typeSource: options.typeSource === 'native' ? 'native' : 'preset',
  },sourceType);
}

function pageCode(source, options) {
  const base = settings(options.preset,{},source.type);
  const opts = {preset:options.preset, colorSource:options.colorSource, typeSource:options.typeSource};
  for(const key of ['mobileSizing','titleCustom','bodyCustom','overlayEnabled','cardBorderEnabled'])opts[key]=options[key];
  if (usesMinimumHeight(options.preset)) opts.stageHeight = options.stageHeight;
  for (const key of Object.keys(base)) {
    if (options.colorSource === 'section' && customColors.has(key)) continue;
    if (options[key] !== base[key]) opts[key] = options[key];
  }
  if(source.editorBlockFit)opts.editorBlockFit=true;
  const data = {v:1, selector:source.selector, type:source.type, options:opts};
  return '<script type="application/json" data-gallery-layout>\n' +
    JSON.stringify(data,null,2).replaceAll('<','\\u003c') + '\n</script>';
}

export function startInline() {
  const previous = window.GalleryStudioInline;
  if (previous?.editorBlocks) return previous;
  if (previous) previous.destroy();
  const author = window.self !== window.top && window.frameElement?.id === 'sqs-site-frame' && !!document.querySelector('script[type="application/json"][data-gallery-configure],script[type="application/json"][data-gallery-editor]');
  const snippets = document.querySelectorAll('script[type="application/json"][data-gallery-layout]');
  if (!author && !snippets.length) return null;
  const sources = discoverSources();
  const records = new Map(sources.map(source => [source.root,{source,installed:null,options:null,mounted:null,presets:new Map(),shared:new Map()}]));
  let panel=null, editing=null, css=null, saving=false, blockEditor=null;
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
    if(!record.installed){record.source.editorBlockFit=false;blockEditor?.forget(record.source.root);}
    record.presets.clear();record.shared.clear();
    if (record.installed){apply(record,record.installed);rememberStyle(record,record.installed);}
    else {record.mounted?.destroy();record.mounted=null;record.options=null;}
  }
  function open(record) {
    if (editing === record) {close();return;}
    close(false);
    const {source}=record;
    if(!record.mounted) source.items=readSource(source.root,source.type);
    if (!source.items.length) {
      const message='Add items in Squarespace, then try again';
      record.button.querySelector('span').textContent=message;
      record.button.setAttribute('aria-label',message);
      return;
    }
    record.button.querySelector('span').textContent='Configure layout';
    record.button.setAttribute('aria-label','Configure '+source.name+' layout');
    let initial = record.options || record.installed || settings('arc-tabs',source.type!=='list'?{galleryWidth:'source'}:{},source.type);
    if(source.type!=='list' && initial.preset==='stack'){
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
        if (!layouts.has(id)||(source.type!=='list'&&id==='stack')) return;
        record.presets.set(record.options.preset,{...record.options});
        const next={...(record.presets.get(id)||settings(id,{},source.type)),galleryWidth:record.options.galleryWidth,galleryHeight:record.options.galleryHeight};
        const supported=sharedFields(next,source.type);
        for(const [key,value] of record.shared){
          const field=supported.get(key);
          if(field && (!field.choices || field.choices.some(c=>c.value===value)))next[field.key]=value;
        }
        change(next);
        panel.update({source,options:{...record.options}});
      },
      onOption:(key,value)=>{
        if (!Object.hasOwn(record.options,key) || key==='preset') return;
        const next={...record.options,[key]:value};
        const common=sharedName(key);
        if(sharedFields(record.options,source.type).has(common))record.shared.set(common,value);
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
            savedBlocks.delete(source.selector);source.editorBlockFit=false;record.installed=null;
            if(editing===record)restore(record);
            else {
              record.presets.clear();record.shared.clear();
              record.mounted?.destroy();
              record.mounted=null;
              record.options=null;
            }
          }else record.installed=savedOptions;
          blockEditor?.forget(source.root);
        } finally {saving=false;}
      },
      getStyle:()=>copyStyle(record.options),
      applyStyle:text=>{
        const next=readStyle(text,record.options);
        if (!next || (source.type!=='list'&&next.preset==='stack')) return false;
        record.presets.set(record.options.preset,{...record.options});
        record.shared.clear();rememberStyle(record,next);
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
  const savedBlocks=new Map();
  for (const script of snippets) {
    try {
      const data=JSON.parse(script.textContent),matches=document.querySelectorAll(data.selector);
      const record=matches.length===1&&records.get(matches[0]);
      if(data.v!==1 || !layouts.has(data.options?.preset)) continue;
      if(data.type==='gallery'||data.type==='summary')savedBlocks.set(data.selector,data);
      if(!record || data.type!==record.source.type) continue;
      record.source.editorBlockFit=data.options.editorBlockFit===true;
      record.installed=installedSettings(data.options,data.type);rememberStyle(record,record.installed);
    } catch { console.warn('Gallery Studio: skipped an invalid page layout.'); }
  }
  for(const record of records.values()) if(record.installed) apply(record,record.installed);
  if(author) {
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
    function attachButton(record) {
      const {source}=record;
      if (!source.selector) return;
      const anchor=source.root.querySelector(source.type==='list'?'.user-items-list':'.sqs-block-content')||source.root;
      const position=getComputedStyle(anchor).position==='static';
      if (position) anchor.classList.add('gc-config-position');
      const button=document.createElement('button');
      button.type='button';button.className='gc-config-launch';button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Configure '+source.name+' layout');
      button.innerHTML='<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h7m4 0h5M2 14h3m4 0h9"/><circle cx="11" cy="6" r="2"/><circle cx="7" cy="14" r="2"/></svg><span>Configure layout</span>';
      button.addEventListener('click',()=>open(record));anchor.append(button);record.button=button;
      cleanups.push(()=>{button.remove();if(position) anchor.classList.remove('gc-config-position');});
    }
    for (const record of records.values()) attachButton(record);
    function recordFor(root) {
      if (records.has(root)) return records.get(root);
      const previous = [...records.values()].find(r => r.source.root.id === root.id && !r.source.root.isConnected);
      if (previous) {
        const options = previous.options;
        previous.mounted?.destroy(); previous.mounted=null;
        records.delete(previous.source.root); previous.source.root=root; records.set(root,previous);
        attachButton(previous);
        if(options) apply(previous,options);
        return previous;
      }
      const source = discoverSources().find(s=>s.root===root);
      if (!source) return null;
      const record={source,installed:null,options:null,mounted:null,presets:new Map(),shared:new Map()};
      const saved=savedBlocks.get(source.selector);
      if(saved && saved.type===source.type)record.installed=installedSettings(saved.options,source.type);
      records.set(root,record); attachButton(record); return record;
    }
    const previewed = new WeakSet();
    blockEditor=editorBlocks({
      installed(root){
        const options=records.get(root)?.installed || savedBlocks.get('#'+CSS.escape(root.id))?.options;
        return Boolean(options && options.galleryHeight!=='custom' && (records.get(root)?.source.editorBlockFit || savedBlocks.get('#'+CSS.escape(root.id))?.options.editorBlockFit));
      },
      activate(root){
        const record=recordFor(root);
        if(!record) return;
        record.source.editorBlockFit=true;
        if(!record.button?.isConnected)attachButton(record);
        if(record.mounted && previewed.has(record.mounted) && root.classList.contains('gc-edit-preview') && !record.mounted.host.isConnected){
          record.mounted.destroy();record.mounted=null;
        }
        if(!record.mounted && !apply(record,record.options||record.installed||settings('arc-tabs',{galleryWidth:'source'},record.source.type)))return;
        if(editingNativePage() && !previewed.has(record.mounted)){
          record.mounted.instance.setEditPreview(true); previewed.add(record.mounted); updateEye(true);
        }else if(!editingNativePage()) previewed.delete(record.mounted);
      },
      configure(root){
        const record=recordFor(root);
        if(record){open(record);panel?.element.classList.add('gc-editor-panel');}
      }
    });
    cleanups.push(()=>blockEditor.destroy());
    window.addEventListener('pagehide',()=>blockEditor.destroy(),{once:true});
  }
  const api={version:1,editorBlocks:true,destroy(){
    close(false);for(const record of records.values())record.mounted?.destroy();
    for(const cleanup of cleanups)cleanup();css?.remove();delete window.GalleryStudioInline;
  }};
  window.GalleryStudioInline=api;return api;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startInline,{once:true});
else startInline();
