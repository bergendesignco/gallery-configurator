// Keep the slot in the source's flow. Its left edge stays measurable while
// the child stage spans the viewport, including in an off-center column.
export function fitViewport(slot, host, source, type) {
  const document = source.ownerDocument;
  const view = document.defaultView;
  const cell = type !== 'list' ? source.closest('.fluid-engine > .fe-block') : null;
  cell?.classList.add('gc-viewport-cell');

  // Only release clippers belonging to this source. A full-width section or
  // Fluid Engine can still clip its own edges and contain neighboring blocks.
  const clipping = [];
  const boundary = cell || source;
  for (let node = slot.parentElement; node; node = node.parentElement) {
    if (['hidden', 'clip', 'auto', 'scroll'].includes(view.getComputedStyle(node).overflowX)) {
      clipping.push(node);
    }
    if (node === boundary) break;
  }

  function measure() {
    const width = document.documentElement.clientWidth;
    if (!width || !slot.isConnected || !slot.getClientRects().length) return;
    for (const node of clipping) {
      const left = node.getBoundingClientRect().left + view.scrollX + node.clientLeft;
      const clipsStage = left > 0.5 || left + node.clientWidth < width - 0.5;
      node.classList.toggle('gc-viewport-unclip', clipsStage);
    }
    const shift = -(slot.getBoundingClientRect().left + view.scrollX);
    const set = (name, value) => {
      if (host.style.getPropertyValue(name) !== value) host.style.setProperty(name, value);
    };
    set('--gc-viewport-width', width + 'px');
    set('--gc-viewport-offset', shift + 'px');
  }

  measure();
  const resize = view.ResizeObserver ? new view.ResizeObserver(measure) : null;
  resize?.observe(slot);
  resize?.observe(document.documentElement);
  view.addEventListener('resize', measure);
  return () => {
    resize?.disconnect();
    view.removeEventListener('resize', measure);
    for (const node of clipping) node.classList.remove('gc-viewport-unclip');
    cell?.classList.remove('gc-viewport-cell');
    host.style.removeProperty('--gc-viewport-width');
    host.style.removeProperty('--gc-viewport-offset');
  };
}
