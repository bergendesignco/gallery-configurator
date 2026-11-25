import { setTransportIcon } from '../transport-icons.js';

/** Spatial galleries. Content and click actions are supplied by the host. */
let spatialId = 0;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const wrap = (value, length) => ((value % length) + length) % length;
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const TAU = Math.PI * 2;

export function mountSpatial(ctx) {
  const { host, makeCard, nativeList } = ctx;
  const items = Array.isArray(ctx.items) ? ctx.items : [];
  const options = ctx.options || {};
  const kind = ['wall', 'ring', 'angled'].includes(options.preset) ? options.preset : 'wall';
  const reduced = Boolean(options.reducedMotion) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = items.length;
  const minimumSlots = kind === 'ring' ? 16 : kind === 'wall' ? 12 : count;
  const slotCount = !reduced && count > 1 && count < 12 && kind !== 'angled' ? Math.ceil(minimumSlots / count) * count : count;
  const primarySlots = Array.from({ length: count }, (_, index) => index);
  const depth = clamp(number(options.depth, 55), 0, 100);
  const requestedWidth = clamp(number(options.cardWidth, 280), 80, 900);
  const gap = clamp(number(options.gap, 24), 0, 160);
  const duration = Math.max(1, number(options.duration, 5));
  const abort = new AbortController();
  const listen = (target, event, listener, config = {}) => target.addEventListener(event, listener, { ...config, signal: abort.signal });
  const labels = { wall: 'Curved image gallery', ring: 'Circular image gallery', angled: 'Angled image gallery' };
  const id = `gc-spatial-help-${++spatialId}`;
  const classes = ['gc-spatial', `gc-${kind}`, ...(reduced ? ['gc-spatial-reduced'] : [])];
  host.classList.add(...classes);
  const previousStyles = new Map();
  const setHostStyle = (property, value) => {
    previousStyles.set(property, host.style.getPropertyValue(property));
    host.style.setProperty(property, value);
  };
  setHostStyle('--gc-spatial-height', `${clamp(number(options.stageHeight, 620), 300, 1400)}px`);
  setHostStyle('--gc-spatial-radius', `${clamp(number(options.radius, 18), 0, 100)}px`);
  setHostStyle('--gc-spatial-fit', options.fit === 'contain' ? 'contain' : 'cover');
  setHostStyle('--gc-spatial-card-width', `${requestedWidth}px`);
  setHostStyle('--gc-spatial-gap', `${gap}px`);

  const canvas = nativeList?.track ?? document.createElement('div');
  canvas.classList.add('gc-spatial-canvas');
  if (nativeList) canvas.classList.add('gc-spatial-native-track');
  canvas.setAttribute('role', nativeList ? 'list' : 'group');
  canvas.setAttribute('aria-label', labels[kind]);
  canvas.setAttribute('aria-describedby', id);
  const help = document.createElement('p');
  help.id = id;
  help.className = 'gc-spatial-sr';
  help.textContent = 'Use the left and right arrow keys to explore items. Press Enter to open an item. You can also drag horizontally.';
  const live = document.createElement('span');
  live.className = 'gc-spatial-sr';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  host.append(help, canvas, live);

  // In the rotating ring, the selected title belongs in the center.
  const tileCaption = options.showTitles !== false && (kind !== 'ring' || reduced || count === 1);
  const cards = Array.from({ length: slotCount }, (_, index) => {
    const sourceIndex = index % count;
    const item = items[sourceIndex];
    const card = makeCard(item, sourceIndex, { caption: tileCaption, description: false, thumbnail: true });
    const position = nativeList?.slot(card) ?? document.createElement('div');
    position.classList.add('gc-spatial-position');
    card.classList.add('gc-spatial-card');
    card.dataset.spatialIndex = String(index);
    card.dataset.spatialSourceIndex = String(sourceIndex);
    card.tabIndex = index === 0 ? 0 : -1;
    if (index >= count) card.setAttribute('aria-hidden', 'true');
    if (!card.getAttribute('aria-label') && !card.textContent.trim()) {
      card.setAttribute('aria-label', `View item ${sourceIndex + 1}`);
    }
    if (!position.contains(card)) position.append(card);
    if (position.parentNode !== canvas) canvas.append(position);
    return { position, card, sourceIndex, x: 0, y: 0, flip: 0, tilt: 0, lift: 0 };
  });

  const nav = document.createElement('div');
  nav.className = 'gc-spatial-nav';
  const button = (icon, label) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = 'gc-spatial-control';
    element.setAttribute('aria-label', label);
    return setTransportIcon(element, icon);
  };
  const previous = button('previous', 'Previous item');
  const next = button('next', 'Next item');
  const counter = document.createElement('span');
  counter.className = 'gc-spatial-count';
  counter.setAttribute('aria-hidden', 'true');
  nav.append(previous, counter, next);
  const playback = options.autoplay && !reduced ? button('playback', 'Pause gallery motion') : null;
  if (playback) {
    playback.disabled = count < 2;
    playback.dataset.paused = String(count < 2);
    if (playback.disabled) playback.setAttribute('aria-label', 'Play gallery motion');
    nav.append(playback);
  }
  host.append(nav);
  previous.disabled = next.disabled = count < 2;

  let ringCenter;
  let ringLabel;
  if (kind === 'ring' && count > 1 && !reduced) {
    ringCenter = document.createElement('div');
    ringCenter.className = 'gc-ring-center';
    ringCenter.setAttribute('aria-hidden', 'true');
    if (options.showTitles !== false) {
      ringLabel = document.createElement('span');
      ringLabel.className = 'gc-ring-label';
      ringCenter.append(ringLabel);
    }
    const instruction = document.createElement('span');
    instruction.textContent = 'Drag to explore';
    ringCenter.append(instruction);
    canvas.after(ringCenter);
  }
  let empty;
  if (!count) {
    empty = document.createElement(nativeList ? 'li' : 'p');
    empty.className = 'gc-spatial-empty';
    empty.textContent = 'No items available.';
    canvas.append(empty);
  }

  let destroyed = false;
  let active = 0;
  let selected = -1;
  let width = 1;
  let height = 1;
  let cardWidth = 1;
  let cardHeight = 1;
  let step = 1;
  let ringRadius = 1;
  let ringLabelRoom = 0;
  let wallRows = 1;
  let wallColumns = 1;
  let position = 0;
  let destination = 0;
  let autoplayDirection = 1;
  let playing = Boolean(options.autoplay) && !reduced && count > 1;
  let suspended = false;
  let hovered = false;
  let focused = false;
  let inView = true;
  let drag = null;
  let suppressedClickUntil = 0;
  let animation = 0;
  let lastTime = 0;
  let hoveredCard = -1;
  let synchronizingFocus = false;
  const pointer = { x: -10000, y: -10000, inside: false };

  function updateRingLabel(index = active) {
    if (!ringLabel) return;
    const title = typeof items[index]?.title === 'string' ? items[index].title.trim() : '';
    if (ringLabel.textContent === title && ringLabel.hidden === !title) return;
    ringLabel.textContent = title;
    ringLabel.hidden = !title;
    fitRingLabel();
  }

  function fitRingLabel() {
    if (!ringCenter || destroyed) return;
    // Test the real site font at the width of a square inside the ring.
    // When the label is taller, the same element becomes a full-width caption.
    ringCenter.classList.remove('is-below');
    if (ringCenter.offsetHeight > ringLabelRoom) ringCenter.classList.add('is-below');
  }

  function select(index, announce = false, preferredSlot = null) {
    if (!count) { counter.textContent = '00 / 00'; return; }
    const nextActive = wrap(index, count);
    const validSlot = preferredSlot !== null && cards[preferredSlot]?.sourceIndex === nextActive;
    const slotChanged = validSlot && primarySlots[nextActive] !== preferredSlot;
    if (validSlot) {
      const oldPrimary = cards[primarySlots[nextActive]].card;
      primarySlots[nextActive] = preferredSlot;
      if (slotChanged) {
        // Expose the replacement before transferring focus and hiding the old
        // instance, so a focused button is never inside aria-hidden content.
        cards[preferredSlot].card.removeAttribute('aria-hidden');
        nativeList?.syncFocus(cards[preferredSlot].card);
        if (document.activeElement === oldPrimary) {
          synchronizingFocus = true;
          cards[preferredSlot].card.focus({ preventScroll: true });
          synchronizingFocus = false;
        }
      }
    }
    if (selected === nextActive && !slotChanged) {
      if (announce) live.textContent = `Item ${nextActive + 1} of ${count}${items[nextActive].title ? `: ${items[nextActive].title}` : ''}`;
      return;
    }
    active = nextActive;
    updateRingLabel();
    counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    cards.forEach(({ card, sourceIndex }, i) => {
      const primary = primarySlots[sourceIndex] === i;
      card.tabIndex = primary && sourceIndex === active ? 0 : -1;
      card.classList.toggle('is-selected', primary && sourceIndex === active);
      if (primary) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
      if(nativeList)nativeList.syncFocus(card);
      else {const link=card.querySelector('.gc-card-button');if(link)link.tabIndex=card.tabIndex;}
    });
    if (announce) live.textContent = `Item ${active + 1} of ${count}${items[active].title ? `: ${items[active].title}` : ''}`;
    if (selected !== active) {
      selected = active;
      ctx.onChange?.(active);
    }
  }

  function setPlaying(value) {
    playing = Boolean(value) && !reduced && count > 1;
    if (playback) {
      playback.dataset.paused = String(!playing);
      playback.setAttribute('aria-label', playing ? 'Pause gallery motion' : 'Play gallery motion');
    }
    wake();
  }

  function setSuspended(value) {
    suspended = Boolean(value);
    if (!suspended) wake();
  }

  function nearestCycle(value, target, length) {
    return target + Math.round((value - target) / length) * length;
  }

  function nearestSlot(sourceIndex) {
    let best = { index: primarySlots[sourceIndex], target: sourceIndex, distance: Infinity };
    cards.forEach((entry, index) => {
      if (entry.sourceIndex !== sourceIndex) return;
      let target = index;
      if (kind === 'ring') target = nearestCycle(position, index, slotCount);
      else if (kind === 'wall') {
        const column = Math.floor(index / wallRows);
        target = wallColumns > 2 ? nearestCycle(position, column, wallColumns) : column;
      }
      const distance = Math.abs(target - position);
      if (distance < best.distance) best = { index, target, distance };
    });
    return best;
  }

  function horizontalCenter(element) {
    const rect = element.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  function selectScrolledCard() {
    if (count < 2) return;
    const first = horizontalCenter(cards[0].position);
    const stride = horizontalCenter(cards[1].position) - first;
    if (Math.abs(stride) < 1) return;
    const index = clamp(Math.round((horizontalCenter(canvas) - first) / stride), 0, count - 1);
    select(index, false, index);
  }

  function goTo(index, focus = false) {
    if (!count) return;
    const nextIndex = wrap(Math.round(number(index, 0)), count);
    const visual = reduced ? { index: nextIndex, target: nextIndex } : nearestSlot(nextIndex);
    select(nextIndex, true, visual.index);
    if (reduced) {
      const card = cards[nextIndex].position;
      canvas.scrollTo({ left: canvas.scrollLeft + horizontalCenter(card) - horizontalCenter(canvas), behavior: 'auto' });
    } else {
      destination = visual.target;
    }
    if (focus) cards[visual.index].card.focus({ preventScroll: true });
    wake();
  }

  function updateLayout() {
    if (destroyed) return;
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    if (kind === 'ring') {
      const availableDiameter = Math.max(80, Math.min(width - 32, height - 42));
      const diameter = clamp(number(options.ringDiameter, availableDiameter), 80, availableDiameter);
      ringRadius = Math.max(0, diameter * 0.38);
      const arcSlot = TAU * ringRadius / Math.max(1, slotCount);
      const maximumCard = Math.min(diameter * 0.17, arcSlot * 0.8);
      // Keep the circle fixed; more spacing makes each thumbnail occupy less
      // of its arc slot. The default 24px gap preserves the baseline size.
      const spacingScale = 1.15 - clamp(gap, 0, 100) / 160;
      cardWidth = count <= 1 ? Math.min(requestedWidth, width * 0.65, height * 0.58) : Math.max(18, Math.min(Math.min(requestedWidth * 0.22, maximumCard) * spacingScale, arcSlot * 0.94));
      cardHeight = cardWidth * 1.28;
      if (ringCenter) {
        const innerRadius = Math.max(0, ringRadius - Math.max(32, cardHeight) / 2 - 10);
        ringLabelRoom = Math.floor(innerRadius * Math.SQRT2);
        ringCenter.style.setProperty('--gc-ring-label-width', `${ringLabelRoom}px`);
        ringCenter.style.setProperty('--gc-ring-label-y', `${canvas.offsetTop + height / 2}px`);
        fitRingLabel();
      }
      step = Math.max(24, TAU * Math.max(1, ringRadius) / Math.max(1, slotCount));
    } else if (kind === 'wall') {
      wallRows = slotCount >= 10 ? 3 : slotCount >= 4 ? 2 : 1;
      wallColumns = Math.max(1, Math.ceil(slotCount / wallRows));
      cardHeight = Math.min((height - 56 - (wallRows - 1) * gap) / wallRows, requestedWidth * 0.62, 230);
      cardWidth = Math.max(60, Math.min(cardHeight * 1.5, requestedWidth, width * 0.43));
      cardHeight = cardWidth / 1.5;
      step = cardWidth + Math.min(gap, 70);
    } else {
      cardWidth = Math.min(requestedWidth, width * 0.68, (height - 70) * 0.76);
      cardHeight = cardWidth / 0.76;
      step = cardWidth * (0.72 + (100 - depth) * 0.001) + gap;
    }
    cards.forEach(({ position: element }) => {
      element.style.width = `${Math.max(24, cardWidth)}px`;
      element.style.height = `${Math.max(32, cardHeight)}px`;
    });
    if (reduced) {
      cards.forEach(({ position: element }) => {
        element.style.width = `${Math.min(requestedWidth, width * 0.72)}px`;
        element.style.height = `${Math.min(height - 40, requestedWidth * 1.15)}px`;
      });
    }
    wake();
  }

  function draw(dt) {
    if (reduced || !count || suspended) return false;
    const auto = playing && !(options.pauseOnHover && hovered) && !focused && !drag && inView && !document.hidden;
    if (auto) {
      const advance = dt / duration;
      if (kind === 'angled') {
        destination += advance * autoplayDirection;
        if (destination >= count - 1) { destination = count - 1; autoplayDirection = -1; }
        if (destination <= 0) { destination = 0; autoplayDirection = 1; }
      } else {
        destination += advance;
      }
    }
    const smoothing = drag?.moved ? 1 : 1 - Math.exp(-dt * 11);
    position += (destination - position) * smoothing;
    if (Math.abs(destination - position) < 0.0001) position = destination;
    let moving = Math.abs(destination - position) > 0.0001 || auto;
    if (auto || drag?.moved) {
      const selectionPosition = drag?.moved ? position : destination;
      const index = kind === 'wall' ? Math.round(selectionPosition) * wallRows + primarySlots[active] % wallRows : Math.round(selectionPosition);
      const slot = kind === 'wall' ? Math.min(wrap(index, wallColumns * wallRows), slotCount - 1) : wrap(index, slotCount);
      select(cards[slot].sourceIndex, false, slot);
    }
    const ease = 1 - Math.exp(-dt * 13);
    cards.forEach((entry, index) => {
      const { position: element, card } = entry;
      if (kind === 'ring') {
        const angle = -Math.PI / 2 + (index - position) * TAU / slotCount;
        entry.x = count === 1 ? 0 : Math.cos(angle) * ringRadius;
        entry.y = count === 1 ? 0 : Math.sin(angle) * ringRadius;
        const distance = Math.hypot(pointer.x - (width / 2 + entry.x), pointer.y - (height / 2 + entry.y));
        const reach = Math.max(65, cardWidth * 2.6);
        const proximity = pointer.inside && !drag?.moved ? Math.max(0, 1 - distance / reach) : 0;
        const flip = proximity * proximity * (50 + depth * 1.3);
        entry.flip += (flip - entry.flip) * ease;
        if (Math.abs(entry.flip - flip) > 0.05) moving = true;
        card.toggleAttribute("data-gc-back-facing", entry.flip > 90);
        const radialRotation = count === 1 ? 0 : angle * 180 / Math.PI + 90;
        element.style.transform = `translate3d(${entry.x}px,${entry.y}px,0) rotate(${radialRotation}deg)`;
        card.style.transform = `perspective(700px) rotateY(${entry.flip}deg) translateZ(${proximity * 12}px)`;
        element.style.zIndex = String(index === hoveredCard ? slotCount + 2 : 1);
      } else if (kind === 'wall') {
        const row = index % wallRows;
        const column = Math.floor(index / wallRows);
        let offset = column - position;
        if (wallColumns > 2) {
          const centerOffset = wallColumns % 2 === 0 ? 0.5 : 0;
          offset = wrap(offset - centerOffset + wallColumns / 2, wallColumns) - wallColumns / 2;
        }
        const angularStep = Math.min(0.68, 2.6 / Math.max(3, wallColumns));
        const angle = offset * angularStep;
        const radius = Math.max(step / angularStep, width * 0.4);
        const curvature = depth / 100;
        const x = Math.sin(angle) * radius;
        const z = (1 - Math.cos(angle)) * radius * curvature * 0.65;
        const y = (row - (wallRows - 1) / 2) * (cardHeight + Math.min(gap, 50));
        const targetLift = index === hoveredCard || (focused && index === primarySlots[active]) ? 1 : 0;
        entry.lift += (targetLift - entry.lift) * ease;
        if (Math.abs(targetLift - entry.lift) > 0.002) moving = true;
        element.style.transform = `translate3d(${x}px,${y}px,${z + entry.lift * 20}px) rotateY(${-angle * 180 / Math.PI * curvature}deg)`;
        element.style.zIndex = String(Math.round(z) + (targetLift ? 1000 : 1));
        card.style.transform = `scale(${1 + entry.lift * 0.035})`;
        element.style.opacity = Math.abs(angle) > 1.6 ? '0' : '1';
        element.style.visibility = Math.abs(angle) > 1.6 ? 'hidden' : 'visible';
      } else {
        const offset = index - position;
        const targetLift = index === hoveredCard || (focused && index === primarySlots[active]) ? 1 : 0;
        entry.lift += (targetLift - entry.lift) * ease;
        if (Math.abs(targetLift - entry.lift) > 0.002) moving = true;
        const tilt = -(25 + depth * 0.28) * (1 - entry.lift);
        element.style.transform = `translate3d(${offset * step}px,${-entry.lift * 14}px,${entry.lift * 110}px) rotateY(${tilt}deg)`;
        element.style.zIndex = String(targetLift ? count + 2 : count - index);
        card.style.transform = 'none';
      }
    });
    return moving;
  }

  function tick(time) {
    animation = 0;
    if (destroyed) return;
    const dt = Math.min(0.05, Math.max(0.001, (time - (lastTime || time - 16.7)) / 1000));
    lastTime = time;
    const continuing = draw(dt);
    if (continuing && inView && !document.hidden) animation = requestAnimationFrame(tick);
    else lastTime = 0;
  }

  function wake() {
    if (!destroyed && !animation && !reduced) animation = requestAnimationFrame(tick);
  }

  if (reduced) listen(canvas, 'scroll', selectScrolledCard, { passive: true });
  listen(previous, 'click', () => goTo(active - 1));
  listen(next, 'click', () => goTo(active + 1));
  if (playback) listen(playback, 'click', () => setPlaying(!playing));
  listen(canvas, 'keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : active + (event.key === 'ArrowRight' ? 1 : -1);
    goTo(index, true);
  });
  listen(canvas, 'focusin', event => {
    focused = true;
    const card = event.target.closest?.('[data-spatial-index]');
    if (card && !synchronizingFocus) select(Number(card.dataset.spatialSourceIndex), false, Number(card.dataset.spatialIndex));
    wake();
  });
  listen(canvas, 'focusout', () => {
    queueMicrotask(() => {
      if (destroyed) return;
      focused = canvas.contains(document.activeElement);
      wake();
    });
  });
  listen(canvas, 'pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; pointer.inside = true; wake(); } });
  listen(canvas, 'pointerleave', () => { hovered = false; pointer.inside = false; hoveredCard = -1; updateRingLabel(); wake(); });
  listen(canvas, 'pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.inside = true;
    const card = event.target.closest?.('[data-spatial-index]');
    hoveredCard = card ? Number(card.dataset.spatialIndex) : -1;
    updateRingLabel(hoveredCard >= 0 ? cards[hoveredCard].sourceIndex : active);
    wake();
  });
  listen(canvas, 'pointerdown', event => {
    const card = event.target.closest?.('[data-spatial-index]');
    if (card) select(Number(card.dataset.spatialSourceIndex), false, Number(card.dataset.spatialIndex));
    if (reduced || count < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: destination, moved: false };
  });
  listen(window, 'pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx) * 1.2) { drag = null; return; }
      if (Math.abs(dx) < 7) return;
      drag.moved = true;
      canvas.classList.add('is-dragging');
      canvas.setPointerCapture?.(event.pointerId);
    }
    if (event.cancelable) event.preventDefault();
    destination = drag.start - dx / step;
    if (kind === 'angled' || (kind === 'wall' && wallColumns <= 2)) destination = clamp(destination, 0, kind === 'wall' ? wallColumns - 1 : count - 1);
    wake();
  }, { passive: false });
  const endDrag = event => {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.moved;
    drag = null;
    canvas.classList.remove('is-dragging');
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (moved) {
      suppressedClickUntil = performance.now() + 350;
      destination = Math.round(destination);
      const index = kind === 'wall' ? Math.round(destination) * wallRows + primarySlots[active] % wallRows : Math.round(destination);
      const slot = kind === 'wall' ? Math.min(wrap(index, wallColumns * wallRows), slotCount - 1) : wrap(index, slotCount);
      select(cards[slot].sourceIndex, true, slot);
    }
    wake();
  };
  listen(window, 'pointerup', endDrag);
  listen(window, 'pointercancel', endDrag);
  listen(canvas, 'click', event => {
    if (performance.now() < suppressedClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { capture: true });
  listen(canvas, 'dragstart', event => event.preventDefault());
  listen(document, 'visibilitychange', wake);

  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => {
    if (entries.some(entry => entry.target === canvas)) updateLayout();
    else fitRingLabel();
  }) : null;
  resize?.observe(canvas);
  if (ringCenter) resize?.observe(ringCenter);
  if (!resize) listen(window, 'resize', updateLayout);
  const intersection = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting ?? true;
    if (inView) wake();
  }, { rootMargin: '100px' }) : null;
  intersection?.observe(host);
  updateLayout();
  select(0);

  return {
    goTo,
    setPlaying,
    setSuspended,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(animation);
      resize?.disconnect();
      intersection?.disconnect();
      abort.abort();
      help.remove(); live.remove(); nav.remove(); ringCenter?.remove();
      if (nativeList) {
        empty?.remove();
      } else {
        canvas.remove();
      }
      host.classList.remove(...classes);
      previousStyles.forEach((value, property) => value ? host.style.setProperty(property, value) : host.style.removeProperty(property));
    }
  };
}
