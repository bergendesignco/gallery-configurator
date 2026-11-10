// Starting a normal gallery never initializes the spiral renderer or its CDN modules.
export function mountSpiral(ctx) {
  const { host } = ctx;
  let options = { ...ctx.options };
  let destination = null;
  let engine = null;
  let disposed = false;
  let status = 'loading';

  const notice = document.createElement('p');
  notice.className = 'gc-empty';
  notice.setAttribute('role', 'status');
  notice.textContent = 'Loading spiral…';
  host.append(notice);

  import('./spiral.js').then(module => {
    if (disposed) return;
    notice.remove();
    engine = module.mountSpiral({ ...ctx, options });
    if (destination !== null) engine.goTo?.(destination);
  }).catch(error => {
    if (disposed) return;
    status = 'error';
    notice.textContent = 'The spiral could not load.';
    host.replaceChildren(notice);
    console.warn('Gallery Studio: spiral unavailable', error);
  });

  return {
    update(next) {
      options = { ...options, ...next };
      engine?.update?.(options);
    },
    goTo(index) {
      destination = index;
      engine?.goTo?.(index);
    },
    setPlaying(playing) {
      options.autoplay = playing;
      engine?.setPlaying?.(playing);
    },
    getStatus() { return engine?.getStatus?.() ?? status; },
    getMetrics() { return engine?.getMetrics?.() ?? null; },
    destroy() {
      disposed = true;
      notice.remove();
      engine?.destroy();
    },
  };
}
