// Keep page-level smooth scrolling from consuming gestures inside plugin UI.
// The browser still handles native scrolling, selection, and pinch zoom.
export function containScroll(element) {
  element.setAttribute('data-lenis-prevent', '');
  for (const type of ['wheel', 'touchmove']) {
    element.addEventListener(type, event => event.stopPropagation(), {passive: true});
  }
}
