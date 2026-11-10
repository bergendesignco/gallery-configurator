import {mountGallery,presets,defaults,spiralDefaults,spiralControls,usesMinimumHeight} from './runtime.js';
import {discoverSources,readSource} from './sources.js';
import {testSources} from './seed.js';
import studioCSS from './studio.css';
const runtimeCode=__RUNTIME_SOURCE__;
const STORE='gallery-studio-v1';
const dom=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
function glyph(id){
 const start='<svg viewBox="0 0 70 34" fill="none" aria-hidden="true">',end='</svg>';
 const r=(x,y,w,h,rot=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-width="1.2" transform="rotate(${rot} ${x+w/2} ${y+h/2})"/>`;
 if(id==='stack')return start+r(20,3,30,17)+r(16,9,38,18)+r(12,17,46,14)+end;
 if(['arc','arc-tabs','ring'].includes(id)){let str=start;const n=id==='ring'?9:5;for(let i=0;i<n;i++){const a=id==='ring'?i*2*Math.PI/n:(i-2)*.43;const x=id==='ring'?35+23*Math.sin(a):35+45*Math.sin(a),y=id==='ring'?17-12*Math.cos(a):32-21*Math.cos(a);str+=r(x-5,y-6,10,12,a*180/Math.PI);}return str+end;}
 if(id==='wall')return start+[0,1,2].map(y=>[0,1,2,3].map(x=>r(5+x*16,3+y*10,12,7)).join('')).join('')+end;
 if(id==='spiral')return start+[0,1,2,3,4].map(i=>r(8+i*10,6+Math.sin(i)*8,18,12,(i-2)*9)).join('')+end;
 if(id==='showcase')return start+r(5,9,25,18,-15)+r(40,9,25,18,15)+r(19,4,32,26)+end;
 if(id==='angled')return start+[0,1,2,3].map(i=>r(5+i*15,6,17,22,-12)).join('')+end;
 return start+r(0,10,15,18)+r(20,4,30,26)+r(55,10,15,18)+end;
}
export function startStudio(){
 if(document.getElementById('gc-app'))return;
 const local=!location.hostname.endsWith('.squarespace.com');
 const discovered=discoverSources();
 if(!local&&!discovered.length)return;
 const style=dom('style');style.id='gc-studio-css';style.textContent=studioCSS;document.head.append(style);
 let saved={};try{saved=JSON.parse(localStorage.getItem(STORE)||'{}');}catch{}
 let presetId=presets.some(p=>p.id===saved.preset)?saved.preset:'arc-tabs';
 let perPreset=saved.settings||{};
 let sourceIndex=local?Number(saved.sourceIndex)||0:(discovered[0]?.type==='gallery'?1:0);
 let source={...testSources[sourceIndex],items:local?testSources[sourceIndex].items:discovered[0].items,live:!local};
 let options=settingsFor(presetId),gallery,refreshTimer,exportDialog,sourceGeneration=0;
 const app=dom('div','gc-app');app.id='gc-app';document.body.classList.add('gc-studio-active');
 const localSections=discovered.map(s=>s.root.closest('section[data-section-id]')||s.root);localSections.forEach(s=>s.classList.add('gc-source-hidden'));
 if(discovered[0])localSections[0].before(app);else document.body.append(app);
 app.innerHTML='<header class="gc-app-header"><div class="gc-brand"><span class="gc-brand-mark" aria-hidden="true">✳</span><div><h1>Gallery studio</h1><p>One collection. A different perspective.</p></div></div><div class="gc-header-actions"><span class="gc-save-state">Changes saved in this browser</span><button type="button" class="gc-export-primary">Get code</button></div></header><div class="gc-workspace"><main class="gc-preview"><div class="gc-preview-heading"><div><span class="gc-kicker">LIVE PREVIEW</span><h2></h2></div><div class="gc-view-switch" aria-label="Preview size"><button type="button" data-size="full" class="is-active" aria-pressed="true">Desktop</button><button type="button" data-size="mobile" aria-pressed="false">Mobile</button></div></div><div class="gc-preview-frame"><div class="gc-preview-host"></div></div><div class="gc-preview-footer"><span class="gc-gesture-hint"></span><span class="gc-item-count"></span></div><div class="gc-source-note"></div></main><aside class="gc-panel" aria-label="Gallery settings"><div class="gc-panel-top"><span>Make it yours</span><button type="button" class="gc-reset">Reset</button></div><div class="gc-panel-scroll"></div><div class="gc-panel-bottom"><button type="button" class="gc-export-primary">Get installation code</button><p>Live preview · Copy when you’re ready</p></div></aside></div><button type="button" class="gc-mobile-settings" aria-expanded="false">Adjust layout</button>';
 const host=app.querySelector('.gc-preview-host');const controlArea=app.querySelector('.gc-panel-scroll');
 function settingsFor(id){const p=presets.find(p=>p.id===id);return {...defaults,...(id==='spiral'?spiralDefaults:{}),preset:id,cardWidth:p.width,stageHeight:usesMinimumHeight(id)?0:Math.max(380,Math.min(id==='wall'?660:590,window.innerHeight-320)),autoplay:id==='timed',background:id==='wall'?'#101720':'#edf0f4',ink:id==='wall'?'#f2f5f8':'#1b2838',...(perPreset[id]||{}),previewScroll:true};}
 function persist(){perPreset[presetId]={...options};try{localStorage.setItem(STORE,JSON.stringify({preset:presetId,sourceIndex,settings:perPreset}));}catch{app.querySelector('.gc-save-state').textContent='Settings are kept for this session';}}
 function mount(){gallery?.destroy();gallery=mountGallery(host,source.items,options);app.querySelector('.gc-preview-heading h2').textContent=presets.find(p=>p.id===presetId).name;app.querySelector('.gc-gesture-hint').textContent=presets.find(p=>p.id===presetId).hint;app.querySelector('.gc-item-count').textContent=`${source.items.length} source images`;app.querySelector('.gc-source-note').textContent=source.unavailable?'This source could not be loaded. Check the source page, then refresh the content.':source.live?(source.items.length?'Using your native Squarespace content. Edit it in Squarespace, then refresh the source.':'This native source is empty. Add images in Squarespace, then refresh the content.'):'Previewing the four images supplied on your test site. Installation code reads the native content on the target page.';}
 function setOption(key,value){options[key]=value;persist();clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>gallery.update(options),key==='background'||key==='ink'?0:55);}
 function field(label,control){const row=dom('label','gc-field');row.append(dom('span','gc-field-label',label),control);return row;}
 function select(key,label,choices,parent){const s=dom('select');s.setAttribute('aria-label',label);choices.forEach(v=>{const o=dom('option','',typeof v==='string'?v:v.label);o.value=typeof v==='string'?v:v.value;s.append(o);});s.value=options[key];s.addEventListener('change',()=>{setOption(key,s.value);if(key==='spiralRiseUnit'){options.spiralRise=s.value==='px'?52:8;buildControls();gallery.update(options);}});parent.append(field(label,s));}
 function range(key,label,min,max,step,unit,parent){
  const wrap=dom('div','gc-range-row'),input=dom('input'),output=dom('output');
  input.type='range';input.min=min;input.max=max;input.step=step;input.value=options[key];input.setAttribute('aria-label',label);
  function readout(){
   const auto=key==='stageHeight'&&min===0&&Number(input.value)===0;
   const reading=auto?'Auto':input.value+(unit||'');
   output.textContent=reading;input.setAttribute('aria-valuetext',reading);
  }
  readout();
  input.addEventListener('input',()=>{readout();setOption(key,Number(input.value));});
  wrap.append(input,output);parent.append(field(label,wrap));
 }
 function toggle(key,label,parent){const input=dom('input');input.type='checkbox';input.checked=!!options[key];input.setAttribute('aria-label',label);input.addEventListener('change',()=>setOption(key,input.checked));const row=field(label,input);row.classList.add('gc-toggle-row');parent.append(row);}
 function group(title,open=true){const d=dom('details','gc-control-group');d.open=open;d.append(dom('summary','',title));const b=dom('div','gc-control-group-body');d.append(b);controlArea.append(d);return b;}
 function buildControls(){
  controlArea.replaceChildren();const sources=group('Content');const s=dom('select');s.setAttribute('aria-label','Content source');testSources.forEach((v,i)=>{const o=dom('option','',v.name);o.value=i;s.append(o);});s.value=sourceIndex;s.addEventListener('change',()=>changeSource(Number(s.value)));sources.append(field('Use images from',s));const sourceInfo=dom('div','gc-source-info');sourceInfo.append(dom('span','gc-source-badge',source.unavailable?'Unavailable':source.live?'Connected':'Reference content'),dom('span','',`${source.items.length} items`));const refresh=dom('button','gc-text-button','Refresh content');refresh.type='button';refresh.addEventListener('click',()=>changeSource(sourceIndex));sourceInfo.append(refresh);sources.append(sourceInfo);
  const layouts=group('Layout');const grid=dom('div','gc-preset-grid');presets.forEach(p=>{const b=dom('button','gc-preset'+(p.id===presetId?' is-active':''));b.type='button';b.setAttribute('aria-label',p.name);b.setAttribute('aria-pressed',String(p.id===presetId));b.innerHTML=glyph(p.id);b.append(dom('span','',p.name));b.addEventListener('click',()=>{perPreset[presetId]={...options};presetId=p.id;options=settingsFor(p.id);persist();buildControls();mount();});grid.append(b);});layouts.append(grid);
  const geo=group('Shape & spacing');range('cardWidth','Card width',80,presetId==='timed'?960:560,10,'px',geo);const minimum=usesMinimumHeight(presetId);range('stageHeight',minimum?'Minimum gallery height':'Gallery height',minimum?0:360,920,minimum?1:10,'px',geo);
  if(presetId==='spiral'){spiralControls.forEach(c=>{if(c.type==='range'){const v=c.key==='spiralRise'&&options.spiralRiseUnit==='percent'?{...c,...c.percent}:c;range(c.key,c.label,v.min,v.max,v.step,v.unit,geo);}else if(c.type==='select')select(c.key,c.label,c.choices,geo);else toggle(c.key,c.label,geo);});}
  else {range('gap','Spacing',0,100,2,'px',geo);range('radius','Corners',0,40,1,'px',geo);if(!['infinite','timed'].includes(presetId))range('depth',presetId==='ring'?'Flip strength':presetId==='angled'?'Perspective':'Depth',0,100,1,'',geo);}
  select('fit','Image fit',[{value:'cover',label:'Fill the card'},{value:'contain',label:'Fit the whole image'}],geo);
  const interaction=group('Interaction',false);select('clickAction','On click',[{value:'preview',label:presetId==='showcase'?'Open details panel':'Open image preview'},{value:'link',label:'Follow item link'},{value:'none',label:'No click action'}],interaction);if(presetId!=='stack'){toggle('autoplay','Autoplay',interaction);if(presetId!=='spiral')range('duration','Time per image',2,15,.5,'s',interaction);}toggle('reducedMotion','Reduce motion',interaction);
  const appearance=group('Appearance',false);toggle('showTitles','Show titles',appearance);[['background','Background'],['ink','Text'],['accent','Accent']].forEach(([key,label])=>{const i=dom('input');i.type='color';i.value=options[key];i.setAttribute('aria-label',label);i.addEventListener('input',()=>setOption(key,i.value));appearance.append(field(label,i));});
 }
 async function changeSource(index){const target=testSources[index];if(!target)return;sourceIndex=index;const generation=++sourceGeneration;let items=null,live=false;
  const native=document.querySelector(target.selector);if(native){items=readSource(native,target.type);live=true;}
  else if(!local){try{const r=await fetch(target.path,{credentials:'same-origin'});if(r.ok){const d=new DOMParser().parseFromString(await r.text(),'text/html');const root=d.querySelector(target.selector);if(root){items=readSource(root,target.type,new URL(target.path,location.href).href);live=true;}}}catch{}}
  if(generation!==sourceGeneration)return;
  source={...target,items:items??(local?target.items:[]),live,unavailable:!local&&!live};persist();buildControls();mount();
 }
 function makeExport(){const exportOptions={...options};delete exportOptions.previewScroll;delete exportOptions.onChange;return `<!-- Gallery Studio · ${presets.find(p=>p.id===presetId).name} -->\n<script type="module">\n${runtimeCode.replace(/<\/script/gi,'<\\/script')}\nconst start = () => window.GalleryStudioRuntime.embed(${JSON.stringify({selector:source.selector,type:source.type,options:exportOptions},null,2)});\nif (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();\n<\/script>`;}
 function showExport(){if(exportDialog)return;exportDialog=dom('dialog','gc-export-dialog');exportDialog.setAttribute('aria-label','Installation code');const top=dom('div','gc-export-head');const h=dom('h2','','Your gallery, ready to install.');const close=dom('button','gc-dialog-close','Close ×');close.addEventListener('click',()=>{exportDialog.close();exportDialog.remove();exportDialog=null;});top.append(h,close);const p=dom('p','','Paste this into the target page’s Header Code Injection. Keep the native source on that page; the code reads it automatically.');const target=dom('input');target.value=source.selector;target.setAttribute('aria-label','Target section or block selector');const area=dom('textarea');area.readOnly=true;area.spellcheck=false;area.setAttribute('aria-label','Installation code');area.value=makeExport();target.addEventListener('change',()=>{source.selector=target.value.trim();area.value=makeExport();});const actions=dom('div','gc-export-actions');const copy=dom('button','gc-export-primary','Copy code');copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(area.value);copy.textContent='Copied';}catch{area.select();copy.textContent='Select all, then copy';}});const download=dom('button','gc-secondary','Download code');download.addEventListener('click',()=>{const blob=new Blob([area.value],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=dom('a');a.href=url;a.download=`gallery-${presetId}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});actions.append(copy,download);exportDialog.append(top,p,field('Source selector',target),area,actions);document.body.append(exportDialog);exportDialog.showModal();exportDialog.addEventListener('close',()=>{exportDialog?.remove();exportDialog=null;});}
 app.querySelectorAll('.gc-export-primary').forEach(b=>b.addEventListener('click',showExport));app.querySelector('.gc-reset').addEventListener('click',()=>{delete perPreset[presetId];options=settingsFor(presetId);persist();buildControls();mount();});
 app.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{app.querySelector('.gc-preview-frame').classList.toggle('is-mobile',b.dataset.size==='mobile');app.querySelectorAll('[data-size]').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b));});}));
 app.querySelector('.gc-mobile-settings').addEventListener('click',e=>{const open=app.classList.toggle('gc-settings-open');e.currentTarget.setAttribute('aria-expanded',String(open));e.currentTarget.textContent=open?'Back to preview':'Adjust layout';});
 buildControls();mount();window.GalleryStudio={app,getOptions:()=>({...options}),getSource:()=>({...source}),setPreset(id){const b=[...app.querySelectorAll('.gc-preset')].find(b=>b.getAttribute('aria-label')===presets.find(p=>p.id===id)?.name);b?.click();},destroy(){sourceGeneration++;gallery?.destroy();app.remove();style.remove();localSections.forEach(s=>s.classList.remove('gc-source-hidden'));document.body.classList.remove('gc-studio-active');}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startStudio,{once:true});else startStudio();
