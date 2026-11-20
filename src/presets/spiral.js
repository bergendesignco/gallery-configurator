import { ProjectViewer } from '../spiral/ProjectViewer.js';
import { setTransportIcon } from '../transport-icons.js';
import { spiralDefaults } from './spiral-settings.js';
export { spiralDefaults, spiralControls } from './spiral-settings.js';
import { attachCarouselPlayback } from '../spiral/CarouselPlayback.js';
import { attachResponsiveCarousel } from '../spiral/ResponsiveCarouselRenderer.js';
import '../spiral/reference/spiral.js';
import '../spiral/reference/scoped.css';
import '../spiral/project-viewer.css';
import './spiral.css';

// The controller owns geometry, movement and gesture handling.
const referenceController = window.SpiralCarousel;
let nextId = 0;

const bounded = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
const aspect = value => {
  if (typeof value === 'number' && value > 0) return value;
  const [w, h] = String(value || '16:9').split(':').map(Number);
  return w > 0 && h > 0 ? w / h : 16 / 9;
};
const plainText = value => {
  const template = document.createElement('template');
  template.innerHTML = String(value || '');
  return template.content.textContent.trim();
};
const sourceImageAttributes = new Set(['alt', 'width', 'height', 'srcset', 'sizes', 'data-src', 'data-image', 'data-image-dimensions', 'data-image-focal-point', 'data-load', 'data-loader']);

function applySourceImage(image, item, loadImage) {
  // Preserve native attributes/base URLs; never manufacture CDN resize queries.
  for (const attribute of sourceImageAttributes) image.removeAttribute(attribute);
  for (const [name, value] of Object.entries(item.imageAttrs || {})) {
    if (sourceImageAttributes.has(name) && value != null) image.setAttribute(name, String(value));
  }
  image.src = item.src;
  image.alt = item.alt || '';
  image.draggable = false;
  image.decoding = 'async';
  image.setAttribute('data-gc-spiral-source', item.src);
  if (image.isConnected) loadImage?.(image);
}

function usableLink(value) {
  if (!value || value === '#') return null;
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export function mountSpiral(ctx) {
  const { host, onChange = () => {}, loadImage } = ctx;
  const items = ctx.items.filter(item => item.src);
  let options = { ...spiralDefaults, ...ctx.options };
  let destroyed = false;
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'gc-spiral-empty';
    empty.textContent = 'Add images to this source to preview the spiral.';
    host.append(empty);
    return { destroy() { empty.remove(); } };
  }

  const shell = document.createElement('div');
  shell.className = 'gc-spiral-root reference-carousel-shell';
  const root = document.createElement('div');
  root.className = 'orbit-carousel spiral-carousel slot-carousel';
  root.dataset.spiralCarousel = '';
  root.id = `gc-spiral-${++nextId}`;
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Spiral gallery');
  root.innerHTML = '<div class="orbit-stage" tabindex="0" aria-label="Drag to rotate or use the arrow keys"><div class="orbit-ring"></div></div><div class="orbit-controls"><button type="button" class="orbit-arrow" data-orbit-prev aria-label="Previous image"></button><button type="button" class="orbit-arrow orbit-toggle" data-orbit-toggle data-paused="false" aria-label="Pause carousel"></button><button type="button" class="orbit-arrow" data-orbit-next aria-label="Next image"></button></div><p class="orbit-title gc-spiral-caption"></p><p class="orbit-status orbit-sr-only" aria-live="polite"></p><div class="orbit-pagination" hidden></div>';
  const stage = root.querySelector('.orbit-stage');
  const ring = root.querySelector('.orbit-ring');
  const toggle = root.querySelector('[data-orbit-toggle]');
  setTransportIcon(root.querySelector('[data-orbit-prev]'), 'previous');
  setTransportIcon(root.querySelector('[data-orbit-next]'), 'next');
  setTransportIcon(toggle, 'playback');
  const caption = root.querySelector('.gc-spiral-caption');
  // Overlay invisible title copies in one grid cell so the caption reserves
  // the tallest title at any width, including after fonts load.
  const captionSpace = document.createElement('div');
  captionSpace.className = 'gc-spiral-caption-space';
  caption.before(captionSpace);
  captionSpace.append(caption);
  const hasTitles = items.some(item => Boolean(item.title));
  for (const title of new Set(items.map(item => item.title).filter(Boolean))) {
    const measure = caption.cloneNode(false);
    measure.setAttribute('aria-hidden', 'true');
    measure.classList.add('gc-spiral-caption-measure');
    measure.textContent = title;
    captionSpace.append(measure);
  }
  items.forEach((item, index) => {
    const card = document.createElement('button');
    card.className = 'orbit-card';
    card.type = 'button';
    card.dataset.title = item.title || '';
    card.dataset.imageSource = item.src;
    card.setAttribute('aria-label', item.title ? `View ${item.title}` : `View image ${index + 1}`);
    const surface = document.createElement('span');
    surface.className = 'orbit-surface';
    const image = document.createElement('img');
    applySourceImage(image, item);
    surface.append(image); card.append(surface); ring.append(card);
  });
  shell.append(root); host.append(shell);

  const setAttributes = () => {
    root.dataset.edgeMode = options.edgeMode;
    root.dataset.backFace = options.backFace;
    root.dataset.cornerRadius = options.spiralRadius;
    root.dataset.borderWidth = options.borderWidth;
    root.dataset.borderColor = options.spiralRim;
    root.dataset.backColor = options.backColor;
    root.style.setProperty('--orbit-card-radius', options.spiralRadius + 'px');
    root.style.setProperty('--orbit-rim', options.spiralRim);
    shell.style.width = `${bounded(options.containerWidth, 100, 20, 100)}%`;
    stage.style.height = `${bounded(options.stageHeight, 680, 280, 1600)}px`;
    root.style.setProperty('--orbit-card-width', `${bounded(options.cardWidth, 280, 80, 720)}px`);
    root.dataset.spiralWidth = String(bounded(options.spiralWidth, 87, 20, 100));
    root.dataset.cardWidth = String(bounded(options.cardWidth, 280, 80, 720));
    root.dataset.rise = String(bounded(options.spiralRise, 52, options.spiralRiseUnit === 'percent' ? 1 : 8, options.spiralRiseUnit === 'percent' ? 50 : 500));
    root.dataset.riseUnit = options.spiralRiseUnit === 'percent' ? 'percent' : 'px';
    root.dataset.cardAspect = String(aspect(options.aspectRatio));
    root.dataset.imageFit = options.fit === 'contain' || options.fit === 'fit' ? 'fit' : 'fill';
    root.dataset.imagePadding = String(bounded(options.imagePadding, 0, 0, 20));
    root.dataset.slotGap = String(bounded(options.spiralGap, 3, 0, 16));
    root.dataset.showSlots = String(Boolean(options.showSlots));
    captionSpace.hidden = !options.showTitles || !hasTitles;
    root.classList.toggle('gc-spiral-reduced', Boolean(options.reducedMotion));
  };
  setAttributes();

  const projects = items.map(item => ({
    title: item.title || '', category: '', description: plainText(item.description),
    services: [], notes: [], gallery: [{ file: item.src, label: 'Image' }],
  }));

  class SourceProjectViewer extends ProjectViewer {
    constructor(viewerRoot, cards) {
      super(viewerRoot, cards, projects);
      this.dialog.classList.add('gc-spiral-dialog');
      ctx.attachDialog?.(this.dialog);
      this.dialog.querySelector('.project-demo-note').remove();
      this.dialog.querySelector('.project-category').hidden = true;
      this.dialog.setAttribute('aria-label', 'Image details');
      this.sourceLink = document.createElement('a');
      this.sourceLink.className = 'gc-spiral-source-link';
      this.sourceLink.hidden = true;
      this.dialog.querySelector('.project-info').append(this.sourceLink);
    }
    open(index) {
      const item = items[index];
      if (!item || options.clickAction === 'none') return;
      const link = usableLink(item.link);
      if (options.clickAction === 'link') {
        if (link) location.assign(link);
        return;
      }
      if(item.postUrl){ctx.openPost(item,index);return;}
      super.open(index);
      const title = this.dialog.querySelector('.project-title');
      title.hidden = !item.title;
      if (item.title) this.dialog.setAttribute('aria-labelledby', title.id);
      else this.dialog.removeAttribute('aria-labelledby');
      this.dialog.querySelector('.project-summary').hidden = !plainText(item.description);
      this.sourceLink.hidden = !link;
      if (link) {
        this.sourceLink.href = link;
        this.sourceLink.textContent = item.buttonLabel || 'Open link';
      } else this.sourceLink.removeAttribute('href');
      this.dialog.classList.toggle('gc-spiral-reduced', Boolean(options.reducedMotion));
    }
    showFrame(index) {
      super.showFrame(index);
      const sourceIndex = projects.indexOf(this.project);
      const item = items[sourceIndex];
      if (!item) return;
      applySourceImage(this.image, item, loadImage);
      this.dialog.querySelectorAll('.project-thumbnail img').forEach(image => applySourceImage(image, item, loadImage));
      this.dialog.querySelector('.project-frame-label').textContent = item.title || '';
    }
  }

  const previousViewer = window.ProjectViewer;
  window.ProjectViewer = SourceProjectViewer;
  try { referenceController.init(shell); }
  finally {
    if (previousViewer === undefined) delete window.ProjectViewer;
    else window.ProjectViewer = previousViewer;
  }
  const carousel = root.spiralCarousel;
  // Newly created HTML image copies use the owning page's loader. The WebGL
  // textures below use the unsized source URL directly, independently of it.
  root.querySelectorAll('img').forEach(image => loadImage?.(image));

  const originalActive = carousel.updateActive;
  carousel.updateActive = function (index) {
    originalActive.call(this, index);
    this.status.textContent = `${items[index]?.title ? `${items[index].title}, ` : ''}image ${index + 1} of ${items.length}`;
    onChange(index);
  };
  carousel.updateActive(carousel.active);
  const originalAnimate = carousel.animateTo;
  carousel.animateTo = function (target, velocity = 0) {
    if (options.reducedMotion) { this.target = Math.round(target); this.settleImmediately(); }
    else originalAnimate.call(this, target, velocity);
  };

  const stopRenderer = attachResponsiveCarousel(carousel, { textureSource: card => card.dataset.imageSource });
  const stopPlayback = attachCarouselPlayback(root, carousel, { pauseOnHover: false, interactionRestMs: 0 });
  function setPlaying(playing) {
    options.autoplay = Boolean(playing);
    carousel.manuallyPaused = !playing || Boolean(options.reducedMotion);
    carousel.resumeAt = 0;
    toggle.disabled = Boolean(options.reducedMotion) || carousel.reducedMotion.matches || items.length < 2;
    toggle.dataset.paused = String(carousel.manuallyPaused);
    toggle.setAttribute('aria-label', carousel.manuallyPaused ? 'Resume carousel' : 'Pause carousel');
    carousel.syncAutoplay();
  }
  setPlaying(Boolean(options.autoplay));

  return {
    update(nextOptions) {
      const previous = options;
      options = { ...options, ...nextOptions };
      setAttributes(); carousel.measure();
      root.dispatchEvent(new Event('playground-change'));
      root.dispatchEvent(new Event('slot-guides-change'));
      carousel.updateActive(carousel.active);
      if (previous.autoplay !== options.autoplay || previous.reducedMotion !== options.reducedMotion) setPlaying(Boolean(options.autoplay));
    },
    goTo(index) { if (!destroyed) carousel.goTo(index); },
    setPlaying,
    getMetrics() { try { return JSON.parse(root.dataset.responsiveMetrics || 'null'); } catch { return null; } },
    getStatus() { return root.dataset.renderer || 'loading'; },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopPlayback(); stopRenderer(); carousel.destroy(); shell.remove();
    },
  };
}
