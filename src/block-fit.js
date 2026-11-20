// A Fluid Engine gallery occupies its grid cell; its content must not enlarge it.
export function fitBlock(slot, host, source) {
  const cell = source.closest('.fluid-engine > .fe-block');
  if (!cell) return () => {}; // Classic blocks have content-driven height.
  source.classList.add('gc-block-bound');
  slot.classList.add('gc-block-slot');
  host.classList.add('gc-block-fit');
  let frame = 0, stopped = false;
  const watched = new WeakSet();
  const watch = node => { if (node && !watched.has(node)) { watched.add(node); resize.observe(node); } };
  const queue = () => { if (!frame && !stopped) frame = requestAnimationFrame(measure); };
  const resize = new ResizeObserver(queue);
  const mutation = new MutationObserver(queue);
  function measure() {
    frame = 0;
    if (stopped || !host.isConnected) return;
    const stage = host.querySelector('.orbit-stage,.gc-carousel-stage,.gc-spatial-canvas');
    if (!stage) return;
    const carousel = stage.classList.contains('gc-carousel-stage');
    let root = stage.parentElement;
    if (root.classList.contains('gc-block-stage-window')) root = root.parentElement;
    watch(root); watch(stage);
    let chrome = 0;
    for (const child of root.children) {
      if (child === stage || child.contains(stage)) continue;
      watch(child);
      const css = getComputedStyle(child);
      if (css.display === 'none' || ['absolute','fixed'].includes(css.position)) continue;
      chrome += child.offsetHeight + (parseFloat(css.marginTop)||0) + (parseFloat(css.marginBottom)||0);
    }
    const budget = Math.max(1, slot.clientHeight - chrome);
    if (carousel) {
      let window = stage.parentElement;
      if (!window.classList.contains('gc-block-stage-window')) {
        window = document.createElement('div'); window.className = 'gc-block-stage-window';
        stage.before(window); window.append(stage);
      }
      const scale = Math.min(1, budget / Math.max(1, stage.offsetHeight));
      window.style.height = budget + 'px';
      stage.style.setProperty('--gc-block-scale', String(scale));
      stage.style.setProperty('--gc-block-top', Math.max(0,(budget-stage.offsetHeight*scale)/2)+'px');
    } else {
      host.style.setProperty('--gc-block-stage-height', budget+'px');
    }
  }
  watch(slot); mutation.observe(host,{childList:true,subtree:true}); queue();
  return () => {
    stopped = true; cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect();
    source.classList.remove('gc-block-bound'); slot.classList.remove('gc-block-slot'); host.classList.remove('gc-block-fit');
    host.style.removeProperty('--gc-block-stage-height');
    const window = host.querySelector('.gc-block-stage-window');
    if (window) { const stage=window.firstElementChild; stage.style.removeProperty('--gc-block-scale'); stage.style.removeProperty('--gc-block-top'); window.replaceWith(stage); }
  };
}
