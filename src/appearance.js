import css from './appearance.css';

export const appearanceDefaults={
  borderWidth:0,borderColor:'#263448',shadow:'preset',overlayColor:'#142036',overlayOpacity:0,hoverEffect:'preset',
  spiralRadius:0, spiralRim:'#263448', backFace:'mirror', backColor:'#263448',
  edgeMode:'preset', edgeFade:12, controlSize:44, controlShape:'circle', arrowStyle:'arrow',
  controlPalette:'theme', controlFill:'#263448', controlInk:'#ffffff',
  titleSize:0, titleWeight:'inherit', titlePalette:'theme', titleColor:'#263448'
};
export function styleAppearance(host,options){
  host.classList.toggle('gc-finish',options.preset!=='spiral');

  if(!document.getElementById('gc-finish-css')){
    const style=document.createElement('style');style.id='gc-finish-css';style.textContent=css;document.head.append(style);
  }
  host.dataset.gcEdges = options.edgeMode;
  host.dataset.gcBack = options.backFace;
  host.dataset.gcControlShape = options.controlShape;
  host.dataset.gcArrows = options.arrowStyle;
  host.dataset.gcControlPalette = options.controlPalette;
  host.dataset.gcTitlePalette = options.titlePalette;
  host.toggleAttribute('data-gc-title-size', options.titleSize > 0);
  host.toggleAttribute('data-gc-title-weight', options.titleWeight !== 'inherit');
  const variables = {
    '--gc-edge-direction': ['wall','spiral'].includes(options.preset) ? 'to bottom' : 'to right',
    '--gc-edge-fade': options.edgeFade + '%', '--gc-back-color': options.backColor,
    '--gc-control-size': options.controlSize + 'px', '--gc-control-fill': options.controlFill,
    '--gc-control-ink': options.controlInk, '--gc-title-size': options.titleSize + 'rem',
    '--gc-title-weight': options.titleWeight, '--gc-title-color': options.titleColor,
  };
  for (const [key,value] of Object.entries(variables)) host.style.setProperty(key,value);
  host.dataset.gcShadow=options.shadow;
  host.dataset.gcHover=options.hoverEffect;
  host.toggleAttribute('data-gc-still',!!options.reducedMotion);
  host.style.setProperty('--gc-finish-radius',options.radius+'px');
  host.style.setProperty('--gc-line-size',options.borderWidth+'px');
  host.style.setProperty('--gc-line-color',options.borderColor);
  host.style.setProperty('--gc-tint',options.overlayColor);
  host.style.setProperty('--gc-tint-opacity',Number(options.overlayOpacity)/100);
}
