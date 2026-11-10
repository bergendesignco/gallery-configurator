export function mountStack({host, items, options, makeCard, onChange, nativeList}) {
  const height = Number(options.stageHeight) || 680;
  const visible = Math.max(300, height - 120);
  const gap = Math.max(0, Number(options.gap) || 0);
  const depth = Number.isFinite(Number(options.depth)) ? Number(options.depth) : 45;
  const pageScroll = options.previewScroll === false;
  const scrollTarget = pageScroll ? window : host;
  host.classList.add('gc-stack');
  host.style.height = pageScroll ? 'auto' : height + 'px';
  host.style.overflowY = pageScroll ? 'visible' : 'auto';
  host.style.overscrollBehavior = pageScroll ? '' : 'contain';
  host.setAttribute('tabindex', '0');
  host.setAttribute('aria-label', 'Stacked cards. Scroll to explore.');

  const track = nativeList?.track ?? document.createElement('div');
  track.classList.add('gc-stack-track');
  host.append(track);
  const cards = items.map((item, i) => {
    const card = makeCard(item, i, {caption: options.showTitles, description: true});
    const wrap = nativeList?.slot(card) ?? document.createElement('div');
    wrap.classList.add('gc-stack-slot');
    if (card.parentElement !== wrap) wrap.append(card);
    track.append(wrap);
    wrap.style.zIndex = i + 1;
    card.style.width = `min(${options.stackCardWidth}px,calc(100% - 48px))`;
    card.style.minHeight = visible + 'px';
    const labels = card.querySelectorAll('.gc-card-title, .gc-card-description, .list-item-content__title, .list-item-content__description, .list-item-content__button');
    const imageOnly = !Array.from(labels).some(node => !node.closest('[hidden]') && node.textContent.trim());
    card.classList.toggle('gc-stack-image-only', imageOnly);
    return {card, wrap, imageOnly, start: 0, duration: Infinity};
  });

  let frame = 0;
  function scrollPosition() {
    if (!pageScroll) return host.scrollTop;
    return -track.getBoundingClientRect().top;
  }
  function update() {
    frame = 0;
    const y = scrollPosition();
    let selected = 0;
    cards.forEach(({card, start, duration}, i) => {
      const p = Math.max(0, Math.min(1, (y - start) / duration));
      card.style.transform = options.reducedMotion ? 'none'
        : `perspective(1300px) translateY(${p * -32}px) scale(${1 - p * 0.14}) rotateX(${p * depth * 0.25}deg)`;
      card.style.filter = `brightness(${1 - p * 0.23})`;
      if (p >= 0.5) selected = Math.min(i + 1, cards.length - 1);
    });
    if (cards.length) onChange?.(selected);
  }
  function scroll() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function measure() {
    // Read untransformed sizes together, after wrapping, image or type changes.
    const sizes = cards.map(({card, wrap}) => ({height: card.offsetHeight, rowHeight: wrap.offsetHeight}));
    const viewport = pageScroll ? window.innerHeight : host.clientHeight;
    let offset = track.clientTop + (parseFloat(getComputedStyle(track).paddingTop) || 0);
    cards.forEach((slot, i) => {
      const {height, rowHeight} = sizes[i];
      // A tall card scrolls far enough to reveal its bottom before it sticks.
      const top = Math.min(40, viewport - 24 - height);
      slot.wrap.style.top = top + 'px';
      slot.start = offset - top;
      if (i) cards[i - 1].duration = Math.max(1, slot.start - cards[i - 1].start);
      // Preserve the shorter scroll step on photo-only cards that already fit.
      const overlap = slot.imageOnly && height <= viewport - 64 ? height * 0.24 : 0;
      const margin = i < cards.length - 1 ? gap - overlap : 0;
      slot.wrap.style.marginBottom = margin + 'px';
      offset += rowHeight + margin;
      if (i === cards.length - 1) {
        slot.duration = Infinity;
        track.style.paddingBottom = Math.max(40, viewport - top - rowHeight) + 'px';
      }
    });
    scroll();
  }

  let resize;
  measure();
  if (typeof ResizeObserver !== 'undefined') {
    resize = new ResizeObserver(measure);
    resize.observe(track, {box: 'border-box'});
    cards.forEach(({card}) => resize.observe(card, {box: 'border-box'}));
  }
  window.addEventListener('resize', measure);
  scrollTarget.addEventListener('scroll', scroll, {passive: true});
  return {
    goTo(index) {
      const slot = cards[Math.max(0, Math.min(cards.length - 1, Math.round(index)))];
      if (!slot) return;
      const top = pageScroll ? window.scrollY + slot.start - scrollPosition() : slot.start;
      scrollTarget.scrollTo({top, behavior: options.reducedMotion ? 'instant' : 'smooth'});
    },
    destroy() {
      resize?.disconnect();
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(frame);
      scrollTarget.removeEventListener('scroll', scroll);
      host.classList.remove('gc-stack');
      host.removeAttribute('tabindex');
      host.removeAttribute('aria-label');
      host.style.overflowY = '';
      host.style.overscrollBehavior = '';
      track.remove();
    },
  };
}
