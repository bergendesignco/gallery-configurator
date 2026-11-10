// Playback is an integration layer. The imported carousel owns all geometry,
// manual momentum, snapping, curved strips and project selection unchanged.
export function attachCarouselPlayback(root, carousel, {pauseOnHover=true,interactionRestMs=6000}={}) {
  const button = root.querySelector('[data-orbit-toggle]');
  const events = new AbortController();
  const on = (target,type,handler) => target.addEventListener(type,handler,{signal:events.signal});
  const original = {
    animateTo:carousel.animateTo,
    settleImmediately:carousel.settleImmediately,
    openProject:carousel.openProject,
  };
  Object.assign(carousel, {
    manuallyPaused:false, hovered:false, keyboardFocused:false, inView:false,
    autoFrame:0, autoTime:0, resumeAt:0,
  });
  let timer = 0;
  let destroyed = false;
  const isFocusPause = target => !!target && root.contains(target) &&
    (target.matches(':focus-visible') || !!target.closest('.orbit-card'));
  const canPlay = () => !destroyed && carousel.count>1 && carousel.inView &&
    !carousel.hovered && !carousel.keyboardFocused && !carousel.manuallyPaused &&
    !carousel.pointer && !carousel.frame && !carousel.viewer.dialog.open &&
    !document.hidden && !carousel.reducedMotion.matches;
  const stop = () => {
    cancelAnimationFrame(carousel.autoFrame);clearTimeout(timer);
    carousel.autoFrame=0;timer=0;carousel.autoTime=0;
    root.classList.remove('is-autoplaying');
    carousel.status?.setAttribute('aria-live','polite');
  };
  const tick = time => {
    carousel.autoFrame=0;
    if(!canPlay()){stop();return;}
    const dt=Math.min(.05,Math.max(0,(time-carousel.autoTime)/1000));
    carousel.autoTime=time;
    carousel.position=(carousel.position+dt/8)%carousel.count;
    carousel.target=carousel.position;carousel.velocity=0;
    carousel.render();
    carousel.autoFrame=requestAnimationFrame(tick);
  };
  const sync = () => {
    if(!canPlay()){stop();return;}
    const remaining=carousel.resumeAt-performance.now();
    if(remaining>0){stop();timer=setTimeout(sync,remaining);return;}
    if(carousel.autoFrame)return;
    carousel.autoTime=performance.now();
    root.classList.add('is-autoplaying');
    carousel.status?.setAttribute('aria-live','off');
    carousel.autoFrame=requestAnimationFrame(tick);
  };
  const defer = (delay=6000) => {stop();carousel.resumeAt=performance.now()+delay;};
  carousel.animateTo=function(...args){defer(interactionRestMs);original.animateTo.apply(this,args);sync();};
  carousel.settleImmediately=function(...args){original.settleImmediately.apply(this,args);sync();};
  carousel.openProject=function(...args){defer();original.openProject.apply(this,args);sync();};
  if(pauseOnHover){
    on(root,'pointerenter',event=>{if(event.pointerType!=='touch'){carousel.hovered=true;sync();}});
    on(root,'pointerleave',event=>{if(event.pointerType!=='touch'){carousel.hovered=false;sync();}});
  }
  on(root,'focusin',event=>{carousel.keyboardFocused=isFocusPause(event.target);sync();});
  on(root,'focusout',event=>{carousel.keyboardFocused=isFocusPause(event.relatedTarget);sync();});
  on(root,'pointerup',()=>{defer(interactionRestMs);sync();});
  on(root,'pointercancel',()=>{defer(interactionRestMs);sync();});
  on(carousel.viewer.dialog,'close',()=>{defer();sync();});
  on(document,'visibilitychange',sync);
  on(carousel.reducedMotion,'change',sync);
  on(button,'click',()=>{
    carousel.manuallyPaused=!carousel.manuallyPaused;carousel.resumeAt=0;
    button.dataset.paused=String(carousel.manuallyPaused);
    button.setAttribute('aria-label',carousel.manuallyPaused?'Resume carousel':'Pause carousel');
    sync();
  });
  const observer=new IntersectionObserver(entries=>{
    carousel.inView=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.15);
    sync();
  },{threshold:.15});
  observer.observe(carousel.stage);
  carousel.stopAutoplay=stop;
  carousel.syncAutoplay=sync;
  return () => {
    destroyed=true;stop();events.abort();observer.disconnect();
    Object.assign(carousel,original);
  };
}
