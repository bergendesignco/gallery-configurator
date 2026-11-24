import {composeCards,needsCardArt} from '../spiral/card-art.js';
import {createImageEffects} from '../image-effects.js';
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
  const items = ctx.items.filter(item => item.src || item.title || item.description || item.link);
  let options = { ...spiralDefaults, ...ctx.options };
  let destroyed = false;
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'gc-spiral-empty';
    empty.textContent = 'Add content to this source to preview the spiral.';
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
  const detailSpace=document.createElement('div');
  detailSpace.className='gc-item-details';
  captionSpace.after(detailSpace);
  const details=items.map(item=>{
    const group=document.createElement('div');
    group.className='gc-item-detail';
    const body=document.createElement('p');
    body.className='gc-item-description';
    body.textContent=plainText(item.description);
    const link=document.createElement('a');
    const href=usableLink(item.link);
    if(href)link.href=href;
    link.textContent=item.buttonLabel||'Open link';
    group.append(body,link);detailSpace.append(group);
    return {group,body,link,href};
  });
  const transparent='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"></svg>');
  const cards=[];
  items.forEach((item, index) => {
    const card = document.createElement('button');
    card.className = 'orbit-card';
    card.type = 'button';
    card.dataset.title = item.title || '';
    card.dataset.imageSource = item.src || transparent;
    card.setAttribute('aria-label', item.title ? `View ${item.title}` : `View image ${index + 1}`);
    const surface = document.createElement('span');
    surface.className = 'orbit-surface';
    const image = document.createElement('img');
    if(item.src)applySourceImage(image,item);else image.src=transparent;
    cards.push(card);card.dataset.buttonLink=usableLink(item.link)||'';
    surface.append(image); card.append(surface); ring.append(card);
  });
  shell.append(root); host.append(shell);

  const assets=new Map();
  let artworkVersion=0,artKey='';
  async function updateArt(){
    const key=JSON.stringify(options);
    if(artKey===key)return;
    artKey=key;
    const version=++artworkVersion;
    const composite=items.some(item=>needsCardArt(item,options));
    root.dataset.composite=String(composite);
    if(!composite){
      for(const [index,card] of cards.entries()){
        card.artwork=null;card.buttonBounds=null;
        if(card.hasAttribute('data-artwork')){for(const copy of ring.querySelectorAll('[data-slide-index="'+index+'"] img'))copy.src=items[index].src||transparent;card.removeAttribute('data-artwork');}
      }
      return;
    }
    const load=src=>{
      if(!src||!options.showImage)return null;
      if(!assets.has(src))assets.set(src,new Promise(resolve=>{
        const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;
      }));
      return assets.get(src);
    };
    await new Promise(requestAnimationFrame);
    if(destroyed||version!==artworkVersion)return;
    const entries=await Promise.all(items.map(async item=>({item:{...item,plain:plainText(item.description)},image:await load(item.src)})));
    if(destroyed||version!==artworkVersion)return;
    const native=options.typeSource==='native'?host.closest('.user-items-list-section'):null;
    const type=getComputedStyle(native?.querySelector('.list-item-content__title')||caption);
    const body=getComputedStyle(native?.querySelector('.list-item-content__description p')||details[0].body);
    const ink=getComputedStyle(host).color;
    const art=composeCards(entries,options,{family:type.fontFamily,bodyFamily:body.fontFamily,ink,titleSize:parseFloat(type.fontSize)||16,titleWeight:type.fontWeight,
      size:parseFloat(body.fontSize)||16,weight:body.fontWeight,accent:getComputedStyle(toggle).color,buttonInk:getComputedStyle(toggle).backgroundColor==='rgba(0, 0, 0, 0)'?'white':getComputedStyle(toggle).backgroundColor});
    art.forEach(({canvas,buttonBounds},i)=>{
      cards[i].artwork=canvas;cards[i].buttonBounds=buttonBounds;
      cards[i].setAttribute('data-artwork','');
      if(root.dataset.renderer!=='webgl'){
        const uri=canvas.toDataURL();
        for(const copy of root.querySelectorAll('.orbit-card[data-slide-index="'+i+'"] img'))copy.src=uri;
      }
    });
    ring.querySelectorAll('[data-repeat]').forEach(copy=>{const source=cards[Number(copy.dataset.slideIndex)];copy.buttonBounds=source?.buttonBounds;});
    root.dataset.cardAspect=String(art[0].aspect);
    root.style.setProperty('--gc-art-aspect',art[0].aspect);
    root.dispatchEvent(new Event('artwork-change'));
  }
  const updateEffects=createImageEffects(shell,root.id);
  const setAttributes = () => {
    const hasCardText=options.textPlacement==='card';
    const composited=items.some(item=>needsCardArt(item,options));
    updateEffects({...options,shadowEnabled:options.shadowEnabled&&!composited,imageTint:options.overlayEnabled&&!composited?options.imageTint:'#00000000'});
    if(!options.titleCustom){host.removeAttribute('data-gc-title-size');host.removeAttribute('data-gc-title-weight');host.dataset.gcTitlePalette='theme';}
    else {host.dataset.gcTitlePalette=options.titlePalette;}
    captionSpace.style.textAlign=options.titleAlign;
    shell.style.setProperty('--gc-card-inset',options.carouselPadding+'px');
    root.style.padding=options.carouselPadding+'px';
    root.style.overflow=options.surfaceRadius?'hidden':'';
    root.style.borderRadius=options.surfaceRadius+'px';
    root.style.backgroundColor=options.surfaceEnabled?options.surfaceColor:'';
    root.style.setProperty('--gc-hover-time',options.hoverDuration+'ms');
    root.dataset.hoverDuration=options.hoverDuration;
    root.dataset.mirrorColor=options.mirrorOverlay?options.mirrorColor:'#00000000';
    root.dataset.playbackMode=options.playbackMode;
    root.dataset.rate=options.cardsPerMinute;
    root.dataset.interval=options.duration;
    root.dataset.direction=options.direction;
    root.dataset.pauseOnHover=String(options.pauseOnHover);
    root.dataset.customControlSize=String(Boolean(options.controlPadding||options.controlIconSize));
    root.dataset.hideControlBackground=String(!options.controlBackground);
    root.style.setProperty('--gc-icon-size',options.controlIconSize?options.controlIconSize+'px':'calc(var(--gc-control-size) * .455)');
    root.style.setProperty('--gc-button-padding',options.controlPadding+'px');
    host.style.setProperty('--gc-detail-padding','0px');
    for(const title of captionSpace.children){title.style.textAlign=options.titleCustom?options.titleAlign:'';title.style.marginBottom=options.titleGap?options.titleGap+'px':'';}
    for(const {body,link} of details){
      body.style.textAlign=options.bodyCustom?options.descriptionAlign:'';
      body.style.fontWeight=options.bodyCustom?options.descriptionWeight:'';
      body.style.color=options.bodyCustom&&options.descriptionCustom?options.descriptionColor:'inherit';
      body.style.fontSize=options.bodyCustom&&options.descriptionSize?options.descriptionSize+'rem':'';
      link.style.marginTop=options.buttonGap+'px';
    }
    root.dataset.showImage=String(options.showImage!==false);
    root.dataset.imageTint=options.overlayEnabled?options.imageTint:'#00000000';
    root.dataset.hoverEffect=options.reducedMotion?'none':options.hoverEffect;
    root.dataset.hoverAmount=options.hoverAmount;
    for (const [index,{body,link,href}] of details.entries()){
      body.hidden=!options.showDescription||!body.textContent;
      link.hidden=!options.showButton||!href||!items[index].buttonLabel;
    }
    detailSpace.hidden=hasCardText||details.every(({body,link})=>body.hidden&&link.hidden);
    root.dataset.edgeMode = options.edgeMode;
    root.dataset.backFace = options.backFace;
    root.dataset.cornerRadius = options.spiralRadius;
    root.dataset.borderWidth = options.cardBorderEnabled?options.borderWidth:0;
    root.dataset.borderColor = options.spiralRim;
    root.dataset.backColor = options.backColor;
    root.style.setProperty('--orbit-card-radius', options.spiralRadius + 'px');
    root.style.setProperty('--orbit-rim', options.spiralRim);
    shell.style.width = `${bounded(options.containerWidth, 100, 20, 100)}%`;
    stage.style.height=options.heightMode==='viewport'?bounded(options.viewportHeight,65,15,100)+'vh':
      options.heightMode==='auto'?'clamp(160px,calc('+options.cardWidth+'px + '+(options.spiralRise*4)+'px),90svh)':bounded(options.stageHeight,680,120,1600)+'px';
    root.style.setProperty('--orbit-card-width', `${bounded(options.cardWidth, 280, 80, 720)}px`);
    root.dataset.spiralWidth = String(bounded(options.spiralWidth, 87, 20, 100));
    root.dataset.cardWidth = String(bounded(options.cardWidth, 280, 80, 720));
    root.dataset.rise = String(bounded(options.spiralRise, 52, options.spiralRiseUnit === 'percent' ? 1 : 8, options.spiralRiseUnit === 'percent' ? 50 : 500));
    root.dataset.riseUnit = options.spiralRiseUnit === 'percent' ? 'percent' : 'px';
    if(!cards[0].artwork||!items.some(item=>needsCardArt(item,options)))root.dataset.cardAspect=String(aspect(options.aspectRatio));
    root.dataset.imageFit = options.fit === 'contain' || options.fit === 'fit' ? 'fit' : 'fill';
    root.dataset.imagePadding = String(bounded(options.imagePadding, 0, 0, 20));
    root.dataset.slotGap = String(bounded(options.spiralGap, 3, 0, 16));
    root.dataset.showSlots = String(Boolean(options.showSlots));
    captionSpace.hidden = hasCardText || !options.showTitles || !hasTitles;
    updateArt();
    root.classList.toggle('gc-spiral-reduced', Boolean(options.reducedMotion));
  };
  setAttributes();

  const projects = items.map(item => ({
    title: item.title || '', category: '', description: plainText(item.description),
    services: [], notes: [], gallery: [{ file: item.src||transparent, label: 'Image' }],
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
      if (!item || (options.clickAction === 'none'||(options.clickAction==='source'&&host.dataset.sourceType!=='gallery'))) return;
      const link = usableLink(item.link);
      if (options.clickAction === 'link'||options.clickAction==='source') {
        if (link) location.assign(link);
        return;
      }
      if(item.postUrl){ctx.openPost(item,index);return;}
      super.open(index);
      const title = this.dialog.querySelector('.project-title');
      title.hidden = !item.title || !options.popupTitle;
      if (!title.hidden) this.dialog.setAttribute('aria-labelledby', title.id);
      else this.dialog.removeAttribute('aria-labelledby');
      this.dialog.querySelector('.project-summary').hidden = !options.popupDescription || !plainText(item.description);
      this.dialog.querySelector('.project-gallery').hidden=!options.popupImage||!item.src;
      this.dialog.querySelector('.project-frame-label').hidden=!options.popupTitle;
      this.dialog.querySelector('.project-info').hidden=title.hidden && this.dialog.querySelector('.project-summary').hidden && !(link && options.popupButton);
      this.sourceLink.hidden = !link || !options.popupButton;
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
      if (!item?.src) return;
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

  const renderFallback=()=>{
    for(const [index,card] of cards.entries()){
      if(!card.artwork)continue;
      const src=card.artwork.toDataURL();
      for(const img of ring.querySelectorAll('[data-slide-index="'+index+'"] img'))img.src=src;
    }
  };
  stage.addEventListener('webglcontextlost',renderFallback,true);
  const originalActive = carousel.updateActive;
  carousel.updateActive = function (index) {
    originalActive.call(this, index);
    details.forEach(({group},i)=>{
      group.inert=i!==index;
      group.style.visibility=i===index?'visible':'hidden';
    });
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
      stage.removeEventListener('webglcontextlost',renderFallback,true);stopPlayback(); stopRenderer(); carousel.destroy(); shell.remove();
    },
  };
}
