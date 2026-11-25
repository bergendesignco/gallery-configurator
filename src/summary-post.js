import { loadPostData } from './post-data.js';

const readingTags = new Set(
  'p h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td'.split(' ')
);
const readableBlocks = new Set(['html', 'text', 'markdown', 'image']);
const discard = 'script,style,template,noscript,iframe,form,svg,object,embed,video,audio,button';
const arrowLeft = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-14 0 6 6m-6-6 6-6"/></svg>';
const arrowRight = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const closeIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';

function parse(html) {
  const template = document.createElement('template');
  template.innerHTML = html ?? '';
  return template.content;
}

function webUrl(value, base) {
  base ||= location.href;
  if (!value || !URL.canParse(value, base)) return null;
  const url = new URL(value, base);
  return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
}

// Rebuild reading content from an inert template. Never attach a Squarespace block,
// arbitrary attributes, or third-party embed markup to the dialog.
function copyContent(node, base) {
  if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.data);
  const content = document.createDocumentFragment();
  if (node.nodeType !== Node.ELEMENT_NODE || node.matches(discard)) return content;

  const tag = node.localName === 'h1' ? 'h2' : node.localName;
  let url;
  if (tag === 'img') {
    url = webUrl(node.dataset.src || node.dataset.image || node.getAttribute('src'), base);
    if (!url) return content;
  } else if (tag === 'a') {
    url = webUrl(node.getAttribute('href'), base);
  }
  const output = readingTags.has(tag) && (tag !== 'a' || url) ? document.createElement(tag) : content;
  if (tag === 'a' && url) {
    output.href = url;
    output.rel = 'noopener noreferrer';
  } else if (tag === 'img') {
    output.src = url;
    output.alt = node.alt;
    output.loading = 'lazy';
  }
  for (const child of node.childNodes) output.append(copyContent(child, base));
  return output;
}

function readingContent(parent, base) {
  const output = document.createDocumentFragment();
  for (const node of parent.childNodes) output.append(copyContent(node, base));
  return output;
}

function words(node) {
  return node.textContent.replace(/\s+/g, ' ').trim();
}

function appendReading(target, contents) {
  const text = words(contents);
  if ((!text && !contents.querySelector('img')) || (text && words(target) === text)) return;
  const section = document.createElement('div');
  section.append(contents);
  target.append(section);
}

function updatePills(list, values) {
  const labels = Array.isArray(values) ? [...new Set(values.filter(value =>
    typeof value === 'string').map(value => value.trim()).filter(Boolean))] : [];
  list.replaceChildren(...labels.map(label => {
    const pill = document.createElement('li');
    pill.textContent = label;
    return pill;
  }));
  list.hidden = !labels.length;
}

function projectSlides(post, item, base) {
  const gallery = (post?.blocks ?? []).flatMap(block => block.gallery?.slides ?? []).flatMap(slide => {
    const src = webUrl(slide.imageUrl, base);
    return src ? [{
      src, alt: slide.alt?.trim() || slide.title?.trim() || '',
      caption: slide.title?.trim() || '',
      description: slide.descriptionHtml || '',
    }] : [];
  });
  if (gallery.length) return gallery;
  const cover = webUrl(post?.featuredImageUrl, base) || webUrl(item.src, base);
  return cover ? [{src:cover, alt:item.alt || '', caption:'', description:''}] : [];
}

export function createPostDialog(item, options, closeDialog) {
  const dialog = document.createElement('dialog');
  dialog.className = 'gc-post-dialog';
  dialog.dataset.desktopLayout = options.popupDesktopLayout === 'drawer' ? 'drawer' : 'split';
  dialog.dataset.reducedMotion = String(Boolean(options.reducedMotion));
  if (options.popupPadding > 0) dialog.style.setProperty('--post-padding', options.popupPadding + 'px');
  if (options.popupRadius != null) dialog.style.setProperty('--post-radius', options.popupRadius + 'px');
  if (options.popupCustom && options.popupColor && options.popupInk) {
    dialog.style.setProperty('--post-surface', options.popupColor);
    dialog.style.setProperty('--post-ink', options.popupInk);
    dialog.style.setProperty('--post-body', options.popupInk);
  }
  dialog.innerHTML = `
    <div class="gc-post-toolbar"><button type="button" class="gc-post-icon gc-post-close" aria-label="Close project" autofocus>${closeIcon}</button></div>
    <div class="gc-post-layout">
      <div class="gc-post-copy">
        <h2 class="gc-post-title"></h2>
        <div class="gc-post-reading"></div>
        <ul class="gc-post-pills gc-post-categories" aria-label="Project categories" hidden></ul>
        <ul class="gc-post-pills gc-post-tags" aria-label="Project tags" hidden></ul>
        <p class="gc-post-status" role="status">Loading project…</p>
        <a class="gc-post-link">View full project</a>
      </div>
      <section class="gc-post-gallery" aria-label="Project images" hidden>
        <figure class="gc-post-figure">
          <div class="gc-post-image-well"><img class="gc-post-image" alt="" draggable="false"></div>
          <figcaption class="gc-post-image-description" hidden></figcaption>
        </figure>
        <div class="gc-post-photo-nav" hidden>
          <div class="gc-post-photo-label" aria-live="polite" aria-atomic="true">
            <strong class="gc-post-image-label"></strong>
            <span class="gc-post-counter"></span>
          </div>
          <div class="gc-post-step-buttons">
            <button type="button" class="gc-post-icon" data-post-prev aria-label="Previous image">${arrowLeft}</button>
            <button type="button" class="gc-post-icon" data-post-next aria-label="Next image">${arrowRight}</button>
          </div>
        </div>
        <div class="gc-post-thumbs" role="group" aria-label="Select a project image" hidden></div>
      </section>
    </div>`;

  const find = selector => dialog.querySelector(selector);
  const closeButton = find('.gc-post-close');
  const title = find('.gc-post-title');
  const content = find('.gc-post-reading');
  const categories = find('.gc-post-categories');
  const tags = find('.gc-post-tags');
  const status = find('.gc-post-status');
  const cta = find('.gc-post-link');
  const gallery = find('.gc-post-gallery');
  const layout = find('.gc-post-layout');
  const well = find('.gc-post-image-well');
  const image = find('.gc-post-image');
  const imageDescription = find('.gc-post-image-description');
  const controls = find('.gc-post-photo-nav');
  const label = find('.gc-post-image-label');
  const counter = find('.gc-post-counter');
  const thumbnails = find('.gc-post-thumbs');
  const controller = new AbortController();
  const narrow = matchMedia('(max-width: 680px)');
  let slides = [];
  let index = 0;
  let pointer = null;
  let projectUrl = webUrl(item.postUrl, location.href);

  function orderPanels() {
    if (narrow.matches) layout.prepend(gallery);
    else layout.append(gallery);
  }
  orderPanels();
  narrow.addEventListener('change', orderPanels);

  function showSlide(i) {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    image.src = slide.src;
    image.alt = slide.alt;
    label.textContent = slide.caption;
    label.hidden = !slide.caption;
    counter.textContent = (index + 1) + ' / ' + slides.length;
    imageDescription.replaceChildren(readingContent(parse(slide.description), projectUrl));
    imageDescription.hidden = !words(imageDescription);
    for (const [number, thumb] of Array.from(thumbnails.children).entries()) {
      if (number === index) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    }
    const selected = thumbnails.children[index];
    if (selected && thumbnails.clientWidth) {
      const {left, right} = selected.getBoundingClientRect();
      const strip = thumbnails.getBoundingClientRect();
      if (left < strip.left) thumbnails.scrollLeft += left - strip.left;
      if (right > strip.right) thumbnails.scrollLeft += right - strip.right;
    }
  }

  function setSlides(next) {
    slides = options.popupImage === false ? [] : next;
    gallery.hidden = !slides.length;
    controls.hidden = slides.length < 2;
    thumbnails.hidden = slides.length < 2;
    thumbnails.replaceChildren(...(slides.length > 1 ? slides.map((slide, i) => {
      const button = document.createElement('button');
      const preview = document.createElement('img');
      button.type = 'button';
      button.setAttribute('aria-label', 'Show image ' + (i + 1) + (slide.caption ? ' – ' + slide.caption : ''));
      preview.src = slide.src;
      preview.alt = '';
      preview.loading = 'lazy';
      button.append(preview);
      button.addEventListener('click', () => showSlide(i));
      return button;
    }) : []));
    dialog.toggleAttribute('data-without-gallery', !slides.length);
    showSlide(0);
  }

  function setIdentity(name, url) {
    title.textContent = name || '';
    title.hidden = options.popupTitle === false || !name;
    dialog.setAttribute('aria-label', name || 'Project details');
    cta.hidden = options.popupButton === false || !url;
    if (url) cta.href = url;
  }

  function render(post) {
    projectUrl = webUrl(post.url, projectUrl) || projectUrl;
    // Squarespace's JSON may preserve HTML character references in the title.
    const name = post.title?.replace(/&(?:#(?:[0-9]+|x[0-9a-f]+)|[a-z][a-z0-9]+);/gi,
      reference => parse(reference).textContent);
    setIdentity(name || item.title, projectUrl);
    content.replaceChildren();
    if (options.popupDescription !== false) {
      for (const block of post.blocks ?? []) {
        if (!readableBlocks.has(block.type)) continue;
        const blockRoot = parse(block.html);
        const body = blockRoot.querySelector('.sqs-html-content,.sqs-block-content') || blockRoot;
        appendReading(content, readingContent(body, projectUrl));
      }
      if (!content.childElementCount) {
        appendReading(content, readingContent(parse(post.excerptHtml || item.description), projectUrl));
      }
    }
    updatePills(categories, post.categories);
    updatePills(tags, post.tags);
    setSlides(projectSlides(post, item, projectUrl));
    status.hidden = true;
  }

  closeButton.addEventListener('click', closeDialog);
  find('[data-post-prev]').addEventListener('click', () => showSlide(index - 1));
  find('[data-post-next]').addEventListener('click', () => showSlide(index + 1));
  dialog.addEventListener('keydown', event => {
    if (slides.length < 2 || event.altKey || event.metaKey || event.ctrlKey) return;
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showSlide(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  well.addEventListener('pointerdown', event => {
    if (slides.length < 2 || !event.isPrimary || event.pointerType === 'mouse') return;
    pointer = {id:event.pointerId, x:event.clientX, y:event.clientY};
    well.setPointerCapture(event.pointerId);
  });
  well.addEventListener('pointercancel', () => { pointer = null; });
  well.addEventListener('pointerup', event => {
    if (pointer?.id !== event.pointerId) return;
    const x = event.clientX - pointer.x;
    const y = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(x) > 35 && Math.abs(x) > Math.abs(y) * 1.2) showSlide(index + (x < 0 ? 1 : -1));
  });

  setIdentity(item.title, projectUrl);
  if (options.popupDescription !== false) {
    appendReading(content, readingContent(parse(item.description), projectUrl));
  }
  setSlides(projectSlides(null, item, projectUrl));

  return {
    dialog,
    async load() {
      try {
        const post = await loadPostData(projectUrl, {signal:controller.signal, includeSeo:false});
        if (!controller.signal.aborted) render(post);
      } catch {
        if (controller.signal.aborted) return;
        status.textContent = 'The project details couldn’t load.';
      }
    },
    destroy() {
      controller.abort();
      narrow.removeEventListener('change', orderPanels);
    },
  };
}
