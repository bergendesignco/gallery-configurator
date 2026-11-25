import {additionalPaints,spiralDesignDefaults} from './presets/spiral-design.js';
// Register a layout here when its renderer supports the shared content and design roles.
export const cardDesignLayouts = new Set(['spiral','stack','infinite','arc','arc-tabs','timed','showcase','wall','ring','angled']);
export const themeSwatches = { white:'Lightest', lightAccent:'Light', accent:'Accent', darkAccent:'Dark', black:'Darkest' };
export const designColors = [...additionalPaints,'borderColor','titleColor','descriptionColor','popupColor','popupInk','shadowColor','imageTint','controlFill','controlInk','backColor','spiralRim','background','ink','accent'];
export const cardDesignDefaults = {
  showImage:true, showDescription:false, showButton:false, cardPadding:0,
  popupImage:true, popupTitle:true, popupDescription:true, popupButton:true,
  popupPadding:0, popupRadius:12, popupCustom:false, popupColor:'#ffffff', popupInk:'#202020',
  descriptionSize:0, descriptionCustom:false, descriptionColor:'#202020',
  imageTint:'#000000', shadowEnabled:false, shadowColor:'#000000', shadowAngle:90,
  shadowDistance:4, shadowBlur:8, shadowSpread:0, hoverAmount:8,
};
for (const key of designColors) {
  cardDesignDefaults[key+'Swatch']='custom';
  cardDesignDefaults[key+'Opacity']=key==='imageTint'?0:['shadowColor','cardShadowColor','mirrorColor'].includes(key)?25:100;
}

export function cardDesignGroups({range,swatch,select}) {
  const toggle=(key,label)=>({key,label,type:'checkbox'});
  return [
    {title:'Card content',fields:[
      toggle('showImage','Show image'),toggle('showTitles','Show title'),toggle('showDescription','Show description'),
      toggle('showButton','Show item link'),range('cardPadding','Content padding',0,80,1,'px'),
      range('descriptionSize','Description size',0,4,.05,'rem'),toggle('descriptionCustom','Customize description color'),
      swatch('descriptionColor','Description color',['descriptionCustom',true]),
    ]},
    {title:'Image effects',fields:[
      swatch('imageTint','Image overlay'),toggle('shadowEnabled','Drop shadow'),
      ...[range('shadowAngle','Shadow angle',0,360,1,'°'),range('shadowDistance','Shadow distance',0,48,1,'px'),
        range('shadowBlur','Shadow blur',0,40,1,'px'),range('shadowSpread','Shadow spread',0,16,1,'px'),swatch('shadowColor','Shadow color')]
        .map(field=>({...field,when:['shadowEnabled',true]})),
      select('hoverEffect','Hover effect',{preset:'None',zoom:'Zoom',lift:'Lift'}),
      range('hoverAmount','Hover amount',0,30,1,''),
    ]},
    {title:'Popup',fields:[
      toggle('popupImage','Show popup image'),toggle('popupTitle','Show popup title'),toggle('popupDescription','Show popup description'),
      toggle('popupButton','Show popup link'),range('popupPadding','Popup content padding',0,80,1,'px'),
      range('popupRadius','Popup corners',0,64,1,'px'),toggle('popupCustom','Customize popup colors'),
      swatch('popupColor','Popup background',['popupCustom',true]),swatch('popupInk','Popup text',['popupCustom',true]),
    ]},
  ];
}

// Keep palette choices symbolic in saved settings. Resolve against the source section at render time.
export function resolveDesignColors(host,options) {
  if (!cardDesignLayouts.has(options.preset)) return options;
  const resolved={...options};
  const theme=getComputedStyle(host);
  let context;
  for(const key of designColors){
    const token=options[key+'Swatch'];
    let hex=options[key];
    if(Object.hasOwn(themeSwatches,token)){
      const hsl=theme.getPropertyValue('--'+token+'-hsl').trim();
      if(hsl){
        context??=document.createElement('canvas').getContext('2d');
        if(context){context.fillStyle=hex;context.fillStyle='hsl('+hsl+')';hex=context.fillStyle;}
      }
    }
    const alpha=Math.round((options[key+'Opacity']??100)*2.55);
    resolved[key]=alpha===255?hex:hex+alpha.toString(16).padStart(2,'0');
  }
  return resolved;
}

// Read older saved layouts using the visibility and finishes they originally used.
export function layoutDesignDefaults(preset, saved = {}) {
  if (preset === 'spiral') return {};
  const spatial = ['wall','ring','angled'].includes(preset);
  return {
    ...spiralDesignDefaults, aspectRatio:'layout', imagePadding:0, cardAlign:'layout', cardOrder:'layout',
    showDescription:['stack','arc-tabs','timed'].includes(preset), showButton:!spatial,
    pauseOnHover:true, mobileSizing:saved.mobileCardWidth!=null || saved.mobileGap!=null,
    cardBorderEnabled:saved.borderWidth>0, overlayEnabled:saved.overlayOpacity>0,
    imageTint:saved.overlayColor || '#142036', imageTintOpacity:saved.overlayOpacity || 0
  };
}
