// Keep each layout's native rules until the corresponding control is customized.
export function styleLayout(host, o) {
  const flag = (key, enabled) => host.toggleAttribute('data-finish-' + key, !!enabled);
  const variable = (key, value) => host.style.setProperty('--finish-' + key, value);
  function shadow(prefix, color) {
    const angle = o[prefix+'Angle'] * Math.PI / 180;
    const distance = o[prefix+'Distance'];
    return [Math.cos(angle)*distance, Math.sin(angle)*distance, o[prefix+'Blur'], o[prefix+'Spread']].map(n=>n+'px').join(' ')+' '+color;
  }
  for(const key of ['surfaceEnabled','cardBackground','cardShadow','imageBorder','shadowEnabled','bodyCustom','overlayEnabled']){
    flag(key.toLowerCase(),o[key]);
  }
  flag('padding',o.carouselPadding); flag('card-padding',o.cardPadding);
  flag('image-size',o.imageWidth!==100 || o.imageAlign!=='center');
  flag('original',o.aspectRatio==='original');flag('crop',o.aspectRatio && o.aspectRatio!=='layout'); flag('circle',o.aspectRatio==='circle');
  flag('order',o.cardOrder && o.cardOrder!=='layout');
  flag('align',o.cardAlign && o.cardAlign!=='layout');
  flag('equal',o.cardSizing==='equal'); flag('icon',o.controlIconSize); flag('button-padding',o.controlPadding);
  flag('clear-button',o.controlBackground===false);flag('title-align',o.titleAlign!=='inherit');
  flag('media-gap',o.mediaGap);flag('title-gap',o.titleGap);flag('button-gap',o.buttonGap);
  flag('mirror',o.mirrorOverlay && o.backFace==='mirror');variable('mirror',o.mirrorColor);
  flag('caption',o.showDescription || o.showButton);flag('image-padding',o.imagePadding);
  const values = {
    surface:o.surfaceColor, 'surface-radius':o.surfaceRadius+'px', 'carousel-padding':o.carouselPadding+'px',
    card:o.cardColor, 'card-padding':o.cardPadding+'px', 'card-shadow':shadow('cardShadow',o.cardShadowColor),
    'image-border':o.imageBorderSize+'px solid '+o.imageBorderColor,
    'image-radius':o.imageRadius+'px','image-width':o.imageWidth+'%', 'image-padding':o.imagePadding+'%',
    left:o.imageAlign==='left'?'0':'auto',right:o.imageAlign==='right'?'0':'auto',
    ratio:o.aspectRatio==='circle'?'1':o.aspectRatio==='original'?'auto':o.aspectRatio?.replace(':',' / '),
    order:o.cardOrder==='content'?-1:1,align:{top:'start',middle:'center',bottom:'end'}[o.cardAlign] || 'normal',
    'title-align':o.titleAlign,'description-align':o.descriptionAlign,'description-weight':o.descriptionWeight,
    'media-gap':o.mediaGap+'px','title-gap':o.titleGap+'px','button-gap':o.buttonGap+'px',
    icon:o.controlIconSize+'px','button-padding':o.controlPadding+'px',duration:o.hoverDuration+'ms'
  };
  for(const [key,value] of Object.entries(values))variable(key,value);
  if(o.cardBorderEnabled)host.style.setProperty('--gc-line-color',o.borderColor);
  host.style.setProperty('--gc-line-size',(o.cardBorderEnabled?o.borderWidth:0)+'px');
  host.style.setProperty('--gc-tint',o.imageTint);
  host.style.setProperty('--gc-tint-opacity','0');
}
