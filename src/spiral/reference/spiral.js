/* An open vertical helix with a repeating carousel sequence. The original ring stays independent. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const wrap = (value, length) => ((value % length) + length) % length;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  class SpiralCarousel {
    constructor(root) {
      this.root = root;
      this.stage = root.querySelector('.orbit-stage');
      this.cards = [...root.querySelectorAll('.orbit-card')];
      this.count = this.cards.length;
      // Visual repeats fill the upper/lower coils; the content and pagination stay at 8.
      // Only the original buttons participate in the accessibility tree.
      this.visualCards = [...this.cards];
      this.cards.forEach((card, index) => {
        card.dataset.slideIndex = index;
        const repeat = card.cloneNode(true);
        repeat.dataset.repeat = 'true';
        repeat.tabIndex = -1;
        repeat.setAttribute('aria-hidden', 'true');
        repeat.removeAttribute('aria-pressed');
        card.parentElement.append(repeat);
        this.visualCards.push(repeat);
      });
      if (!this.count || !this.stage) return;
      this.title = root.querySelector('.orbit-title');
      this.description = root.querySelector('.orbit-description');
      this.status = root.querySelector('.orbit-status');
      this.viewer = new window.ProjectViewer(root, this.cards);
      this.pagination = root.querySelector('.orbit-pagination');
      this.position = 0; // Measured in slides; integers are exact center positions.
      this.target = 0;
      this.velocity = 0;
      this.active = -1;
      this.frame = 0;
      this.lastTime = 0;
      this.pointer = null;
      this.ignoreClickUntil = 0;
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      this.events = new AbortController();
      this.options = { signal: this.events.signal };
      this.tick = this.tick.bind(this);
      this.createCurvedPanels();
      this.createPagination();
      this.bindEvents();
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.stage);
      this.measure();
    }

    createPagination() {
      this.dots = this.cards.map((card, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'orbit-dot';
        dot.setAttribute('aria-label', `Show ${card.dataset.title || `screenshot ${index + 1}`}`);
        dot.addEventListener('click', () => this.goTo(index), this.options);
        this.pagination?.append(dot);
        return dot;
      });
      if (this.count === 1) {
        this.root.querySelectorAll('.orbit-arrow').forEach(button => { button.disabled = true; });
      }
    }

    bindEvents() {
      const on = (element, type, callback, extra = {}) => element.addEventListener(type, callback, { ...this.options, ...extra });
      on(this.root.querySelector('[data-orbit-prev]'), 'click', () => this.step(-1));
      on(this.root.querySelector('[data-orbit-next]'), 'click', () => this.step(1));
      on(this.stage, 'keydown', event => {
        const directions = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1 };
        if (event.key in directions) {
          event.preventDefault();
          this.step(directions[event.key]);
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          this.goTo(event.key === 'Home' ? 0 : this.count - 1);
        }
      });
      on(this.stage, 'pointerdown', event => this.pointerDown(event));
      on(this.stage, 'pointermove', event => this.pointerMove(event), { passive: false });
      on(this.stage, 'pointerup', event => this.pointerUp(event));
      on(this.stage, 'pointercancel', event => this.pointerUp(event, true));
      on(this.stage, 'lostpointercapture', event => this.pointerUp(event, true));
      on(this.stage, 'dragstart', event => event.preventDefault());
      on(window, 'blur', () => { if (this.pointer) this.pointerUp({ pointerId: this.pointer.id }, true); });
      on(this.stage, 'click', event => {
        if (event.detail !== 0 && performance.now() < this.ignoreClickUntil) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        const card = event.target.closest('.orbit-card');
        if (card) this.openProject(Number(card.dataset.slideIndex));
      });
      on(this.stage, 'focusin', event => {
        const index = this.cards.indexOf(event.target.closest('.orbit-card'));
        if (!this.pointer && index >= 0 && index !== this.active) this.goTo(index);
      });
      on(this.reducedMotion, 'change', () => {
        if (this.reducedMotion.matches) this.settleImmediately();
      });
      on(document, 'visibilitychange', () => {
        if (document.hidden) {
          if (this.pointer) this.pointerUp({ pointerId: this.pointer.id }, true);
          this.settleImmediately();
        }
      });
    }

    createCurvedPanels() {
      this.segmentCount = 20;
      this.panels = this.visualCards.map(card => {
        const surface = card.querySelector('.orbit-surface');
        const image = surface.querySelector('img');
        const strips = Array.from({ length: this.segmentCount }, (_, index) => {
          const strip = document.createElement('span');
          strip.className = 'orbit-strip';
          strip.setAttribute('aria-hidden', 'true');
          strip.dataset.stripIndex = index;
          strip.style.backgroundImage = `url("${image.src}")`;
          surface.append(strip);
          return strip;
        });
        card.classList.add('is-curved');
        return { card, strips };
      });
    }

    measure() {
      const width = this.stage.clientWidth;
      const height = this.stage.clientHeight;
      const mobile = width <= 700;
      // Derive radius from the card's arc length, rather than setting unrelated sizes.
      // The 12% gap still leaves room for the centered card's 8% hover enlargement.
      this.cards[0].style.removeProperty('width');
      const cardWidth = this.cards[0].offsetWidth;
      const radiansPerSlide = TAU / 8;
      const panelArc = radiansPerSlide * .88;
      const radius = cardWidth / panelArc;
      this.geometry = {
        radius, panelArc, cardWidth,
        pitch: clamp(height / 13, 36, 52),
        halfWindow: 6.5,
        radiansPerSlide,
        dragUnitX: Math.max(85, width * (mobile ? .32 : .18)),
        dragUnitY: clamp(height * .13, 65, 105),
      };
      // One camera for the complete scene lets near/far edges project consistently.
      this.stage.style.perspective = `${(radius * 2.4).toFixed(3)}px`;
      const segmentAngle = panelArc / this.segmentCount;
      const segmentWidth = 2 * radius * Math.sin(segmentAngle / 2);
      const cardHeight = cardWidth * 9 / 16;
      this.panels.forEach(({ card, strips }) => {
        card.style.width = `${cardWidth}px`;
        strips.forEach((strip, index) => {
          const angle = -panelArc / 2 + (index + .5) * segmentAngle;
          const x = radius * Math.sin(angle);
          const z = radius * (Math.cos(angle) - 1);
          strip.style.width = `${(segmentWidth + .6).toFixed(4)}px`;
          strip.style.backgroundSize = `${cardWidth}px ${cardHeight}px`;
          strip.style.backgroundPosition = `${(-index * cardWidth / this.segmentCount).toFixed(4)}px 0px`;
          strip.style.transform = `translateX(-50%) translate3d(${x.toFixed(4)}px, 0px, ${z.toFixed(4)}px) rotateY(${(angle * 180 / Math.PI).toFixed(4)}deg)`;
        });
      });
      this.render();
    }

    render() {
      if (!this.geometry) return;
      const { radius, pitch, halfWindow, radiansPerSlide } = this.geometry;
      this.visualCards.forEach((card) => {
        const index = Number(card.dataset.slideIndex);
        let offset = wrap(index - this.position + this.count / 2, this.count) - this.count / 2;
        if (card.dataset.repeat) offset += offset < 0 ? this.count : -this.count;
        const angle = offset * radiansPerSlide;
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        const depth = (1 - cosine) / 2;
        const taper = 1 - offset / halfWindow * .11;
        const x = sine * radius * taper;
        const y = offset * pitch;
        const z = cosine * radius * taper - radius;
        const yaw = angle * 180 / Math.PI;
        const edgeOpacity = clamp((halfWindow - Math.abs(offset)) / .65, 0, 1);
        // The card and its curved strips share the same cylinder and camera.
        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, ${z.toFixed(3)}px) rotateY(${yaw.toFixed(3)}deg) scale(${taper.toFixed(4)})`;
        card.style.zIndex = 'auto';
        card.style.setProperty('--orbit-shade', String(depth * .58));
        card.style.setProperty('--orbit-fade', String(edgeOpacity));
        // Group opacity would flatten the curved surface; fade its individual strips.
        card.style.opacity = '1';
        card.style.visibility = edgeOpacity > 0 ? 'visible' : 'hidden';
        card.style.pointerEvents = edgeOpacity > .25 ? 'auto' : 'none';
        card.toggleAttribute('data-gc-back-facing', cosine < 0);
        card.dataset.offset = offset.toFixed(5);
      });
      const nearest = wrap(Math.round(this.position), this.count);
      if (nearest !== this.active) this.updateActive(nearest);
    }

    updateActive(index) {
      // Keep keyboard focus on the visible, centered card as arrow keys rotate it.
      const moveFocus = this.visualCards.includes(document.activeElement);
      this.active = index;
      this.cards.forEach((card, i) => {
        const centered = i === index;
        card.classList.toggle('is-centered', centered);
        card.tabIndex = centered ? 0 : -1;
        card.setAttribute('aria-pressed', String(centered));
        this.dots[i].setAttribute('aria-current', String(centered));
      });
      if (this.title) this.title.textContent = this.cards[index].dataset.title || '';
      if (this.description) this.description.textContent = this.cards[index].dataset.caption || '';
      if (this.status) this.status.textContent = `${this.cards[index].dataset.title}, project ${index + 1} of ${this.count}`;
      if (moveFocus && !this.pointer) this.cards[index].focus({ preventScroll: true });
      this.root.dataset.activeIndex = String(index);
    }

    goTo(index) {
      let delta = wrap(index - this.position + this.count / 2, this.count) - this.count / 2;
      this.animateTo(this.position + delta);
    }

    step(direction) {
      // Repeated clicks accumulate from the intended destination, not the last frame.
      this.animateTo(Math.round(this.target) + direction);
    }

    animateTo(target, initialVelocity = 0) {
      this.target = Math.round(target);
      this.velocity = initialVelocity;
      if (this.reducedMotion.matches || this.count < 2) {
        this.settleImmediately();
        return;
      }
      this.root.classList.add('is-moving');
      if (!this.frame) {
        this.lastTime = performance.now();
        this.frame = requestAnimationFrame(this.tick);
      }
    }

    tick(time) {
      this.frame = 0;
      const dt = Math.min((time - this.lastTime) / 1000, .032);
      this.lastTime = time;
      // Near critically damped spring: momentum rolls into an exact integer snap.
      const acceleration = (this.target - this.position) * 95 - this.velocity * 20;
      this.velocity += acceleration * dt;
      this.position += this.velocity * dt;
      if (Math.abs(this.target - this.position) < .0005 && Math.abs(this.velocity) < .005) {
        this.settleImmediately();
        return;
      }
      this.render();
      this.frame = requestAnimationFrame(this.tick);
    }

    settleImmediately() {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.position = wrap(Math.round(this.target), this.count);
      this.target = this.position;
      this.velocity = 0;
      this.root.classList.remove('is-moving');
      this.render();
    }

    openProject(index) {
      if (this.viewer.dialog.open || !Number.isInteger(index) || !this.cards[index]) return;
      // Bring the selected item to the center for a predictable return from the lightbox.
      const delta = wrap(index - this.position + this.count / 2, this.count) - this.count / 2;
      this.target = Math.round(this.position + delta);
      this.settleImmediately();
      this.viewer.open(index);
    }

    pointerDown(event) {
      if (!event.isPrimary) {
        // A second finger belongs to native pinch zoom, never to a tap action.
        if (this.pointer) this.pointerUp({ pointerId: this.pointer.id }, true);
        return;
      }
      if (event.button !== 0 || this.count < 2 || this.pointer || this.viewer.dialog.open) return;
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.root.classList.remove('is-moving');
      this.pointer = {
        id: event.pointerId, x: event.clientX, y: event.clientY,
        startPosition: this.position, lastTime: performance.now(),
        lastMovement: performance.now(), speed: 0, dragging: false,
        axis: null, lastCoordinate: 0, travel: 0,
        card: event.target.closest('.orbit-card'),
      };
      // Capture from the start so small phone swipes cannot lose the pointer stream.
      this.stage.setPointerCapture(event.pointerId);
    }

    pointerMove(event) {
      const pointer = this.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.dragging) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
        // Keep a diagonal start pending. The browser cancels the pointer when
        // it starts scrolling; a thumb that turns sideways can still rotate.
        if (event.pointerType === 'touch' && Math.abs(dx) <= Math.abs(dy)) {
          pointer.card = null;
          return;
        }
        pointer.axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
        pointer.lastCoordinate = pointer.axis === 'x' ? pointer.x : pointer.y;
        pointer.dragging = true;
        this.root.classList.add('is-dragging');
      }
      event.preventDefault();
      const coordinate = pointer.axis === 'x' ? event.clientX : event.clientY;
      const distance = pointer.axis === 'x' ? dx : dy;
      const unit = pointer.axis === 'x' ? this.geometry.dragUnitX : this.geometry.dragUnitY;
      const dragUnit = event.pointerType === 'touch' ? clamp(unit * .38, 32, 48) : unit;
      const now = performance.now();
      const elapsed = Math.max(8, now - pointer.lastTime);
      const nextSpeed = -(coordinate - pointer.lastCoordinate) / dragUnit / elapsed * 1000;
      pointer.speed = pointer.speed * .35 + nextSpeed * .65;
      pointer.lastMovement = now;
      pointer.lastTime = now;
      pointer.lastCoordinate = coordinate;
      pointer.travel = distance;
      this.position = pointer.startPosition - distance / dragUnit;
      this.render();
    }

    pointerUp(event, canceled = false) {
      const pointer = this.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      this.pointer = null;
      this.root.classList.remove('is-dragging');
      this.ignoreClickUntil = performance.now() + 500;
      if (this.stage.hasPointerCapture(pointer.id)) this.stage.releasePointerCapture(pointer.id);
      if (!pointer.dragging) {
        this.animateTo(Math.round(this.position));
        if(!canceled && pointer.buttonLink){location.assign(pointer.buttonLink);return;}
        if (!canceled && pointer.card) this.openProject(Number(pointer.card.dataset.slideIndex));
        return;
      }
      const speed = canceled || performance.now() - pointer.lastMovement > 90 ? 0 : clamp(pointer.speed, -10, 10);
      let destination = Math.round(this.position + (this.reducedMotion.matches ? 0 : speed * (event.pointerType === 'touch' ? .32 : .20)));
      const movement = this.position - pointer.startPosition;
      // A deliberate short swipe should advance, even when it has little momentum.
      if (!canceled && Math.abs(pointer.travel) > 18 && Math.abs(movement) > .12 && destination === Math.round(pointer.startPosition)) {
        destination += Math.sign(movement);
      }
      this.animateTo(destination, speed);
    }

    destroy() {
      cancelAnimationFrame(this.frame);
      this.events.abort();
      this.viewer.destroy();
      this.panels.forEach(({ card, strips }) => {
        strips.forEach(strip => strip.remove());
        card.classList.remove('is-curved');
        card.style.removeProperty('width');
      });
      this.stage.style.removeProperty('perspective');
      this.resizeObserver.disconnect();
      this.pagination?.replaceChildren();
      this.visualCards.filter(card => card.dataset.repeat).forEach(card => card.remove());
      this.root.classList.remove('is-moving', 'is-dragging');
      delete this.root.spiralCarousel;
    }
  }

  function init(scope = document) {
    scope.querySelectorAll('[data-spiral-carousel]').forEach(root => {
      if (!root.spiralCarousel) root.spiralCarousel = new SpiralCarousel(root);
    });
  }
  // Supports reinitializing sections inserted later by a site builder.
  window.SpiralCarousel = { init };
  init();
})();
