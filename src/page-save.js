// Native request contract: Squarespace MCP content-save/page-password.ts.
// Read and retain the complete settings envelope; change only headerInjectCode.
const idPattern = /^[a-f0-9]{24}$/i;
const scripts = /<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi;
const attributes = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+)))?/g;

function readLayout(attrs, content) {
  if (attrs === undefined) return null;
  const parsed = new Map([...attrs.matchAll(attributes)].map(m => [m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? '']));
  if (!parsed.has('data-gallery-layout')) return null;
  if (parsed.get('type') !== 'application/json') throw Error('An existing gallery setting is not JSON. Check the page header before saving.');
  let data;
  try { data = JSON.parse(content); } catch { throw Error('An existing gallery setting contains invalid JSON. Check the page header before saving.'); }
  if (data?.v !== 1 || typeof data.selector !== 'string' || !['list', 'gallery'].includes(data.type) || !data.options) {
    throw Error('An existing gallery setting has an unsupported format. Check the page header before saving.');
  }
  return data;
}

export function mergePageHeader(header, snippet, remove = false) {
  const incoming = [...snippet.matchAll(scripts)];
  if (incoming.length !== 1 || incoming[0][0] !== snippet.trim()) throw Error('Invalid gallery settings.');
  const target = readLayout(incoming[0][1], incoming[0][2]);
  if (!target) throw Error('Missing gallery settings.');
  let replaced = false;
  const merged = header.replace(scripts, (whole, attrs, content) => {
    const data = readLayout(attrs, content);
    if (!data || data.selector !== target.selector) return whole;
    if (remove || replaced) return '';
    replaced = true;
    return snippet;
  });
  return remove || replaced ? merged : merged + (merged && !merged.endsWith('\n') ? '\n' : '') + snippet + '\n';
}

export function pageSaveContext(win = window) {
  const context = win.Static?.SQUARESPACE_CONTEXT;
  const collectionId = context?.collection?.id;
  const websiteId = context?.website?.id;
  const crumb = win.document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith('crumb='))?.slice(6);
  if (!idPattern.test(collectionId || '') || !idPattern.test(websiteId || '')) {
    throw Error('Open this page on Squarespace to save. Copy code is available for local previews.');
  }
  if (!crumb) throw Error('Sign in to this Squarespace site, then reload the page to save.');
  return { collectionId, websiteId, crumb: decodeURIComponent(crumb) };
}

export async function savePageHeader({ snippet, context, remove = false, fetchImpl = fetch, onBackup = () => {} }) {
  const { collectionId, websiteId, crumb } = context;
  if (!idPattern.test(collectionId || '') || !idPattern.test(websiteId || '') || !crumb) throw Error('A signed-in Squarespace page is required.');
  async function read() {
    const response = await fetchImpl('/api/commondata/GetCollectionSettings?collectionId=' + collectionId, {
      credentials: 'same-origin', cache: 'no-store', redirect: 'error',
      headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw Error('Cannot read page settings. Sign in and check your page-editing permissions.');
    const envelope = await response.json();
    const model = envelope.collectionData ?? envelope;
    if (model?.id !== collectionId || model.websiteId !== websiteId || model.deleted === true ||
        model.folder === true || model.dropdown === true) throw Error('Page settings do not match this page.');
    if (model.headerInjectCode != null && typeof model.headerInjectCode !== 'string') throw Error('Unexpected page header format.');
    return { model, memberAreaData: envelope.memberAreaData ?? {} };
  }
  const before = await read();
  if (before.model.passwordProtected && typeof before.model.password !== 'string') {
    throw Error('This page has a private password setting. Use Copy code in its native Page Settings to preserve that password.');
  }
  const header = before.model.headerInjectCode ?? '';
  const next = mergePageHeader(header, snippet, remove);
  if (next === header) return { unchanged: true };
  onBackup({ collectionId, header, savedAt: new Date().toISOString() });
  // Detect intervening edits before sending the complete native page model.
  const fresh = await read();
  if (JSON.stringify(fresh) !== JSON.stringify(before)) throw Error('Page settings changed while saving. Review the page and save again.');
  let response;
  try {
    response = await fetchImpl('/api/commondata/SaveCollectionSettings', {
      method: 'POST', credentials: 'same-origin', redirect: 'error',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', 'X-CSRF-Token': crumb },
      body: JSON.stringify({
        collectionData: { ...fresh.model, collectionId, headerInjectCode: next },
        memberAreaData: fresh.memberAreaData,
      }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw Error('Save could not be confirmed. Reload and check the page before trying again. Your header backup is available.');
  }
  if (!response.ok) throw Error('Squarespace rejected the save. Check your sign-in and page-editing permissions.');
  let after;
  try { after = await read(); } catch {
    throw Error('Save was sent but could not be verified. Reload and check the page before trying again.');
  }
  if ((after.model.headerInjectCode ?? '').trim() !== next.trim()) throw Error('Squarespace did not return the expected header. Reload and check before trying again.');
  return { unchanged: false };
}
