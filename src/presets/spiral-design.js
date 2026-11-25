// Only Spiral opts into these controls. Saved settings keep their existing keys.
export const spiralDesignDefaults = {
  mobileSizing:false, carouselPadding:0, surfaceEnabled:false, surfaceColor:'#ffffff', surfaceRadius:0,
  heightMode:'pixels', viewportHeight:65, mobileHeightMode:'inherit', mobileViewportHeight:65,
  mobileStageHeight:null, mobileCarouselPadding:null, mobileSpiralWidth:null, mobileCardPadding:null,
  textPlacement:'below', cardOrder:'media', cardAlign:'middle', cardSizing:'content',
  titleAlign:'inherit', descriptionAlign:'inherit', descriptionWeight:'inherit',
  titleGap:0, buttonGap:0, mediaGap:0, cardBackground:false, cardColor:'#ffffff',
  imageWidth:100, imageAlign:'center', imageBorder:false, imageBorderSize:1, imageBorderColor:'#263448', imageRadius:0,
  mirrorOverlay:false, mirrorColor:'#000000', hoverDuration:250,
  playbackMode:'continuous', cardsPerMinute:7.5, direction:'forward', pauseOnHover:false,
  controlIconSize:0, controlPadding:0, controlBackground:true,
  titleCustom:false, bodyCustom:false, cardBorderEnabled:false, overlayEnabled:false,
  cardShadow:false, cardShadowColor:'#000000', cardShadowAngle:90, cardShadowDistance:4, cardShadowBlur:8, cardShadowSpread:0,
};
export const additionalPaints=['surfaceColor','cardColor','imageBorderColor','mirrorColor','cardShadowColor'];
export function spiralDesignGroups(options,source,{range,select,swatch},existing){
 const check=(key,label)=>({key,label,type:'checkbox'});
 const number=(key,label,min,max,unit='px',step=1)=>range(key,label,min,max,step,unit);
 const when=(key,value,fields)=>fields.map(field=>({...field,when:[key,value]}));
 const group=(title,...fields)=>({title,fields:fields.flat()});
 const original=key=>existing.flatMap(g=>g.fields).find(f=>f.key===key);
 const list=source!=='gallery';
 const weight={inherit:'Inherit',...Object.fromEntries(Array.from({length:9},(_,i)=>[100*(i+1),String(100*(i+1))]))};
 const alignment={inherit:'Inherit',left:'Left',center:'Center',right:'Right'};
 function typeGroup(title,toggle,size,weightKey,color,align){
   return {...group(title,number(size,'Size',0,4,'rem',.05),select(weightKey,'Weight',weight),swatch(color,'Color'),select(align,'Alignment',alignment)),typography:toggle};
 }
 function shadow(toggle,label,prefix,color){
   return [check(toggle,label),...when(toggle,true,[number(prefix+'Angle','Angle',0,360,'°'),number(prefix+'Distance','Distance',0,48),number(prefix+'Blur','Blur',0,40),number(prefix+'Spread','Spread',0,16),swatch(color,'Color')])];
 }
 const mobile=(key,base)=>({...original(base),key, label:'Mobile '+original(base).label.toLowerCase(),inherits:base});
 return [
 group('Elements',check('showImage','Show image'),check('showTitles','Show title'),...(list?[check('showDescription','Show description'),check('showButton','Show button')]:[]),check('showControls','Show controls')),
 group('Main carousel',...(list?[select('heightMode','Height',{auto:'Auto',pixels:'Pixels',viewport:'Viewport'}),...when('heightMode','pixels',[number('stageHeight','Height',120,1600)]),...when('heightMode','viewport',[number('viewportHeight','Window height',15,100,'%')])]:[]),
 number('carouselPadding','Carousel padding',0,64),original('spiralWidth'),check('surfaceEnabled','Background'),...when('surfaceEnabled',true,[swatch('surfaceColor','Color'),number('surfaceRadius','Corner radius',0,64)]),
 select('edgeMode','Edges',{preset:'Layout default',hard:'Hard edge',gradient:'Fade at edges'}),original('edgeFade'),original('spiralGap'),check('autoplay','Autoplay'),
 ...when('autoplay',true,[select('playbackMode','Movement',{continuous:'Continuous',step:'One card at a time'}),select('direction','Direction',{forward:'Forward',reverse:'Reverse'})]),
 {...number('cardsPerMinute','Cards per minute',1,60,'',.5),when:['autoplay',true],condition:o=>o.playbackMode==='continuous'},
 {...number('duration','Time per card',1,15,'s',.5),when:['autoplay',true],condition:o=>o.playbackMode==='step'}),
 group('Spiral',original('spiralRiseUnit'),{...original('spiralRise'),label:'Rise'},select('textPlacement','Text placement',{below:'Below the spiral',card:'On each card'}),original('showSlots')),
 group('Image',select('aspectRatio','Image crop',Object.fromEntries(['original','1:1','3:2','2:3','4:3','3:4','16:9','2.4:1','circle','4:5','9:16'].map(k=>[k,k==='original'?'Original':k==='circle'?'Circle':k]))),select('fit','Image sizing',{cover:'Fill',contain:'Fit'}),number('imageWidth','Image width',20,100,'%'),select('imageAlign','Alignment',{left:'Left',center:'Center',right:'Right'}),original('imagePadding'),
 check('imageBorder','Image border'),...when('imageBorder',true,[swatch('imageBorderColor','Color'),number('imageBorderSize','Thickness',0,12),number('imageRadius','Corner radius',0,64)]),
 shadow('shadowEnabled','Image shadow','shadow','shadowColor'),check('overlayEnabled','Overlay'),...when('overlayEnabled',true,[swatch('imageTint','Color')])),
 typeGroup('Title','titleCustom','titleSize','titleWeight','titleColor','titleAlign'),
 ...(list?[typeGroup('Description','bodyCustom','descriptionSize','descriptionWeight','descriptionColor','descriptionAlign')]:[]),
 group('Card',original('cardWidth'),select('cardSizing','Height',{content:'Fit to content',equal:'Equal height'}),select('cardOrder','Element order',{media:'Media first',content:'Content first'}),number('cardPadding','Card padding',0,80),number('mediaGap','Space between image and text',0,80),number('titleGap','Space below title',0,80),...(list?[number('buttonGap','Space above button',0,80)]:[]),select('cardAlign','Vertical alignment',{middle:'Middle',top:'Top',bottom:'Bottom'}),
 check('cardBackground','Background'),...when('cardBackground',true,[swatch('cardColor','Color')]),check('cardBorderEnabled','Card border'),...when('cardBorderEnabled',true,[swatch('spiralRim','Color'),original('borderWidth')]),original('spiralRadius'),
 shadow('cardShadow','Card shadow','cardShadow','cardShadowColor'),original('backFace'),original('backColor'),...when('backFace','mirror',[check('mirrorOverlay','Mirrored image overlay')]),{...swatch('mirrorColor','Color'),when:['mirrorOverlay',true],condition:o=>o.backFace==='mirror'}),
 group('Interaction',check('pauseOnHover','Pause on hover'),original('hoverEffect'),original('hoverAmount'),number('hoverDuration','Hover duration',0,1000,'ms',10),select('clickAction','Card click',{source:list?'Button only':'Image link only',link:list?'Follow button link':'Follow image link',preview:source==='summary'?'Open blog post':'Open preview',none:'Do nothing'}),original('reducedMotion')),
 group('Control styling',original('controlSize'),number('controlIconSize','Icon size',0,60),number('controlPadding','Button padding',0,32),original('controlShape'),original('arrowStyle'),check('controlBackground','Button background'),original('controlPalette'),original('controlInk'),original('controlFill')),
 group('Mobile',check('mobileSizing','Customize mobile sizing'),mobile('mobileCardWidth','cardWidth'),mobile('mobileGap','spiralGap'),{...number('mobileCardPadding','Mobile card padding',0,80),inherits:'cardPadding'},{...number('mobileCarouselPadding','Mobile carousel padding',0,64),inherits:'carouselPadding'},mobile('mobileSpiralWidth','spiralWidth'),...(list?[select('mobileHeightMode','Mobile height',{inherit:'Use main height',auto:'Auto',pixels:'Pixels',viewport:'Viewport'}),{...number('mobileStageHeight','Mobile height',120,1600),inherits:'stageHeight',when:['mobileHeightMode','pixels']},{...number('mobileViewportHeight','Window height',15,100,'%'),when:['mobileHeightMode','viewport']}]:[])),
 group('Theme',select('colorSource','Colors',{section:'Section theme',custom:'Custom'}),...when('colorSource','custom',[swatch('background','Background'),swatch('ink','Text'),swatch('accent','Accent')]),select('typeSource','Typography',{native:'Site typography',preset:'Layout default'})),
 existing.find(g=>g.title==='Popup')
 ];
}
