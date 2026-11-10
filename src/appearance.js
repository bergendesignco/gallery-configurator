import css from './appearance.css';

export const appearanceDefaults={
  borderWidth:0,borderColor:'#263448',shadow:'preset',overlayColor:'#142036',overlayOpacity:0,hoverEffect:'preset'
};
export function styleAppearance(host,options){
  host.classList.toggle('gc-finish',options.preset!=='spiral');
  if(options.preset==='spiral')return;
  if(!document.getElementById('gc-finish-css')){
    const style=document.createElement('style');style.id='gc-finish-css';style.textContent=css;document.head.append(style);
  }
  host.dataset.gcShadow=options.shadow;
  host.dataset.gcHover=options.hoverEffect;
  host.toggleAttribute('data-gc-still',!!options.reducedMotion);
  host.style.setProperty('--gc-finish-radius',options.radius+'px');
  host.style.setProperty('--gc-line-size',options.borderWidth+'px');
  host.style.setProperty('--gc-line-color',options.borderColor);
  host.style.setProperty('--gc-tint',options.overlayColor);
  host.style.setProperty('--gc-tint-opacity',Number(options.overlayOpacity)/100);
}
