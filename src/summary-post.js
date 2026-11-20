// Copy reading content without bringing the post's page shell or scripts into the dialog.
const tags = new Set('p h1 h2 h3 h4 h5 h6 ul ol li blockquote strong b i em u sup sub pre code a br hr figure figcaption img table thead tbody tr th td'.split(' '));
function copyContent(node, base) {
  if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.data);
  const content = document.createDocumentFragment();
  if (node.nodeType !== Node.ELEMENT_NODE || node.matches('script,style,template,noscript,iframe,form,svg')) return content;
  const tag = node.localName;
  const output = tags.has(tag) ? document.createElement(tag) : content;
  if (tag === 'a' || tag === 'img') {
    const attr = tag === 'img' ? 'src' : 'href';
    const raw = tag === 'img' ? node.dataset.src || node.getAttribute('src') : node.getAttribute('href');
    const url = raw && URL.canParse(raw, base) ? new URL(raw, base) : null;
    if (url && ['https:', 'http:'].includes(url.protocol)) output.setAttribute(attr, url.href);
    if (tag === 'img') { output.alt = node.alt; output.loading = 'lazy'; }
  }
  for (const child of node.childNodes) output.append(copyContent(child, base));
  return output;
}
export async function loadPost(target, item) {
  target.textContent = 'Loading post…';
  try {
    const url = new URL(item.postUrl);
    if (url.origin !== location.origin) throw Error();
    const response = await fetch(url, {mode:'same-origin'});
    if (!response.ok) throw Error();
    const doc = new DOMParser().parseFromString(await response.text(),'text/html');
    const body = doc.querySelector('.blog-item-content,article .entry-content,article .body');
    if (!body) throw Error();
    target.replaceChildren(copyContent(body, response.url));
  } catch {
    target.textContent = 'Open the full post using the link below.';
  }
}
