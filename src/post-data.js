// Inert templates let us inspect Squarespace markup without loading block assets.
function fragment(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
}

function absolute(value, base) {
  return value && URL.canParse(value, base) ? new URL(value, base).href : null;
}

function galleryData(block, base) {
  const container = block.querySelector('.sqs-gallery-container');
  const slides = Array.from(block.querySelectorAll('.slide'), slide => {
    const image = slide.querySelector('img[data-src], img[data-image], img[src]');
    const anchor = slide.querySelector('.image-slide-anchor, a[href]');
    return {
      type: slide.dataset.type || null,
      imageUrl: absolute(image?.dataset.src || image?.dataset.image || image?.getAttribute('src'), base),
      imageId: image?.dataset.imageId ?? null,
      dimensions: image?.dataset.imageDimensions ?? null,
      focalPoint: image?.dataset.imageFocalPoint ?? null,
      alt: image?.getAttribute('alt') ?? null,
      title: anchor?.dataset.title ?? slide.querySelector('.meta-title')?.textContent ?? null,
      descriptionHtml: anchor?.dataset.description ?? slide.querySelector('.meta-description')?.innerHTML ?? null,
      href: absolute(anchor?.getAttribute('href'), base),
      lightbox: !!anchor?.classList.contains('js-gallery-lightbox-opener'),
      html: slide.outerHTML
    };
  });
  return {layout: container?.dataset.design ?? null, settings: {...container?.dataset}, slides};
}

function readBlocks(html, base) {
  return Array.from(fragment(html).querySelectorAll('.sqs-block'), block => {
    const type = block.dataset.sqspBlock || [...block.classList].find(name =>
      name.startsWith('sqs-block-') && name !== 'sqs-block-website-component')?.slice(10);
    const data = {id: block.id || null, type: type || null, typeId: block.dataset.blockType ?? null, html: block.outerHTML};
    if (type === 'gallery' || block.matches('.gallery-block, .sqs-block-gallery')) data.gallery = galleryData(block, base);
    return data;
  });
}

async function readSeo(url, signal) {
  const response = await fetch(url, {mode:'same-origin', signal});
  if (!response.ok) return null;
  const html = await response.text();
  const head = fragment(html.split(/<\/head\s*>/i, 1)[0]);
  const meta = Array.from(head.querySelectorAll('meta[content]'), tag => ({
    name: tag.getAttribute('property') || tag.getAttribute('name') || tag.getAttribute('itemprop'),
    content: tag.getAttribute('content')
  })).filter(tag => tag.name);
  return {
    title: head.querySelector('title')?.textContent ?? null,
    description: meta.find(tag => tag.name.toLowerCase() === 'description')?.content ?? null,
    canonicalUrl: absolute(head.querySelector('link[rel~="canonical"]')?.getAttribute('href'), response.url),
    meta
  };
}

// Returns plain data. HTML fields are source material for a future renderer.
export async function loadPostData(postUrl, {signal} = {}) {
  if (!postUrl) throw new Error('A linked post URL is required.');
  const url = new URL(postUrl, location.href);
  if (url.origin !== location.origin) throw new Error('The linked post must be on this site.');
  url.hash = '';
  url.searchParams.delete('format');
  const jsonUrl = new URL(url);
  jsonUrl.searchParams.set('format', 'json');
  const response = await fetch(jsonUrl, {mode:'same-origin', signal});
  if (!response.ok) throw new Error('Could not load post JSON (' + response.status + ').');
  const {item} = await response.json();
  if (!item?.id || typeof item.body !== 'string') throw new Error('This URL did not return a post body.');
  const base = absolute(item.fullUrl, response.url) || url.href;
  let pageSeo = null;
  try {
    pageSeo = await readSeo(url, signal);
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  return {
    id: item.id, url: base, title: item.title ?? null, excerptHtml: item.excerpt ?? null,
    publishedAt: item.publishOn ?? null, createdAt: item.addedOn ?? null, updatedAt: item.updatedOn ?? null,
    author: item.author ?? null, authorId: item.authorId ?? null, location: item.location ?? null,
    tags: item.tags ?? [], categories: item.categories ?? [], featuredImageUrl: absolute(item.assetUrl, base),
    seo: {item: item.seoData ?? null, page: pageSeo},
    bodyHtml: item.body, blocks: readBlocks(item.body, base), rawItem: item
  };
}
