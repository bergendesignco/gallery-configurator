// Fluid Engine renders the selection toolbar in the parent and the block in the frame.
export function editorBlocks({activate, configure, installed}) {
  const outer = window.parent.document;
  const key = 'gc-editor-blocks:' + location.pathname;
  let drafts = new Set();
  try { drafts = new Set(JSON.parse(sessionStorage.getItem(key) || '[]')); } catch {}
  const selector = '.sqs-block-summary-v2[id],.sqs-block-gallery[id]';
  const cellSelector = '[data-fluid-engine-block][data-block-id]';
  const edit = () => document.querySelector('.sqs-edit-mode-active') || document.documentElement.classList.contains('sqs-edit-mode-active');
  const button = outer.createElement('button');
  button.type = 'button';
  button.style.cssText = 'align-self:center;background:white;color:#222;border:0;border-left:1px solid #ddd;padding:8px 10px;font:500 13px system-ui;cursor:pointer;white-space:nowrap';
  let frame = 0;
  function selected() {
    const cells = document.querySelectorAll(cellSelector+'[data-is-selected="true"]');
    return cells.length===1 ? cells[0].querySelector(selector) : null;
  }
  function sync() {
    frame = 0;
    for (const root of document.querySelectorAll(selector)) {
      if (drafts.has(root.id) || installed(root)) {
        root.classList.add('gc-editor-bound');
        activate(root);
      } else root.classList.remove('gc-editor-bound');
    }
    const root = edit() && selected();
    const bar = root && outer.querySelector('[data-test="block-toolbar"]');
    if (!bar) { button.remove(); return; }
    const label = root.classList.contains('gc-editor-bound') ? 'Configure carousel' : 'Use as carousel';
    if (button.textContent !== label) button.textContent = label;
    if (button.parentElement !== bar) bar.append(button);
  }
  function queue() { if (!frame) frame = requestAnimationFrame(sync); }
  function persist() { try { sessionStorage.setItem(key,JSON.stringify([...drafts])); } catch {} }
  button.onpointerdown = event => event.stopPropagation();
  button.onclick = event => {
    event.stopPropagation();
    const root = selected();
    if (!root) return;
    if (root.classList.contains('gc-editor-bound')) configure(root);
    else { drafts.add(root.id); persist(); sync(); }
  };
  const changes = new MutationObserver(queue);
  changes.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-is-selected']});
  const toolbar = new MutationObserver(queue);
  toolbar.observe(outer.body,{childList:true,subtree:true});
  queue();
  return {
    forget(root) { drafts.delete(root.id); persist(); queue(); },
    destroy() {
      changes.disconnect(); toolbar.disconnect(); cancelAnimationFrame(frame); button.remove();
      document.querySelectorAll('.gc-editor-bound').forEach(root=>root.classList.remove('gc-editor-bound'));
    }
  };
}
