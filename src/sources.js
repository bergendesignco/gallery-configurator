export function safeLink(value,base=location.href){
 if(!value||!value.trim()||value.trim()==='#')return '';
 try{const u=new URL(value,base);return /^(https?:|mailto:|tel:)$/.test(u.protocol)?u.href:'';}catch{return '';}
}
export function cleanHTML(value){
 const t=document.createElement('template');t.innerHTML=value||'';
 t.content.querySelectorAll('script,style,iframe,object,embed,form,input,button,link,meta').forEach(e=>e.remove());
 t.content.querySelectorAll('*').forEach(e=>{for(const a of [...e.attributes])if(/^on/i.test(a.name)||a.name==='style'||a.name==='id')e.removeAttribute(a.name);if(e.hasAttribute('href')){const href=safeLink(e.getAttribute('href'));if(href)e.setAttribute('href',href);else e.removeAttribute('href');}});
 return t.innerHTML;
}
export function imageData(img){
 if(!img)return {src:'',alt:'',imageAttrs:{}};
 const attrs={};for(const name of ['data-src','data-image','data-image-dimensions','data-image-focal-point','width','height','srcset','sizes'])if(img.hasAttribute(name))attrs[name]=img.getAttribute(name);
 return {src:img.getAttribute('data-src')||img.getAttribute('data-image')||img.getAttribute('src')||'',alt:img.getAttribute('alt')||'',imageAttrs:attrs};
}
const nativeRoots={list:'section.user-items-list-section',gallery:'.sqs-block-gallery',summary:'.sqs-block-summary-v2'};

// Resolve a section selector or a block selector to one owning Squarespace source.
export function sourcePlacement(target,type){
 const rootSelector=nativeRoots[type];
 if(!target||!rootSelector)return null;
 let source=target.closest(rootSelector);
 if(!source){
  const matches=target.querySelectorAll(rootSelector);
  if(matches.length!==1)return null;
  source=matches[0];
 }
 const content=type==='list'?source:source.querySelector(':scope > .sqs-block-content');
 if(!content)return null;
 const owned=selector=>Array.from(content.querySelectorAll(selector)).filter(node=>node.closest(rootSelector)===source&&(!node.closest('.gc-embed')||node.hasAttribute('data-gc-native-track')));
 if(type==='summary'){
  const originals=owned('.summary-block-wrapper');
  if(originals.length!==1)return null;
  const rows=owned('.summary-item').filter(row=>originals[0].contains(row)&&!row.closest('.sqs-gallery-design-carousel-slide-clone,.slick-cloned'));
  return {source,originals,rows};
 }
 const rowSelector=type==='list'?'.list-item':'.slide';
 let originals=owned(type==='list'?'ul.user-items-list-item-container.user-items-list-simple':'.sqs-gallery-container');
 if(type==='gallery'&&!originals.length)originals=owned('.sqs-gallery');
 if(originals.length===1){
  const rows=Array.from(originals[0].querySelectorAll(rowSelector)).filter(row=>row.closest(rootSelector)===source&&!row.hasAttribute('data-gc-repeat'));
  return {source,originals,rows};
 }
 if(type==='gallery'&&!originals.length){
  const rows=owned(rowSelector);
  if(rows.length&&rows.every(row=>row.parentElement===rows[0].parentElement))return {source,originals:rows,rows};
 }
 return null;
}

export function readSource(root,type,base=location.href){
 const rows=sourcePlacement(root,type)?.rows||[];
 return rows.map(row=>{
  const img=row.querySelector('img[data-src],img[data-image],img');
  if(type==='summary'){
   const anchor=row.querySelector('.summary-title-link,.summary-thumbnail-container,.summary-read-more-link');
   const link=safeLink(anchor?.getAttribute('href'),base);
   return {...imageData(img),title:row.querySelector('.summary-title')?.textContent.trim()||img?.alt||'',description:cleanHTML(row.querySelector('.summary-excerpt')?.innerHTML),link,postUrl:link,buttonLabel:'Read post'};
  }
  const title=row.querySelector(type==='list'?'.list-item-content__title':'.image-slide-title')?.textContent.trim()||'';
  const description=cleanHTML(row.querySelector(type==='list'?'.list-item-content__description':'.image-slide-description')?.innerHTML||'');
  const link=row.querySelector(type==='list'?'.list-item-content__button':'.image-slide-anchor');
  return {...imageData(img),title,description,link:safeLink(link?.getAttribute('href'),base),buttonLabel:type==='list'?(link?.textContent.trim()||''):''};
 }).filter(item=>type==='summary'?Boolean(item.link):type==='list'||Boolean(item.src||item.title||item.link));
}
function sourceSelector(root,type){
 const value=type==='list'?root.getAttribute('data-section-id'):root.id;
 if(!value?.trim())return '';
 const selector=type==='list'?'section[data-section-id="'+CSS.escape(value)+'"]':'#'+CSS.escape(value);
 return root.ownerDocument.querySelectorAll(selector).length===1?selector:'';
}
export function discoverSources(doc=document){
 const counts={list:0,gallery:0,summary:0};
 return Array.from(doc.querySelectorAll(Object.values(nativeRoots).join(',')))
  .filter(root=>!root.closest('.gc-embed'))
   .flatMap(root=>{
   const type=root.matches(nativeRoots.list)?'list':root.matches(nativeRoots.summary)?'summary':'gallery';
   const selector=sourceSelector(root,type);
   if(!selector||!sourcePlacement(root,type))return [];
   const count=++counts[type],label=type==='list'?'List Section':type==='summary'?'Summary Block':'Gallery Block';
   return {name:label+(count>1?' '+count:''),type,selector,root,items:readSource(root,type)};
  });
}
export function loadNativeImage(img,{nativeCard=false}={}){
 if(!img?.isConnected)return;
 const loader=img.ownerDocument.defaultView?.ImageLoader;
 if(loader&&typeof loader.load==='function'){
  try{loader.load(img,{load:true});}catch(error){console.warn('Gallery Studio: native image loader',error);}
 }
 if(nativeCard)return;
 // Native loader can apply crop positioning. The card owns the rendered frame.
 img.style.cssText='width:100%;height:100%;display:block;position:static;opacity:1;object-fit:var(--gc-fit,cover);object-position:'+focal(img.getAttribute('data-image-focal-point'))+';';
 if(img.classList.contains('project-image'))img.style.objectFit='contain';
}
function focal(value){const p=(value||'.5,.5').split(',').map(Number);return `${(Number.isFinite(p[0])?p[0]:.5)*100}% ${(Number.isFinite(p[1])?p[1]:.5)*100}%`;}
export function createImage(item){
 const img=document.createElement('img');
 for(const [k,v] of Object.entries(item.imageAttrs||{}))if(/^(data-(src|image|image-dimensions|image-focal-point)|width|height|srcset|sizes)$/.test(k))img.setAttribute(k,v);
 img.src=item.src;img.alt=item.alt||'';img.decoding='async';img.loading='eager';img.draggable=false;
 img.style.objectPosition=focal(item.imageAttrs?.['data-image-focal-point']);
 return img;
}
