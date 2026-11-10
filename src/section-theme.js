// Inline layouts inherit the active section's CSS variables. Keeping each native
// dialog in that subtree also keeps its theme when the browser puts it in the top layer.
export function applyGalleryTheme(host,options){
 const inline=host.classList.contains('gc-embed');
 const section=inline&&options.colorSource==='section';
 if(section)host.dataset.gcColorSource='section';else delete host.dataset.gcColorSource;
 if(inline&&options.typeSource==='native')host.dataset.gcTypeSource='native';else delete host.dataset.gcTypeSource;

 const css=host.style;
 css.setProperty('--gc-custom-background',options.background);
 css.setProperty('--gc-custom-ink',options.ink);
 css.setProperty('--gc-custom-accent',options.accent);
 css.setProperty('--gc-background',section?'var(--gc-section-surface)':options.background);
 css.setProperty('--gc-ink',section?'var(--gc-section-body)':options.ink);
 css.setProperty('--gc-accent',section?'var(--gc-section-action)':options.accent);
 css.setProperty('--gc-muted',section?'var(--gc-section-body)':options.ink+'aa');
 css.setProperty('--gc-spatial-surface','var(--gc-background)');
 css.setProperty('--gc-spatial-ink','var(--gc-ink)');
 if(section){
  css.setProperty('--gc-line-color','var(--gc-section-line)');
  css.setProperty('--gc-tint','var(--gc-section-body)');
 }
 css.background=section?'transparent':options.background;
 css.color=section?'var(--gc-section-body)':options.ink;
 for(const dialog of host.querySelectorAll(':scope > dialog'))markDialog(host,dialog);
}

function markDialog(host,dialog){
 for(const key of ['gcColorSource','gcTypeSource']){
  if(host.dataset[key])dialog.dataset[key]=host.dataset[key];else delete dialog.dataset[key];
 }
}

export function attachGalleryDialog(host,dialog){
 const parent=host.classList.contains('gc-embed')?host:host.ownerDocument.body;
 markDialog(host,dialog);
 if(dialog.parentElement!==parent)parent.append(dialog);
}
