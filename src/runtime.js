import {mountCarousel} from './presets/carousels.js';
import {mountSpatial} from './presets/spatial.js';
import {mountStack} from './presets/stack.js';
import {mountSpiral} from './presets/spiral-lazy.js';
import {spiralDefaults,spiralControls} from './presets/spiral-settings.js';
import {createImage,loadNativeImage,cleanHTML,safeLink,readSource,sourcePlacement} from './sources.js';
import {createSimpleList} from './simple-list.js';
import {fitViewport} from './viewport-footprint.js';
import {appearanceDefaults,styleAppearance} from './appearance.js';
import {applyGalleryTheme,attachGalleryDialog} from './section-theme.js';
import baseCSS from './runtime.css';
import sectionThemeCSS from './section-theme.css';
import nativeTypeCSS from './native-type.css';
import carouselCSS from './presets/carousels.css';
import spatialCSS from './presets/spatial.css';
import spiralCSS from './presets/spiral.css';
import referenceCSS from './spiral/reference/scoped.css';
import viewerCSS from './spiral/project-viewer.css';
import webglCSS from './spiral/webgl-carousel.css';
export {spiralDefaults,spiralControls};
export const presets=[
{id:'stack',name:'Stacking cards',category:'Scroll',hint:'Scroll through the card stack',width:360},
{id:'infinite',name:'Infinite slider',category:'Drag',hint:'Drag to explore · Click the active image to open',width:360},
{id:'arc',name:'Arc gallery',category:'Rotate',hint:'Drag to rotate · Click the active image to open',width:280},
{id:'arc-tabs',name:'Arc with tabs',category:'Rotate',hint:'Choose a title or drag to rotate',width:360},
{id:'showcase',name:'Stacked showcase',category:'Depth',hint:'Drag to explore · Click the active card for details',width:430},
{id:'timed',name:'Timed carousel',category:'Autoplay',hint:'Choose a slide or press play',width:700},
{id:'wall',name:'3D gallery wall',category:'Immersive',hint:'Drag to look around · Click an image to open',width:230},
{id:'spiral',name:'Spiral carousel',category:'Rotate',hint:'Drag to rotate · Click the active image to open',width:280},
{id:'ring',name:'Interactive ring',category:'Hover',hint:'Move over the images · Drag to rotate',width:150},
{id:'angled',name:'Angled gallery',category:'Perspective',hint:'Drag to explore · Hover to bring an image forward',width:240}];
export const defaults={...appearanceDefaults,colorSource:'custom',typeSource:'preset',preset:'arc-tabs',galleryWidth:'full',navigation:'auto',cardWidth:360,gap:28,mobileCardWidth:null,mobileGap:null,radius:16,depth:48,stageHeight:0,duration:5,autoplay:false,showTitles:true,fit:'cover',clickAction:'preview',background:'#edf0f4',ink:'#1b2838',accent:'#345bf2',reducedMotion:false};
export function usesMinimumHeight(preset) {
 return ['infinite','arc','arc-tabs','showcase','timed'].includes(preset);
}

// A carousel's optional minimum and a camera layout's stage height have
// different meanings. Carry the value between presets only within its mode.
function mergeOptions(current,next) {
 const minimum=usesMinimumHeight(next.preset ?? current.preset);
 const inheritedHeight=minimum===usesMinimumHeight(current.preset) ? current.stageHeight : minimum ? 0 : 590;
 return {...current,...next,stageHeight:next.stageHeight ?? inheritedHeight};
}
function styleFamily(preset) {
 if (!preset || preset === 'stack') return 'common';
 if (preset === 'spiral') return 'spiral';
 if (['wall', 'ring', 'angled'].includes(preset)) return 'spatial';
 return 'carousel';
}

export function installStyles(preset) {
 let common = document.getElementById('gc-runtime-css');
 if (!common) {
  common = document.createElement('style');
  common.id = 'gc-runtime-css';
  common.textContent = [baseCSS,sectionThemeCSS,nativeTypeCSS].join('\n');
  document.head.append(common);
 }
 const family = styleFamily(preset);
 if (family === 'common') return () => {};

 const id = `gc-runtime-${family}-css`;
 let style = document.getElementById(id);
 if (!style) {
  style = document.createElement('style');
  style.id = id;
  if (family === 'carousel') style.textContent = carouselCSS;
  else if (family === 'spatial') style.textContent = spatialCSS;
  else style.textContent = [referenceCSS, webglCSS, viewerCSS, spiralCSS].join('\n');
  common.after(style);
 }

 // An exported page can contain several independently bundled galleries.
 // Count owners on their shared style element so one can switch safely.
 style.dataset.gcOwners = String(Number(style.dataset.gcOwners || 0) + 1);
 let released = false;
 return () => {
  if (released) return;
  released = true;
  const remaining = Number(style.dataset.gcOwners) - 1;
  if (remaining > 0) style.dataset.gcOwners = String(remaining);
  else style.remove();
 };
}
function textHTML(html){const t=document.createElement('template');t.innerHTML=html||'';return t.content.textContent||'';}
export function mountGallery(host,items,initial={},nativeList=null){
 let options=mergeOptions(defaults,initial);let engine=null;let dialog=null;let restoreFocus=null;let active=0;let loadFrame=0;
 let currentFamily,releaseStyles;
 host.classList.add('gc-stage');host.setAttribute('role','region');host.setAttribute('aria-label','Gallery preview');
 function closeDialog(){if(!dialog)return;dialog.close();dialog.remove();dialog=null;engine?.setSuspended?.(false);restoreFocus?.focus({preventScroll:true});}
 function open(item,index){
  if(options.clickAction==='none')return;
  if(options.clickAction==='link'){const href=safeLink(item.link);if(href)window.open(href,'_blank','noopener,noreferrer');return;}
  restoreFocus=document.activeElement;if(dialog)closeDialog();
  dialog=document.createElement('dialog');dialog.className='gc-dialog'+(options.preset==='showcase'?' gc-dialog-drawer':'');dialog.setAttribute('aria-label',item.title||'Image preview');
  const close=document.createElement('button');close.className='gc-dialog-close';close.type='button';close.textContent='Close ×';close.addEventListener('click',closeDialog);
  const content=document.createElement('div');content.className='gc-dialog-content';const media=document.createElement('div');media.className='gc-dialog-media';if(item.src){media.append(createImage(item));content.append(media);}
  const body=document.createElement('div');body.className='gc-dialog-copy';
  if(item.title){const h=document.createElement('h2');h.textContent=item.title;body.append(h);}
  if(item.description){const p=document.createElement('div');p.innerHTML=cleanHTML(item.description);body.append(p);}
  if(item.link){const a=document.createElement('a');a.href=safeLink(item.link);a.textContent=item.buttonLabel||'Open link';a.target='_blank';a.rel='noopener noreferrer';body.append(a);}
  const count=document.createElement('p');count.className='gc-dialog-count';count.textContent=`${index+1} / ${items.length}`;body.append(count);content.append(body);dialog.append(close,content);attachGalleryDialog(host,dialog);dialog.showModal();engine?.setSuspended?.(true);loadNativeImage(media.querySelector('img'));close.focus();
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 }
 function makeCard(item,index,settings={}){
  if(nativeList)return nativeList.makeCard(item,index,settings,options,open);
  const b=document.createElement('button');b.type='button';b.className='gc-card';b.setAttribute('aria-label',item.title||`Image ${index+1}`);
  const media=document.createElement('span');media.className='gc-card-media';if(item.src){media.append(createImage(item));b.append(media);}
  const copy=document.createElement('span');copy.className='gc-card-copy';
  if(settings.caption!==false&&options.showTitles&&item.title){const title=document.createElement('span');title.className='gc-card-title';title.textContent=item.title;copy.append(title);}
  if(settings.description&&item.description){const description=document.createElement('span');description.className='gc-card-description';description.textContent=textHTML(item.description);copy.append(description);}
  if(copy.childNodes.length)b.append(copy);b.addEventListener('click',()=>open(item,index));return b;
 }
 const mq=matchMedia('(prefers-reduced-motion: reduce)');
 const phone=matchMedia('(max-width: 660px)');
 function renderOptions(){
  const resolved={...options,reducedMotion:options.reducedMotion||mq.matches};
  if(phone.matches){
   if(options.mobileCardWidth!=null)resolved.cardWidth=options.mobileCardWidth;
   if(options.mobileGap!=null)resolved[options.preset==='spiral'?'spiralGap':'gap']=options.mobileGap;
  }
  resolved.phoneWidthOverride=phone.matches && options.mobileCardWidth!=null;
  if(options.preset==='stack')resolved.stackCardWidth=phone.matches && options.mobileCardWidth!=null
   ? options.mobileCardWidth : Math.max(360,options.cardWidth*2.2);
  return resolved;
 }
 function styleHost(){
  styleAppearance(host,options);
  host.style.setProperty('--gc-fit',options.fit);
  host.style.setProperty('--gc-card-radius',options.radius+'px');
  applyGalleryTheme(host,options);
 }
 function render(initialIndex=0){
  closeDialog();engine?.destroy();engine=null;nativeList?.restore();cancelAnimationFrame(loadFrame);host.replaceChildren();host.classList.add('gc-stage');host.style.height='';
  const family=styleFamily(options.preset);
  if(family!==currentFamily){
   releaseStyles?.();
   releaseStyles=installStyles(options.preset);
   currentFamily=family;
  }
  styleHost();
  host.setAttribute('aria-label',options.previewScroll===false?'Gallery':'Gallery preview');
  const reusable=nativeList&&options.preset!=='spiral'?nativeList:null;
  if(reusable)reusable.begin();
  else if(nativeList)nativeList.track.classList.add('gc-native-items-hidden');
  const ctx={host,items,initialIndex,nativeList:reusable,attachDialog:dialog=>attachGalleryDialog(host,dialog),options:renderOptions(),makeCard,loadImage:loadNativeImage,onChange(index){active=index;options.onChange?.(index);}};
  if(!items.length){const p=document.createElement('p');p.className='gc-empty';p.textContent='Add images to your source to start exploring.';host.append(p);return;}
  if(options.preset==='spiral')engine=mountSpiral(ctx);
  else if(options.preset==='stack')engine=mountStack(ctx);
  else if(['wall','ring','angled'].includes(options.preset)){
   engine=mountSpatial(ctx);
   if(initialIndex)engine.goTo(initialIndex);
  }
  else engine=mountCarousel(ctx);
  if(options.preset!=='spiral'){
   loadFrame=requestAnimationFrame(()=>host.querySelectorAll('img').forEach(img=>{
    loadNativeImage(img,{nativeCard:!!reusable});
   }));
  }
 }
 const motion=()=>render(active);
 function resizePhone(){
  if(options.mobileCardWidth==null && options.mobileGap==null)return;
  if(engine?.setGeometry)engine.setGeometry(renderOptions());
  else if(options.preset==='spiral')engine?.update(renderOptions());
  else render(active);
 }
 try{render();}catch(error){releaseStyles?.();nativeList?.restore();throw error;}
 mq.addEventListener('change',motion);
 phone.addEventListener('change',resizePhone);
 return {update(next){const old=options.preset;
 const previous=renderOptions();
 options=mergeOptions(options,next);
 const resolved=renderOptions();
 const changed=Object.keys(resolved).filter(key=>!['mobileCardWidth','mobileGap','galleryWidth'].includes(key)&&resolved[key]!==previous[key]);
 if(!changed.length)return;
 if(engine?.setGeometry && changed.every(key=>['cardWidth','gap','phoneWidthOverride'].includes(key))){
  engine.setGeometry(resolved);
  return;
 }
 const colorOrType=key=>['colorSource','typeSource','background','ink','accent'].includes(key);
 if(changed.every(key=>colorOrType(key)||(old!=='spiral'&&(key==='radius'||Object.hasOwn(appearanceDefaults,key))))){
  styleHost();
  if(changed.includes('typeSource'))nativeList?.setType(options.typeSource);
  return;
 }
 if(old==='spiral'&&options.preset==='spiral'&&engine?.update){styleHost();engine.update(resolved);}else render(old===options.preset?active:0);},goTo(i){engine?.goTo?.(i);},setPlaying(value){options.autoplay=value;engine?.setPlaying?.(value);},getOptions(){return {...options};},getActive(){return active;},destroy(){closeDialog();cancelAnimationFrame(loadFrame);engine?.destroy();nativeList?.restore();mq.removeEventListener('change',motion);phone.removeEventListener('change',resizePhone);host.replaceChildren();host.classList.remove('gc-stage');releaseStyles?.();}};
}
// Self-contained exports may each include a copy of the runtime on the same page.
const inlineRegistry=window[Symbol.for('gallery-studio.inline')]??={mounts:new WeakMap(),scrollBoundaries:new WeakMap()};

function releaseStickyBlockers(host,source){
 const section=source.closest('section')||source;
 const changed=[];
 for(let node=host.parentElement;node;node=node.parentElement){
  const owners=inlineRegistry.scrollBoundaries.get(node)||0;
  if(owners||['hidden','auto','scroll','overlay'].includes(getComputedStyle(node).overflowY)){
   inlineRegistry.scrollBoundaries.set(node,owners+1);
   node.classList.add('gc-stack-page-scroll');
   changed.push(node);
  }
  if(node===section)break;
 }
 return ()=>{
  for(const node of changed){
   const owners=inlineRegistry.scrollBoundaries.get(node)-1;
   if(owners)inlineRegistry.scrollBoundaries.set(node,owners);
   else{inlineRegistry.scrollBoundaries.delete(node);node.classList.remove('gc-stack-page-scroll');}
  }
 };
}

function editingNativePage(){
 return document.body.classList.contains('sqs-edit-mode-active')||document.documentElement.classList.contains('sqs-edit-mode-active');
}

// Release each source's native layout when editing starts.
function listenForEditMode(listener){
 if(!inlineRegistry.editListeners?.size){
  inlineRegistry.editListeners=new Set();
  let previous=editingNativePage();
  inlineRegistry.editObserver=new MutationObserver(()=>{
   const editing=editingNativePage();
   if(editing===previous)return;
   previous=editing;
   for(const callback of inlineRegistry.editListeners){
    try{callback(editing);}catch(error){console.warn('Gallery Studio: could not resume a list layout.',error);}
   }
  });
  for(const node of [document.body,document.documentElement]){
   inlineRegistry.editObserver.observe(node,{attributes:true,attributeFilter:['class']});
  }
 }
 inlineRegistry.editListeners.add(listener);
 return ()=>{
  inlineRegistry.editListeners.delete(listener);
  if(!inlineRegistry.editListeners.size)inlineRegistry.editObserver.disconnect();
 };
}

export function embed({selector,type='gallery',options={}}={}){
 let target=selector;
 if(typeof selector==='string'){
  try{
   const matches=document.querySelectorAll(selector);
   if(matches.length!==1)return null;
   target=matches[0];
  }catch{return null;}
 }
 if(!target?.isConnected||typeof target.closest!=='function')return null;
 const placement=sourcePlacement(target,type);
 if(!placement)return null;
 const {source}=placement;
 const previous=inlineRegistry.mounts.get(source);
 if(previous){previous.instance.update(options);return previous;}
 if(!readSource(source,type).length)return null;
 const host=document.createElement('div'),slot=document.createElement('div');
 host.className='gc-embed';slot.className='gc-viewport-slot';slot.append(host);
 let current={...mergeOptions(defaults,options),previewScroll:false};
 let gallery=null,restoreScroll=null,restoreViewport=null,stopEdit=null,destroyed=false,hidden=[];
 let listWidth=null;
 function syncWidth(){
  if(current.galleryWidth==='source'){
   restoreViewport?.();restoreViewport=null;
   // Use the same Squarespace width rules as the original UL, including
   // changes to --pagePadding and centered/inset widths at each breakpoint.
   if(listWidth){
    slot.classList.add('user-items-list-simple');
    slot.dataset.layoutWidth=listWidth.mode;
    slot.style.maxWidth=listWidth.maximum;
   }
  }else if(!restoreViewport){
   slot.classList.remove('user-items-list-simple');
   delete slot.dataset.layoutWidth;
   slot.style.removeProperty('max-width');
   restoreViewport=fitViewport(slot,host,source,type);
  }
 }
 function syncScroll(preset){
  if(preset==='stack'){
   if(!restoreScroll)restoreScroll=releaseStickyBlockers(host,source);
  }else if(restoreScroll){restoreScroll();restoreScroll=null;}
 }
 function unmount(){
  try{gallery?.destroy();}
  finally{
   gallery=null;
   syncScroll(null);
   restoreViewport?.();restoreViewport=null;
   hidden.forEach(node=>node.classList.remove('gc-native-items-hidden'));
   hidden=[];
   slot.remove();
  }
 }
 function mount(){
  if(destroyed||!source.isConnected)return;
  const live=sourcePlacement(source,type);
  const items=readSource(source,type);
  if(!live||!items.length)return;
  live.originals[0].before(slot);
  installStyles();
  const track=live.originals[0];
  listWidth=type==='list'?{mode:track.dataset.layoutWidth||'full',maximum:track.style.maxWidth}:null;
  syncWidth();
  const list=type==='list'?createSimpleList(slot,live.originals[0],live.rows):null;
  if(!list){
   hidden=live.originals;
   hidden.forEach(node=>node.classList.add('gc-native-items-hidden'));
  }
  syncScroll(current.preset);
  gallery=mountGallery(host,items,current,list);
 }
 function destroy(){
  if(destroyed)return;
  destroyed=true;
  try{unmount();}
  finally{stopEdit?.();inlineRegistry.mounts.delete(source);}
 }
 const instance={
  update(next={}){if(destroyed)return;const width=current.galleryWidth;current={...mergeOptions(current,next),previewScroll:false};if(gallery){if(current.galleryWidth!==width)syncWidth();syncScroll(current.preset);gallery.update(current);}},
  goTo(i){gallery?.goTo(i);},
  setPlaying(value){current.autoplay=value;gallery?.setPlaying(value);},
  getOptions(){return {...current};},getActive(){return gallery?.getActive()??0;},destroy
 };
 const handle={instance,host,source,destroy};
 try{
  stopEdit=listenForEditMode(editing=>{
   if(editing){unmount();return;}
   try{mount();}catch(error){unmount();throw error;}
  });
  if(!editingNativePage())mount();
  inlineRegistry.mounts.set(source,handle);
 }catch(error){destroy();throw error;}
 return handle;
}
window.GalleryStudioRuntime={mountGallery,embed,presets};
