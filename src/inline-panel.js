import { defaults, presets, spiralControls, spiralDefaults, usesMinimumHeight } from './runtime.js';
import panelCSS from './inline-panel.css';

const imageFits = [
  { value: 'cover', label: 'Fill the card' },
  { value: 'contain', label: 'Fit the whole image' },
];

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function button(className, text, label) {
  const element = node('button', className, text);
  element.type = 'button';
  if (label) element.setAttribute('aria-label', label);
  return element;
}

function range(key, label, min, max, step, unit = '') {
  return { key, label, type: 'range', min, max, step, unit };
}

function select(key,label,entries) {
  return {key,label,type:'select',choices:Object.entries(entries).map(([value,label])=>({value,label}))};
}
function swatch(key,label,when) {
  return {key,label,type:'color',when, independent:true};
}

export function controlGroups(options, sourceType) {
  const preset = options.preset;
  const minimum = usesMinimumHeight(preset);
  const geometry = [
    { key: 'galleryWidth', label: 'Gallery width', type: 'select', choices: [
      { value: 'full', label: 'Full page' }, { value: 'source', label: 'Follow section or block' },
    ] },
    range('cardWidth', 'Card width', 80, preset === 'timed' ? 960 : preset === 'spiral' ? 720 : 560, 1, 'px'),
    range('stageHeight', minimum ? 'Minimum gallery height' : 'Gallery height', minimum ? 0 : 300, 1200, 1, 'px'),
  ];
  if(sourceType!=='list'){
    geometry.splice(1,0,{key:'galleryHeight',label:'Height sizing',type:'select',choices:[{value:'source',label:'Follow block'},{value:'custom',label:'Custom height'}]});
    if(options.galleryHeight!=='custom')geometry.splice(geometry.findIndex(f=>f.key==='stageHeight'),1);
  }
  if (preset === 'spiral') {
    geometry.push(...spiralControls);
  } else {
    geometry.push(range('gap', 'Spacing', 0, 100, 1, 'px'));
    if (preset !== 'infinite' && preset !== 'timed') {
      const depthLabel = { ring: 'Flip strength', angled: 'Perspective', stack: 'Tilt strength' }[preset] || 'Depth';
      geometry.push(range('depth', depthLabel, 0, 100, 1));
    }
  }

  const interaction = [{
    key: 'clickAction', label: 'Click action', type: 'select', choices: [
      { value: 'preview', label: sourceType==='summary' ? 'Open blog post' : preset === 'showcase' ? 'Open details panel' : 'Open image preview' },
      { value: 'link', label: 'Follow item link' },
      { value: 'none', label: 'None' },
    ],
  }];
  if (preset === 'arc-tabs' || preset === 'timed') {
    interaction.unshift({ key: 'navigation', label: 'Navigation', type: 'select', choices: [
      { value: 'auto', label: 'Auto' }, { value: 'tabs', label: 'Title tabs' }, { value: 'dots', label: 'Dots' },
    ] });
  }
  if (preset !== 'stack') {
    interaction.push({ key: 'showControls', label: 'Show controls', type: 'checkbox' });
    interaction.push({ key: 'autoplay', label: 'Autoplay', type: 'checkbox' });
    if (preset !== 'spiral') interaction.push(range('duration', 'Time per image', 2, 15, 0.5, 's'));
  }
  interaction.push({ key: 'reducedMotion', label: 'Reduce motion', type: 'checkbox' });

  return [
    { title: 'Size & spacing', fields: geometry },
    { title: 'Mobile overrides', fields: [
      { ...geometry.find(field => field.key === 'cardWidth'), key: 'mobileCardWidth', label: 'Mobile card width', inherits: 'cardWidth' },
      { ...geometry.find(field => field.key === (preset === 'spiral' ? 'spiralGap' : 'gap')),
        key: 'mobileGap', label: 'Mobile spacing', inherits: preset === 'spiral' ? 'spiralGap' : 'gap' },
    ] },
    { title: 'Interaction', fields: interaction },
    { title: 'Appearance', fields: [
      { key: 'colorSource', label: 'Color source', type: 'select', choices: [
        { value: 'section', label: 'Section theme' },
        { value: 'custom', label: 'Custom colors' },
      ] },
      { key: 'typeSource', label: 'Type source', type: 'select', choices: [
        { value: 'native', label: 'Native list / site type' },
        { value: 'preset', label: 'Layout preset' },
      ] },
      { key: 'fit', label: 'Image fit', type: 'select', choices: imageFits },
      ...(preset==='spiral'?[
        range('spiralRadius','Corner radius',0,64,1,'px'),
        range('borderWidth','Border width',0,12,1,'px'), swatch('spiralRim','Border color'),
      ]:[
        range('radius','Corner radius',0,64,1,'px'),
        range('borderWidth','Border width',0,12,1,'px'),
        {key:'borderColor',label:'Border color',type:'color'},
        {key:'shadow',label:'Drop shadow',type:'select',choices:[
          {value:'preset',label:'Layout default'},{value:'none',label:'None'},{value:'soft',label:'Soft'},{value:'deep',label:'Deep'}
        ]},
        {key:'overlayColor',label:'Image overlay',type:'color'},
        range('overlayOpacity','Overlay opacity',0,100,1,'%'),
        {key:'hoverEffect',label:'Hover effect',type:'select',choices:[
          {value:'preset',label:'Layout default'},{value:'zoom',label:'Zoom image'},{value:'lift',label:'Lift card'}
        ]}
      ]),
      ...(['spiral','ring'].includes(preset)?[
        select('backFace','Card back',{mirror:'Reversed image',solid:'Solid color'}),
        swatch('backColor','Back color',['backFace','solid']),
      ]:[]),
      ...(preset==='stack'?[]:[
        select('edgeMode','Stage edges',{preset:'Layout default',hard:'Hard edge',gradient:'Gradient fade'}),
        {...range('edgeFade','Fade width at each edge',1,40,1,'%'),when:['edgeMode','gradient']},
      ]),
      { key: 'showTitles', label: 'Show titles', type: 'checkbox' },
      { key: 'background', label: 'Background', type: 'color' },
      { key: 'ink', label: 'Text color', type: 'color' },
      { key: 'accent', label: 'Accent color', type: 'color' },
    ] },
    ...(preset==='stack'?[]:[{title:'Control styling',fields:[
      range('controlSize','Button size',44,72,1,'px'),
      select('controlShape','Button shape',{circle:'Circle',rounded:'Rounded square',square:'Square'}),
      select('arrowStyle','Arrow style',{arrow:'Arrow',chevron:'Chevron'}),
      select('controlPalette','Button colors',{theme:'Use layout colors',custom:'Custom'}),
      swatch('controlFill','Button background',['controlPalette','custom']),
      swatch('controlInk','Button icon',['controlPalette','custom']),
    ]}]),
    {title:'Title styling',fields:[
      {key:'titleSize',label:'Title size',type:'select',numeric:true,choices:[
        {value:0,label:'Use layout size'},...[.875,1,1.25,1.5,2,2.5,3,4].map(value=>({value,label:value+' rem'}))
      ]},
      select('titleWeight','Title weight',{inherit:'Use layout weight',400:'Regular',500:'Medium',600:'Semibold',700:'Bold'}),
      select('titlePalette','Title color',{theme:'Use layout color',custom:'Custom'}),
      swatch('titleColor','Custom title color',['titlePalette','custom']),
    ]},
  ];
}

function optionsWithDefaults(options) {
  return { ...defaults, stageHeight: usesMinimumHeight(options.preset ?? defaults.preset) ? 0 : 590, ...(options.preset === 'spiral' ? spiralDefaults : {}), colorSource: 'section', typeSource: 'native', ...options };
}

function describeSource(source) {
  const type = source.type === 'list' ? 'List Section' : source.type==='summary'?'Summary Block':'Gallery Block';
  const name = source.name?.trim() || type;
  const count = source.items?.length || 0;
  const target = name.toLowerCase().includes(type.toLowerCase()) ? name : `${name} · ${type}`;
  return `${target} · ${count} ${count === 1 ? 'item' : 'items'}`;
}

// Editor notices can cover the iframe without changing its viewport size.
function followEditorViewport(panel) {
  const frame = window.frameElement;
  if (!frame || frame.id !== 'sqs-site-frame') return () => {};
  const outer = frame.ownerDocument;
  const editor = outer.defaultView;
  let tick = 0;
  function measure() {
    tick = 0;
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height || !frame.offsetHeight) return;
    const scale = rect.height / frame.offsetHeight;
    const panelRect = panel.getBoundingClientRect();
    const scaleX = rect.width / frame.offsetWidth;
    const bottom = Math.min(rect.bottom, editor.innerHeight);
    let usableBottom = bottom;
    for (const fraction of [.1, .5, .9]) {
      const x = rect.left + (panelRect.left + panelRect.width * fraction) * scaleX;
      let hit = outer.elementFromPoint(x, bottom - 2);
      if (!hit || hit === frame) continue;
      while (hit && !hit.contains(frame)) {
        const box = hit.getBoundingClientRect();
        if (box.bottom >= bottom - 2 && box.height > 0 && box.height < rect.height / 2)
          usableBottom = Math.min(usableBottom, box.top);
        hit = hit.parentElement;
      }
    }
    panel.style.setProperty('--gc-editor-bottom', Math.max(0, Math.ceil((rect.bottom - usableBottom) / scale)) + 'px');
  }
  function schedule() { if (!tick) tick = requestAnimationFrame(measure); }
  const resized = new ResizeObserver(schedule);
  resized.observe(frame);
  resized.observe(outer.documentElement);
  const changed = new MutationObserver(schedule);
  changed.observe(outer.body, {subtree:true, childList:true, attributes:true, attributeFilter:['hidden','class','style']});
  editor.addEventListener('resize', schedule);
  editor.addEventListener('transitionend', schedule);
  measure();
  return () => {
    resized.disconnect();
    changed.disconnect();
    editor.removeEventListener('resize', schedule);
    editor.removeEventListener('transitionend', schedule);
    cancelAnimationFrame(tick);
  };
}

/** Mount the author controls beside the currently selected source. */
export function createPanel({ source, options, onPreset, onOption, onClose, onRestore, onSave, getSaveState, getCode, getStyle, applyStyle }) {
  const previousFocus = document.activeElement;
  let currentSource = source;
  let current = optionsWithDefaults(options);
  let minimized = false;
  let destroyed = false;
  let copyAttempt = 0;
  const fields = new Map();
  const groups = new Map();
  const element = node('div');
  element.setAttribute('data-gc-author-panel', '');
  element.setAttribute('data-lenis-prevent','');
  // Keep site-level smooth-scroll handlers out of the settings panel.
  element.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
  element.addEventListener('touchmove',event=>event.stopPropagation(),{passive:true});
  const shadow = element.attachShadow({ mode: 'open' });
  const style = node('style');
  style.textContent = panelCSS;

  const panel = node('aside', 'panel');
  panel.setAttribute('aria-labelledby', 'gc-author-heading');
  const header = node('header', 'header');
  const heading = node('div', 'heading');
  const title = node('h2', '', 'Gallery settings');
  title.id = 'gc-author-heading';
  const target = node('p', 'target');
  const saveState = node('p', 'save-state');
  saveState.setAttribute('role','status');
  heading.append(title, target, saveState);
  function showSaveState(label = getSaveState()) {
    if(saveState.textContent === label)return;
    saveState.textContent = label;
    saveState.dataset.saved = String(label === 'Saved to page');
  }
  const headerActions = node('div', 'header-actions');
  const minimize = button('icon-button', '−', 'Minimize settings');
  minimize.setAttribute('aria-controls', 'gc-author-controls');
  minimize.setAttribute('aria-expanded', 'true');
  const close = button('icon-button', '×', 'Close settings');
  headerActions.append(minimize, close);
  header.append(heading, headerActions);

  const controls = node('div', 'controls');
  controls.id = 'gc-author-controls';
  const scroll = node('div', 'scroll');
  scroll.tabIndex = 0;
  scroll.setAttribute('aria-label','Layout settings');
  const presetRow = node('label', 'preset-row');
  const presetSelect = node('select', 'preset-select');
  presetSelect.setAttribute('aria-label', 'Layout');
  for (const preset of presets.filter(preset=>source.type==='list'||preset.id!=='stack')) {
    const option = node('option', '', preset.name);
    option.value = preset.id;
    presetSelect.append(option);
  }
  presetRow.append(node('span', 'field-label', 'Layout'), presetSelect);
  const groupArea = node('div', 'groups');
  const styleActions = node('div', 'style-actions');
  const copyStyle = button('text-button', 'Copy style');
  const pasteStyle = button('text-button', 'Paste style');
  styleActions.append(copyStyle, pasteStyle);
  const transfer = node('div', 'style-transfer');
  transfer.hidden = true;
  const styleText = node('textarea');
  styleText.setAttribute('aria-label', 'Gallery style');
  styleText.spellcheck = false;
  const applyButton = button('secondary', 'Apply style');
  const cancelTransfer = button('text-button', 'Close', 'Close style transfer');
  transfer.append(styleText, applyButton, cancelTransfer);
  scroll.append(presetRow, styleActions, transfer, groupArea);

  const footer = node('footer', 'footer');
  const exportActions = node('div', 'export-actions');
  const save = button('primary', 'Save to page');
  const copy = button('secondary', 'Copy code');
  const backup = button('text-button', 'Download header backup');
  backup.hidden = true;
  let headerBackup = null;
  const view = button('secondary', 'View code');
  view.setAttribute('aria-expanded', 'false');
  view.setAttribute('aria-controls', 'gc-author-code');
  exportActions.append(save, copy);
  const codeView = node('div', 'code-view');
  codeView.id = 'gc-author-code';
  codeView.hidden = true;
  const codeLabel = node('label', 'code-label', 'Page Header Code Injection');
  const code = node('textarea');
  code.readOnly = true;
  code.spellcheck = false;
  code.setAttribute('aria-label', 'Page header code');
  codeLabel.append(code);
  codeView.append(codeLabel);
  const footerLine = node('div', 'footer-line');
  const status = node('span', 'status');
  status.setAttribute('role', 'status');
  const reset = button('text-button', 'Reset preview');
  footerLine.append(status, reset);
  const backupActions = node('div', 'backup-actions');
  const removeLayout = button('text-button', 'Remove layout');
  removeLayout.hidden = getSaveState() === 'Not saved yet';
  backupActions.append(view, backup, removeLayout);
  const removal = node('div', 'removal');
  removal.hidden = true;
  removal.append(node('p', '', 'Restore the native ' + currentSource.name + ' and remove its saved layout from this page?'));
  const cancelRemoval = button('secondary','Keep layout');
  const confirmRemoval = button('secondary','Remove saved layout');
  removal.append(cancelRemoval, confirmRemoval);
  footer.append(exportActions, backupActions, codeView, removal, footerLine);
  controls.append(scroll, footer);
  panel.append(header, controls);
  shadow.append(style, panel);
  document.body.append(element);
  const stopFollowingViewport = followEditorViewport(element);

  function syncField(field) {
    const { definition, input, output, row } = field;
    const value = current[definition.key];
    if(definition.when) row.hidden = current[definition.when[0]] !== definition.when[1];
    if (definition.type === 'checkbox') {
      input.checked = Boolean(value);
      return;
    }
    if (definition.type === 'range') {
      const spec = definition.key === 'spiralRise' && current.spiralRiseUnit === 'percent'
        ? { ...definition, ...definition.percent } : definition;
      input.min = String(spec.min);
      input.max = String(spec.max);
      input.step = String(spec.step);
      const inherited = definition.inherits && value == null;
      if (field.enable) {
        field.enable.checked = !inherited;
        input.disabled = Boolean(inherited);
      }
      input.value = String(inherited ? current[definition.inherits] : value);
      const auto = ['titleSize','stageHeight'].includes(spec.key) && spec.min === 0 && Number(input.value) === 0;
      const reading = auto ? 'Auto' : `${input.value}${spec.unit || ''}`;
      output.textContent = inherited ? `Inherit · ${reading}` : reading;
      input.setAttribute('aria-valuetext', reading);
      return;
    }
    input.value = String(value);
    if (definition.type === 'color') {
      if (!definition.independent) row.hidden = current.colorSource === 'section';
      output.textContent = input.value.toUpperCase();
    }
  }

  function refreshCode() {
    showSaveState();
    copyAttempt += 1;
    status.textContent = '';
    if (!codeView.hidden) code.value = getCode();
  }

  function changeOption(key, value) {
    const previousUnit = current.spiralRiseUnit;
    current = { ...current, [key]: value };
    if (key === 'spiralRiseUnit' && previousUnit !== value) {
      const height = Math.max(1, current.stageHeight);
      const rise = value === 'percent'
        ? Math.max(1, Math.min(30, Math.round(current.spiralRise / height * 1000) / 10))
        : Math.max(8, Math.min(280, Math.round(current.spiralRise * height / 100)));
      current.spiralRise = rise;
      onOption(key, value);
      onOption('spiralRise', rise);
      syncField(fields.get('spiralRise'));
    } else {
      onOption(key, value);
    }
    if (key === 'galleryHeight') buildGroups();
    if (key === 'colorSource') fields.forEach(syncField);
    else syncField(fields.get(key));
    for (const field of fields.values()) if (field.definition.inherits === key || field.definition.when?.[0] === key) syncField(field);
    refreshCode();
  }

  function makeField(definition) {
    const { key, label, type } = definition;
    const row = node(definition.inherits ? 'div' : 'label', `field field-${type}`);
    const name = node('span', 'field-label', label);
    const input = node(type === 'select' ? 'select' : 'input');
    input.setAttribute('aria-label', label);
    input.dataset.option = key;
    if (type === 'select') {
      for (const choice of definition.choices) {
        const option = node('option', '', choice.label);
        option.value = choice.value;
        input.append(option);
      }
    } else {
      input.type = type;
    }
    let output;
    if (type === 'range' || type === 'color') {
      output = node('output', 'value');
      output.setAttribute('aria-hidden', 'true');
    }
    row.append(name);
    if (output) row.append(output);
    row.append(input);
    const field = { definition, input, output, row };
    if (definition.inherits) {
      const enable = node('input');
      enable.type = 'checkbox';
      enable.setAttribute('aria-label', 'Customize ' + label.toLowerCase());
      const toggle = node('label', 'override-toggle');
      toggle.append(enable, name);
      row.prepend(toggle);
      field.enable = enable;
      enable.addEventListener('change', () => changeOption(key, enable.checked ? current[definition.inherits] : null));
    }
    fields.set(key, field);
    syncField(field);
    input.addEventListener(type === 'range' || type === 'color' ? 'input' : 'change', () => {
      const value = type === 'range' || definition.numeric ? Number(input.value) : type === 'checkbox' ? input.checked : input.value;
      changeOption(key, value);
    });
    return row;
  }

  function buildGroups() {
    const openGroups = new Map([...groups].map(([name, details]) => [name, details.open]));
    fields.clear();
    groups.clear();
    groupArea.replaceChildren();
    for (const group of controlGroups(current, currentSource.type)) {
      const details = node('details', 'group');
      details.open = openGroups.get(group.title) ?? group.title === 'Size & spacing';
      const summary = node('summary', '', group.title);
      const body = node('div', 'group-body');
      for (const definition of group.fields) body.append(makeField(definition));
      details.append(summary, body);
      groupArea.append(details);
      groups.set(group.title, details);
    }
  }

  function update(next) {
    if (destroyed) return;
    const previousPreset = current.preset;
    currentSource = next.source ?? currentSource;
    if (next.options) current = optionsWithDefaults(next.options);
    target.textContent = describeSource(currentSource);
    target.title = currentSource.selector || target.textContent;
    presetSelect.value = current.preset;
    if (!fields.size || previousPreset !== current.preset) buildGroups();
    else fields.forEach(syncField);
    refreshCode();
  }

  function showCode(show) {
    codeView.hidden = !show;
    view.textContent = show ? 'Hide code' : 'View code';
    view.setAttribute('aria-expanded', String(show));
    if (show) {
      code.value = getCode();
      code.focus({ preventScroll: true });
      code.select();
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    copyAttempt += 1;
    const returnFocus = document.activeElement === element;
    document.removeEventListener('keydown', escapePanel);
    stopFollowingViewport();
    element.remove();
    if (returnFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  }

  function dismiss(callback) {
    if (destroyed) return;
    try { callback(); }
    finally { destroy(); }
  }

  function escapePanel(event) {
    if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;
    if (!removal.hidden) {
      event.preventDefault();
      setRemoval(false);
      return;
    }
    if (document.querySelector('dialog[open]') || event.composedPath().some(target => target?.getAttribute?.('aria-modal') === 'true')) return;
    event.preventDefault();
    dismiss(onClose);
  }

  minimize.addEventListener('click', () => {
    minimized = !minimized;
    controls.hidden = minimized;
    element.toggleAttribute('data-minimized', minimized);
    minimize.textContent = minimized ? '+' : '−';
    minimize.setAttribute('aria-expanded', String(!minimized));
    minimize.setAttribute('aria-label', minimized ? 'Expand settings' : 'Minimize settings');
  });
  close.addEventListener('click', () => dismiss(onClose));
  reset.addEventListener('click', () => dismiss(onRestore));
  presetSelect.addEventListener('change', () => onPreset(presetSelect.value));
  view.addEventListener('click', () => showCode(codeView.hidden));
  function openTransfer(readOnly, text) {
    transfer.hidden = false;
    applyButton.hidden = readOnly;
    styleText.readOnly = readOnly;
    styleText.value = text;
    styleText.placeholder = readOnly ? '' : 'Paste the copied gallery style';
    styleText.focus();
    if (readOnly) styleText.select();
  }
  copyStyle.addEventListener('click', async () => {
    const text = getStyle();
    try {
      await navigator.clipboard.writeText(text);
      if (!destroyed) { transfer.hidden = true; status.textContent = 'Style copied'; }
    } catch {
      if (destroyed) return;
      openTransfer(true, text);
      status.textContent = 'Style selected. Choose Copy.';
    }
  });
  pasteStyle.addEventListener('click', () => {
    status.textContent = '';
    openTransfer(false, '');
  });
  cancelTransfer.addEventListener('click', () => {
    transfer.hidden = true;
    pasteStyle.focus();
  });
  applyButton.addEventListener('click', () => {
    if (!applyStyle(styleText.value)) {
      status.textContent = 'Paste a style from Copy style.';
      styleText.focus();
      return;
    }
    transfer.hidden = true;
    status.textContent = 'Style applied to this preview';
    pasteStyle.focus();
  });
  backup.addEventListener('click', () => {
    if (!headerBackup) return;
    const url = URL.createObjectURL(new Blob([headerBackup.header], {type:'text/plain'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gallery-header-backup-' + headerBackup.collectionId + '.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  async function persist(remove = false) {
    if (remove) setRemoval(false);
    if(save.disabled) return;
    save.disabled = reset.disabled = removeLayout.disabled = true;
    scroll.inert = true;
    save.textContent = 'Saving…';
    showSaveState(remove ? 'Removing…' : 'Saving…');
    status.textContent = remove ? 'Removing layout…' : 'Saving to page header…';
    try {
      await onSave(value => {
        headerBackup = value;
        if (!destroyed) backup.hidden = false;
      }, remove);
      if (!destroyed) status.textContent = 'Saved to page header';
    } catch(error) {
      if (!destroyed) status.textContent = error.message || 'Save failed. Copy code is still available.';
    } finally {
      if (!destroyed) {
        save.disabled = reset.disabled = removeLayout.disabled = false;
        removeLayout.hidden = getSaveState() === 'Not saved yet';
        scroll.inert = false;
        save.textContent = 'Save to page';
        showSaveState();
      }
    }
  }
  save.addEventListener('click', () => persist());
  function setRemoval(open) {
    removal.hidden = !open;
    scroll.inert = open;
    exportActions.hidden = backupActions.hidden = footerLine.hidden = open;
    if (open) {
      showCode(false);
      cancelRemoval.focus();
    } else removeLayout.focus();
  }
  removeLayout.addEventListener('click', () => setRemoval(true));
  cancelRemoval.addEventListener('click', () => setRemoval(false));
  confirmRemoval.addEventListener('click', () => persist(true));
  copy.addEventListener('click', async () => {
    const attempt = ++copyAttempt;
    const snippet = getCode();
    try {
      await navigator.clipboard.writeText(snippet);
      if (!destroyed && attempt === copyAttempt) status.textContent = 'Page code copied';
    } catch {
      if (destroyed || attempt !== copyAttempt) return;
      showCode(true);
      status.textContent = 'Code selected. Choose Copy.';
    }
  });
  document.addEventListener('keydown', escapePanel);
  update({ source, options });
  presetSelect.focus({ preventScroll: true });
  return { element, update, destroy };
}
