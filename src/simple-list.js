// Borrow the real list, retaining element identity, native image data and event listeners.
export function createSimpleList(slot,track,rows){
 const positions=new WeakMap(),focusTargets=new WeakMap();
 const originalChildren=Array.from(track.childNodes);
 const rowChildren=rows.map(row=>Array.from(row.childNodes));
 const attributes=[];
 function remember(node,names){
  if(node)attributes.push([node,names.map(name=>[name,node.getAttribute(name)])]);
 }
 const used=new Set();
 let active=false;

 function begin(){
  remember(track,['class','style','role','aria-label','aria-describedby','data-gc-native-track']);
  for(const row of rows)remember(row,['class','style']);
  track.setAttribute('data-gc-native-track','');
  track.replaceChildren();
  active=true;
 }

 function makeCard(item,index,settings,options,open){
  const original=rows[index],copy=used.has(index);
  const row=copy?original.cloneNode(false):original;
  const card=document.createElement('div');
  card.className='gc-card gc-native-card';
  card.tabIndex=0;
  card.setAttribute('role','group');
  if(item.imageAttrs?.['data-image-focal-point']){
   const [x,y]=item.imageAttrs['data-image-focal-point'].split(',').map(Number);
   if(Number.isFinite(x)&&Number.isFinite(y))card.style.setProperty('--gc-native-focus',x*100+'% '+y*100+'%');
  }
  const name=item.title||item.alt||`Item ${index+1}`;
  card.setAttribute('aria-label',name);
  if(copy){
   row.removeAttribute('id');
   row.setAttribute('data-gc-repeat','');
   for(const child of rowChildren[index])card.append(child.cloneNode(true));
   card.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
  }else{used.add(index);card.append(...rowChildren[index]);}
  row.replaceChildren(card);
  positions.set(card,row);
  const media=card.querySelector('.list-item-media');
  const content=card.querySelector('.list-item-content');
  const title=card.querySelector('.list-item-content__title');
  const description=card.querySelector('.list-item-content__description');
  if(!copy){
   for(const node of [media,content])remember(node,['class']);
   for(const node of [title,description])remember(node,['class','hidden']);
  }
  media?.classList.add('gc-card-media');
  content?.classList.add('gc-card-copy');
  // Site Styles targets these nodes through the original list and section ID.
  // Preset type opts into our caption rules; native type needs no overrides.
  if(options.typeSource!=='native'){
   title?.classList.add('gc-card-title');
   description?.classList.add('gc-card-description');
  }
  if(title&&(!options.showTitles||settings.caption===false))title.hidden=true;
  if(description&&!settings.description)description.hidden=true;
  if(settings.thumbnail){
   // The tile itself handles activation. Full text and the link live in the preview.
   const cta=card.querySelector('.list-item-content__button-wrapper')||card.querySelector('.list-item-content__button');
   if(cta){if(!copy)remember(cta,['hidden']);cta.hidden=true;}
   if(content&&(!item.title||settings.caption===false)){
    if(!copy)remember(content,['hidden']);
    content.hidden=true;
   }
  }

  const links=Array.from(card.querySelectorAll('a[href],button,input,select,textarea,[tabindex]'));
  if(!copy)for(const node of links)remember(node,['tabindex']);
  focusTargets.set(card,links.map(node=>[node,node.getAttribute('tabindex')]));
  if(options.clickAction!=='none'&&(options.clickAction!=='link'||item.link)){
   const action=document.createElement('button');
   action.type='button';action.className='gc-native-action';action.tabIndex=-1;
   action.setAttribute('aria-label',(options.clickAction==='link'?'Open link for ':'Open ')+name);
   action.addEventListener('click',()=>open(item,index));
   card.append(action);
   card.setAttribute('aria-keyshortcuts','Enter Space');
   card.addEventListener('click',event=>{
    if(event.defaultPrevented||event.target.closest('a,button,input,select,textarea,label'))return;
    open(item,index);
   });
   card.addEventListener('keydown',event=>{
    if(event.target!==card||!['Enter',' '].includes(event.key))return;
    event.preventDefault();action.click();
   });
  }
  return card;
 }

 function syncFocus(card){
  const enabled=card.tabIndex===0&&card.getAttribute('aria-hidden')!=='true';
  for(const [node,previous] of focusTargets.get(card)||[]){
   const value=enabled?previous:'-1';
   if(node.getAttribute('tabindex')===value)continue;
   if(value===null)node.removeAttribute('tabindex');else node.setAttribute('tabindex',value);
  }
 }

 function setType(source){
  if(!active)return;
  const preset=source!=='native';
  track.querySelectorAll('.list-item-content__title').forEach(node=>node.classList.toggle('gc-card-title',preset));
  track.querySelectorAll('.list-item-content__description').forEach(node=>node.classList.toggle('gc-card-description',preset));
 }

 function restore(){
  track.classList.remove('gc-native-items-hidden');
  if(!active)return;
  rows.forEach((row,i)=>row.replaceChildren(...rowChildren[i]));
  track.replaceChildren(...originalChildren);
  for(const [node,attrs] of attributes){
   for(const [name,value] of attrs){
    if(node.getAttribute(name)===value)continue;
    if(value===null)node.removeAttribute(name);else node.setAttribute(name,value);
   }
  }
  slot.after(track);
  attributes.length=0;used.clear();active=false;
 }
 return {track,begin,makeCard,slot:card=>positions.get(card),syncFocus,setType,restore};
}
