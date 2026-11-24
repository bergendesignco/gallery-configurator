// SVG filters follow the painted alpha, including letterboxed images and curved silhouettes.
export function createImageEffects(host,id){
  const ns='http://www.w3.org/2000/svg';
  function element(name,attrs,parent){
    const node=document.createElementNS(ns,name);
    for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);
    parent?.append(node);
    return node;
  }
  const svg=element('svg',{width:0,height:0,'aria-hidden':'true'});
  svg.style.position='absolute';
  host.append(svg);
  const defs=element('defs',{},svg);
  const shadow=element('filter',{id:id+'-shadow',x:'-100%',y:'-100%',width:'300%',height:'300%','color-interpolation-filters':'sRGB'},defs);
  const spread=element('feMorphology',{in:'SourceAlpha',operator:'dilate'},shadow);
  const blur=element('feGaussianBlur',{},shadow);
  const offset=element('feOffset',{result:'mask'},shadow);
  const color=element('feFlood',{},shadow);
  element('feComposite',{in2:'mask',operator:'in'},shadow);
  const merge=element('feMerge',{},shadow);
  element('feMergeNode',{},merge);element('feMergeNode',{in:'SourceGraphic'},merge);
  const tint=element('filter',{id:id+'-tint','color-interpolation-filters':'sRGB'},defs);
  const flood=element('feFlood',{},tint);
  element('feComposite',{in2:'SourceGraphic',operator:'atop'},tint);
  const cardFilter=shadow.cloneNode(true);
  cardFilter.id=id+'-card-shadow';defs.append(cardFilter);
  return options=>{
    const angleCard=(options.cardShadowAngle??90)*Math.PI/180;
    cardFilter.querySelector('feMorphology').setAttribute('radius',options.cardShadowSpread||0);
    cardFilter.querySelector('feGaussianBlur').setAttribute('stdDeviation',(options.cardShadowBlur||0)/2);
    const shift=cardFilter.querySelector('feOffset');
    shift.setAttribute('dx',Math.cos(angleCard)*(options.cardShadowDistance||0));
    shift.setAttribute('dy',Math.sin(angleCard)*(options.cardShadowDistance||0));
    cardFilter.querySelector('feFlood').setAttribute('flood-color',options.cardShadowColor||'#000');
    const filters=[];
    if(options.shadowEnabled)filters.push('url(#'+shadow.id+')');
    if(options.cardShadow)filters.push('url(#'+cardFilter.id+')');
    const angle=options.shadowAngle*Math.PI/180;
    spread.setAttribute('radius',options.shadowSpread);
    blur.setAttribute('stdDeviation',options.shadowBlur/2);
    offset.setAttribute('dx',Math.cos(angle)*options.shadowDistance);
    offset.setAttribute('dy',Math.sin(angle)*options.shadowDistance);
    color.setAttribute('flood-color',options.shadowColor);
    flood.setAttribute('flood-color',options.imageTint);
    host.style.setProperty('--gc-shadow-filter',filters.join(' ')||'none');
    host.style.setProperty('--gc-image-filter',options.imageTint.endsWith('00')&&options.imageTint.length===9?'none':'url(#'+tint.id+')');
  };
}
