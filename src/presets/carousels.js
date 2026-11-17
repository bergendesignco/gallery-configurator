import { setTransportIcon } from '../transport-icons.js';

const PRESETS = new Set(['infinite', 'arc', 'arc-tabs', 'showcase', 'timed']);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const modulo = (value, length) => ((value % length) + length) % length;
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(className, label, text) {
  const node = element('button', className, text);
  node.type = 'button';
  node.setAttribute('aria-label', label);
  return node;
}

function measureArc(preset, width, cardWidth, cardHeight, depth, gap) {
  const halfWidth = cardWidth / 2;
  const halfHeight = cardHeight / 2;
  const maxHalfStep = 0.26;
  const edge = width / 2 + 48; // Include shadows entering the viewport.
  // The lower corners are closest to the center of the circle. Leave enough
  // inner radius to fit the configured gap without exceeding the original tilt.
  const minInner = (cardWidth * Math.cos(maxHalfStep) + gap) / (2 * Math.sin(maxHalfStep));
  const radius = Math.max(
    width * ((preset === 'arc-tabs' ? 0.8 : 0.65) + (1 - depth) * 0.7),
    cardWidth * (3.8 - depth * 2.1),
    // Keep the visible sweep on the rising face of the circle. In particular,
    // a very tall caption mustn't turn the viewport edge into a vertical drop.
    halfHeight + Math.max(minInner, edge / Math.sin(Math.PI / 3)),
  );
  const inner = radius - halfHeight;
  const cornerAngle = Math.atan2(halfWidth, inner);
  const cornerRadius = Math.hypot(halfWidth, inner);
  const step = 2 * (cornerAngle + Math.asin(gap / (2 * cornerRadius)));

  // Budget repeated cards using the same lower corner as it crosses the
  // viewport edge, including a small allowance for its shadow.
  const lastAngle = cornerAngle + Math.asin(edge / cornerRadius);
  // As cards rotate, the upper corners sweep the outer circle. The lowest
  // point still inside the viewport lies on the lower edge's inner circle.
  const outer = radius + halfHeight;
  const above = Math.hypot(outer, halfWidth) - outer;
  const below = inner - Math.sqrt((inner - edge) * (inner + edge));
  return { radius, step, reach: lastAngle / step, above, below };
}

function measureFan(cardWidth, cardHeight, depth) {
  const halfHeight = cardHeight / 2;
  const lift = 10 + depth * 9;
  let above = 0, below = 0;
  // Bound each half-slide interval continuously: its greatest scale is at
  // the near end, its greatest rotation/drop at the far end.
  for (let near = 0; near < 4.1; near += 0.5) {
    const far = Math.min(4.1, near + 0.5);
    const scale = Math.max(0.48, 1 - near * (0.09 + depth * 0.035));
    const angle = (far * (4 + depth * 7) + (near === 0 ? 4 : 0)) * Math.PI / 180;
    const extent = scale * (halfHeight + cardWidth / 2 * Math.sin(angle)) - halfHeight;
    above = Math.max(above, extent - Math.min(near, 4) * lift);
    below = Math.max(below, extent + Math.min(far, 4) * lift);
  }
  return { above, below };
}

/** Five layouts share one drag, selection and playback clock. */
export function mountCarousel({ host, items = [], initialIndex = 0, options = {}, makeCard, onChange, nativeList, loadImage }) {
  const preset = PRESETS.has(options.preset) ? options.preset : 'infinite';
  const isArc = preset === 'arc' || preset === 'arc-tabs';
  const swept = isArc || preset === 'showcase';
  const count = items.length;
  const reduced = !!options.reducedMotion;
  const depth = clamp(finite(options.depth, 55), 0, 100) / 100;
  let gap, configuredWidth, phoneWidthOverride;
  function readGeometry(settings) {
    gap = clamp(finite(settings.gap, 24), 0, 180);
    configuredWidth = clamp(finite(settings.cardWidth, preset === 'timed' ? 760 : 380), 80, 1800);
    phoneWidthOverride = settings.phoneWidthOverride;
  }
  readGeometry(options);
  const interval = clamp(finite(options.duration, 5), 1, 60) * 1000;
  const root = element('section', `gc-carousel gc-preset-${preset}`);
  root.setAttribute('aria-roledescription', 'carousel');
  root.setAttribute('aria-label', {
    infinite: 'Infinite gallery', arc: 'Arc gallery', 'arc-tabs': 'Arc carousel',
    showcase: 'Stacked showcase', timed: 'Timed feature carousel',
  }[preset]);
  root.style.setProperty('--gc-card-radius', `${clamp(finite(options.radius, 14), 0, 120)}px`);
  root.style.setProperty('--gc-stage-height', `${clamp(finite(options.stageHeight, 0), 0, 1400)}px`);
  if (reduced) root.classList.add('gc-reduced-motion');

  const cleanups = [];
  const listen = (node, type, fn, opts) => {
    node.addEventListener(type, fn, opts);
    cleanups.push(() => node.removeEventListener(type, fn, opts));
  };
  const tabs = [];
  const dots = [];
  const useDots = options.navigation === 'dots' ||
    (options.navigation !== 'tabs' && items.some(item => !item.title?.trim()));
  // The timed carousel already has interactive progress dots below the cards.
  const hasTabs = preset === 'arc-tabs' || (preset === 'timed' && !useDots);
  const navigation = element('nav', 'gc-carousel-tabs');
  if (useDots) navigation.classList.add('gc-choice-dots');
  navigation.setAttribute('aria-label', 'Choose a slide');
  if (hasTabs) {
    items.forEach((item, index) => {
      const title = typeof item.title === 'string' ? item.title.trim() : '';
      const label = title || `Slide ${index + 1}`;
      const tab = useDots ? button('gc-choice-dot', label) : button('gc-carousel-tab', label, label);
      listen(tab, 'click', () => goTo(index));
      listen(tab, 'keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = modulo(index + 1, count);
        if (event.key === 'ArrowLeft') next = modulo(index - 1, count);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = count - 1;
        if (next === undefined) return;
        event.preventDefault();
        goTo(next);
        tabs[next]?.focus({ preventScroll: true });
      });
      navigation.append(tab);
      tabs.push(tab);
    });
    root.append(navigation);
  }

  const stage = element('div', 'gc-carousel-stage');
  stage.tabIndex = count ? 0 : -1;
  stage.setAttribute('aria-label', 'Gallery. Drag to browse, or use the left and right arrow keys.');
  const track = nativeList?.track ?? element('div', 'gc-carousel-track');
  track.classList.add('gc-carousel-track');
  stage.append(track);
  root.append(stage);

  function makeSlot(index) {
    const card = makeCard(items[index], index, {
      caption: options.showTitles !== false,
      description: preset === 'arc-tabs' || preset === 'timed',
    });
    card.classList.add('gc-carousel-card');
    card.dataset.gcItemIndex = String(index);
    card.style.width = 'var(--gc-carousel-slot-width)';
    card.tabIndex = -1;
    card.setAttribute('aria-hidden', 'true');
    if (!nativeList) card.querySelectorAll('img').forEach(img => {
      img.draggable = false;
      img.style.objectFit = options.fit === 'contain' ? 'contain' : 'cover';
    });
    const node = nativeList?.slot(card) ?? card;
    track.append(node);
    return { card, node, index, logical: index, active: false };
  }
  const originals = items.map((_, index) => makeSlot(index));
  const repeats = new Map();
  let mounted = false;

  const controls = element('div', 'gc-carousel-controls');
  const counter = element('div', 'gc-carousel-counter');
  counter.setAttribute('aria-hidden', 'true');
  const currentNumber = element('span', 'gc-carousel-current', count ? '01' : '00');
  counter.append(currentNumber, element('span', 'gc-carousel-divider', '/'),
    element('span', 'gc-carousel-total', String(count).padStart(2, '0')));
  const arrows = element('div', 'gc-carousel-arrows');
  const prev = setTransportIcon(button('gc-carousel-arrow', 'Previous slide'), 'previous');
  const next = setTransportIcon(button('gc-carousel-arrow', 'Next slide'), 'next');
  prev.disabled = next.disabled = count < 2;
  arrows.append(prev, next);
  const playback = setTransportIcon(button('gc-carousel-playback', 'Play slideshow'), 'playback');
  playback.hidden = count < 2 || reduced;
  const pagination = element('div', 'gc-carousel-pagination');
  pagination.setAttribute('aria-label', 'Slide pagination');
  if (preset === 'timed') {
    items.forEach((item, index) => {
      const dot = button('gc-carousel-dot', item.title?.trim() || `Go to slide ${index + 1}`);
      const fill = element('span', 'gc-carousel-dot-fill');
      fill.setAttribute('aria-hidden', 'true');
      dot.append(fill);
      listen(dot, 'click', () => goTo(index));
      pagination.append(dot);
      dots.push({ dot, fill });
    });
  }
  controls.append(counter, arrows);
  if (preset === 'timed') controls.append(pagination);
  controls.append(playback);
  root.append(controls);

  const status = element('p', 'gc-carousel-sr');
  status.setAttribute('aria-atomic', 'true');
  root.append(status);
  const cursor = element('span', 'gc-carousel-cursor', 'Drag');
  cursor.setAttribute('aria-hidden', 'true');
  if (preset === 'arc-tabs' || preset === 'showcase' || preset === 'arc') stage.append(cursor);
  host.append(root);

  let destroyed = false;
  let position = initialIndex;
  let target = initialIndex;
  let current = -1;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let playing = !!options.autoplay && !reduced && count > 1;
  let hovered = false;
  let focused = false;
  let offscreen = false;
  let suspended = false;
  let drag = null;
  let suppressClickUntil = 0;
  let width = 0;
  let height = 0;
  let cardWidth = 0;
  // Keep the original fan overlap at the preset's 28px spacing.
  const fanPitch = () => Math.max(12, cardWidth * (0.36 - depth * 0.12) + gap - 28);
  let trackHeight = -1;
  let arc;
  let dragStep = 1;
  let hoverTiltX = 0;
  let hoverTiltY = 0;

  const paused = () => suspended || hovered || focused || offscreen || document.hidden || !!drag;
  const nearest = index => {
    const selected = modulo(Math.round(position), count);
    let delta = modulo(index - selected, count);
    if (delta > count / 2) delta -= count;
    return Math.round(position) + delta;
  };

  function revealSelectedTab() {
    const selected = tabs[current];
    if (!selected) return;
    const left = selected.offsetLeft;
    const right = left + selected.offsetWidth;
    if (left < navigation.scrollLeft) navigation.scrollLeft = Math.max(0, left - 14);
    else if (right > navigation.scrollLeft + navigation.clientWidth) {
      navigation.scrollLeft = right - navigation.clientWidth + 14;
    }
  }

  function updateSelection() {
    const index = count ? modulo(Math.round(position), count) : -1;
    if (index === current) return;
    current = index;
    currentNumber.textContent = count ? String(index + 1).padStart(2, '0') : '00';
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-pressed', String(i === index));
    });
    revealSelectedTab();
    dots.forEach(({ dot }, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    const title = items[index]?.title;
    status.textContent = count ? `${index + 1} of ${count}${title ? `: ${title}` : ''}` : 'No gallery items';
    if (index >= 0) onChange?.(index);
  }

  function render() {
    if (destroyed || !width) return;
    updateSelection();
    const moving = Math.abs(target - position) > 0.002;
    root.classList.toggle('is-moving', moving || !!drag);
    const slots = [...originals];
    for (const slot of originals) {
      slot.logical = slot.index + Math.round((position - slot.index) / count) * count;
    }
    if (count > 1) {
      // Each original occupies its nearest turn. Duplicate only the other
      // occurrences that this particular stage can show at its edges.
      const pitch = cardWidth + gap;
      const anchor = preset === 'infinite' && width > 660 ? width * 0.61 : width / 2;
      let left = (anchor + cardWidth / 2 + 40) / pitch;
      let right = (width - anchor + cardWidth / 2 + 40) / pitch;
      if (isArc) {
        left = right = arc.reach;
      } else if (preset === 'showcase') {
        left = right = Math.min(4.1, (width / 2 + cardWidth) / fanPitch());
      }
      const first = Math.ceil(position - left), last = Math.floor(position + right);
      for (const [logical, slot] of repeats) {
        if (logical < first || logical > last || originals[slot.index].logical === logical) {
          slot.node.remove();
          repeats.delete(logical);
        }
      }
      for (let logical = first; logical <= last; logical++) {
        const index = modulo(logical, count);
        if (originals[index].logical === logical) continue;
        let slot = repeats.get(logical);
        if (!slot) {
          slot = makeSlot(index);
          slot.logical = logical;
          repeats.set(logical, slot);
          if (mounted && loadImage) slot.card.querySelectorAll('img').forEach(img => loadImage(img, { nativeCard: !!nativeList }));
        }
        slots.push(slot);
      }
    }
    slots.forEach(slot => {
      const distance = count === 1 ? 0 : slot.logical - position;
      const absolute = Math.abs(distance);
      const active = slot.logical === Math.round(position);
      let x = width / 2;
      let y = 0;
      let rotation = 0;
      let scale = 1;
      let opacity = 1;
      let visible = true;
      let rotateX = 0;
      let rotateY = 0;
      if (preset === 'infinite') {
        x = (width > 660 ? width * 0.61 : width / 2) + distance * (cardWidth + gap);
        opacity = 1 - Math.min(1, absolute) * 0.68;
        visible = x + cardWidth / 2 > -40 && x - cardWidth / 2 < width + 40;
      } else if (preset === 'timed') {
        x += distance * (cardWidth + gap);
        scale = 1 - Math.min(absolute, 1) * 0.035;
        visible = x + cardWidth / 2 > -40 && x - cardWidth / 2 < width + 40;
      } else if (preset === 'showcase') {
        x += distance * fanPitch();
        y += Math.min(absolute, 4) * (10 + depth * 9);
        scale = Math.max(0.48, 1 - absolute * (0.09 + depth * 0.035));
        rotation = distance * (4 + depth * 7);
        rotateY = -distance * (3 + depth * 4);
        opacity = clamp(1 - absolute * 0.19, 0, 1);
        visible = absolute < 4.1;
        if (active && !reduced) {
          rotateX = hoverTiltY;
          rotateY += hoverTiltX;
          rotation += clamp(target - position, -1, 1) * -3;
        }
      } else {
        const angle = distance * arc.step;
        x += arc.radius * Math.sin(angle);
        y = arc.radius * (1 - Math.cos(angle));
        rotation = angle * 180 / Math.PI;
        visible = absolute <= arc.reach;
        opacity = preset === 'arc-tabs' ? 1 - Math.min(absolute, 1) * 0.16 : 1;
      }
      slot.card.style.transform = `translate3d(${x}px,${y}px,0) translateX(-50%) rotate(${rotation}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      slot.card.style.zIndex = String(1000 - Math.round(absolute * 100));
      slot.card.style.opacity = String(opacity);
      slot.card.style.visibility = visible ? 'visible' : 'hidden';
      slot.card.style.pointerEvents = visible && opacity > 0.08 ? 'auto' : 'none';
      if (slot.active !== active) {
        slot.active = active;
        slot.card.classList.toggle('is-active', active);
      }
      slot.card.tabIndex = active ? 0 : -1;
      slot.card.setAttribute('aria-hidden', String(!active));
      nativeList?.syncFocus(slot.card);
    });
    dots.forEach(({ fill }, index) => {
      fill.style.transform = `scaleX(${index === current ? clamp(elapsed / interval, 0, 1) : 0})`;
    });
  }

  function measure() {
    const lastWidth = width;
    width = stage.clientWidth;
    const maxFraction = phoneWidthOverride ? 1 : preset === 'timed' ? 0.86 : preset === 'infinite' && width > 660 ? 0.48 : 0.76;
    const nextWidth = Math.max(80, Math.min(configuredWidth, width * maxFraction));
    if (nextWidth !== cardWidth) {
      cardWidth = nextWidth;
      track.style.setProperty('--gc-carousel-slot-width', `${cardWidth}px`);
    }
    if (swept) {
      const nextHeight = track.offsetHeight;
      if (width !== lastWidth || nextHeight !== trackHeight) {
        trackHeight = nextHeight;
        if (isArc) arc = measureArc(preset, width, cardWidth, trackHeight, depth, gap);
        const bounds = arc ?? measureFan(cardWidth, trackHeight, depth);
        if (count > 1) {
          stage.style.setProperty('--gc-sweep-above', Math.ceil(bounds.above) + 'px');
          stage.style.setProperty('--gc-sweep-below', Math.ceil(bounds.below) + 'px');
        }
      }
    }
    height = stage.clientHeight;
    dragStep = isArc ? arc.radius * arc.step : preset === 'showcase' ? cardWidth * 0.54 : cardWidth + gap;
    render();
  }

  function requestTick() {
    if (!destroyed && !frame) frame = requestAnimationFrame(tick);
  }

  function tick(time) {
    frame = 0;
    if (destroyed) return;
    const dt = lastTime ? clamp(time - lastTime, 0, 64) : 0;
    lastTime = time;
    if (!drag) {
      if (reduced) position = target;
      else position += (target - position) * (1 - Math.exp(-dt / 85));
      if (Math.abs(target - position) < 0.0005) position = target;
    }
    const settled = Math.abs(target - position) < 0.002 && !drag;
    if (playing && !paused() && settled) {
      elapsed += dt;
      if (elapsed >= interval) {
        elapsed = 0;
        target = Math.round(position) + 1;
      }
    }
    render();
    if (Math.abs(target - position) > 0.0005 || (playing && !paused())) requestTick();
    else lastTime = 0;
  }

  function goTo(index) {
    if (destroyed || count < 2) return;
    target = nearest(modulo(Math.round(finite(index, 0)), count));
    elapsed = 0;
    if (reduced) position = target;
    render();
    requestTick();
  }

  function step(direction) {
    if (count < 2) return;
    target = Math.round(target) + direction;
    elapsed = 0;
    if (reduced) position = target;
    render();
    requestTick();
  }

  function setPlaying(value) {
    playing = !!value && !reduced && count > 1;
    playback.dataset.paused = String(!playing);
    playback.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    playback.setAttribute('aria-pressed', String(playing));
    status.setAttribute('aria-live', playing ? 'off' : 'polite');
    root.classList.toggle('is-playing', playing);
    lastTime = 0;
    requestTick();
  }

  function setSuspended(value) {
    suspended = !!value;
    lastTime = 0;
    requestTick();
  }

  listen(prev, 'click', () => step(-1));
  listen(next, 'click', () => step(1));
  listen(playback, 'click', () => setPlaying(!playing));
  listen(stage, 'keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      stage.focus({ preventScroll: true });
      step(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      stage.focus({ preventScroll: true });
      goTo(event.key === 'Home' ? 0 : count - 1);
    }
  });

  listen(stage, 'pointerdown', event => {
    if (count < 2 || event.button !== 0 || !event.isPrimary) return;
    drag = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      start: position, lastX: event.clientX, lastTime: performance.now(),
      velocity: 0, moved: false, axis: null,
    };
    target = position;
    elapsed = 0;
  });
  listen(stage, 'pointermove', event => {
    const bounds = stage.getBoundingClientRect();
    const visualScale = bounds.width / Math.max(1, stage.clientWidth) || 1;
    const localX = (event.clientX - bounds.left) / visualScale;
    const localY = (event.clientY - bounds.top) / visualScale;
    cursor.style.left = `${localX}px`;
    cursor.style.top = `${localY}px`;
    if (event.pointerType === 'mouse') stage.classList.add('has-pointer');
    if (!drag) {
      if (preset === 'showcase' && !reduced) {
        hoverTiltX = clamp((localX - width / 2) / cardWidth, -1, 1) * 4;
        hoverTiltY = clamp((localY - height / 2) / height, -0.5, 0.5) * -5;
        render();
      }
      return;
    }
    if (event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.axis && Math.hypot(dx, dy) > 6) {
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      if (drag.axis === 'horizontal') {
        stage.setPointerCapture(event.pointerId);
        stage.classList.add('is-dragging');
      }
    }
    if (drag.axis !== 'horizontal') return;
    event.preventDefault();
    drag.moved = true;
    const now = performance.now();
    const dt = Math.max(8, now - drag.lastTime);
    const velocity = -(event.clientX - drag.lastX) / visualScale / dragStep / dt;
    drag.velocity = drag.velocity * 0.45 + velocity * 0.55;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    position = drag.start - dx / visualScale / dragStep;
    target = position;
    render();
  }, { passive: false });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const previous = drag;
    drag = null;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    stage.classList.remove('is-dragging');
    if (previous.moved) {
      suppressClickUntil = performance.now() + 400;
      const age = performance.now() - previous.lastTime;
      const momentum = reduced || event.type === 'pointercancel' || age > 120 ? 0 : clamp(previous.velocity * 210, -4, 4);
      target = Math.round(position + momentum);
    } else target = Math.round(position);
    if (reduced) position = target;
    requestTick();
  }
  listen(stage, 'pointerup', endDrag);
  listen(stage, 'pointercancel', endDrag);
  // Pointerup can occur outside before horizontal capture begins.
  listen(window, 'pointerup', endDrag);
  listen(stage, 'lostpointercapture', event => {
    if (drag?.id === event.pointerId) endDrag(event);
  });
  listen(stage, 'dragstart', event => event.preventDefault());
  listen(stage, 'click', event => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const card = event.target.closest('.gc-carousel-card');
    if (!card || !stage.contains(card)) return;
    if (!card.classList.contains('is-active')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      goTo(Number(card.dataset.gcItemIndex));
    }
  }, true);
  listen(stage, 'pointerleave', () => {
    stage.classList.remove('has-pointer');
    hoverTiltX = hoverTiltY = 0;
    if (!drag) render();
  });
  listen(root, 'pointerenter', event => { if (event.pointerType === 'mouse') hovered = true; });
  listen(root, 'pointerleave', () => { hovered = false; lastTime = 0; requestTick(); });
  listen(root, 'focusin', () => { focused = true; });
  listen(root, 'focusout', () => {
    queueMicrotask(() => {
      if (destroyed) return;
      focused = root.contains(document.activeElement);
      lastTime = 0;
      requestTick();
    });
  });
  listen(document, 'visibilitychange', () => { lastTime = 0; requestTick(); });

  let resize;
  if (typeof ResizeObserver !== 'undefined') {
    resize = new ResizeObserver(entries => {
      if (entries.some(({target}) => target === stage || target === track)) measure();
      if (hasTabs && entries.some(({target}) => target !== stage && target !== track)) revealSelectedTab();
    });
    resize.observe(stage);
    if (swept) resize.observe(track);
    if (hasTabs) {
      resize.observe(navigation);
      // Earlier tabs can widen and displace the selected tab even if its
      // own width stays fixed. The rail needs no work during normal scrolling.
      tabs.forEach(tab => resize.observe(tab, {box: 'border-box'}));
    }
  } else listen(window, 'resize', () => { measure(); revealSelectedTab(); });
  let visibility;
  if (typeof IntersectionObserver !== 'undefined') {
    visibility = new IntersectionObserver(entries => {
      offscreen = !entries[0]?.isIntersecting;
      lastTime = 0;
      requestTick();
    });
    visibility.observe(root);
  }
  measure();
  mounted = true;
  setPlaying(playing);

  return {
    goTo,
    setGeometry(settings) {
      readGeometry(settings);
      trackHeight = -1;
      measure();
    },
    setPlaying,
    setSuspended,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      resize?.disconnect();
      visibility?.disconnect();
      cleanups.forEach(cleanup => cleanup());
      root.remove();
    },
  };
}
