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

export function controlGroups(options) {
  const preset = options.preset;
  const minimum = usesMinimumHeight(preset);
  const geometry = [
    { key: 'galleryWidth', label: 'Gallery width', type: 'select', choices: [
      { value: 'full', label: 'Full page' }, { value: 'source', label: 'Follow section or block' },
    ] },
    range('cardWidth', 'Card width', 80, preset === 'timed' ? 960 : preset === 'spiral' ? 720 : 560, 1, 'px'),
    range('stageHeight', minimum ? 'Minimum gallery height' : 'Gallery height', minimum ? 0 : 300, 1200, 1, 'px'),
  ];
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
      { value: 'preview', label: preset === 'showcase' ? 'Open details panel' : 'Open image preview' },
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
      ...(preset==='spiral'?[]:[
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
      { key: 'showTitles', label: 'Show titles', type: 'checkbox' },
      { key: 'background', label: 'Background', type: 'color' },
      { key: 'ink', label: 'Text color', type: 'color' },
      { key: 'accent', label: 'Accent color', type: 'color' },
    ] },
  ];
}

function optionsWithDefaults(options) {
  return { ...defaults, stageHeight: usesMinimumHeight(options.preset ?? defaults.preset) ? 0 : 590, ...(options.preset === 'spiral' ? spiralDefaults : {}), colorSource: 'section', typeSource: 'native', ...options };
}

function describeSource(source) {
  const type = source.type === 'list' ? 'List Section' : 'Gallery Block';
  const name = source.name?.trim() || type;
  const count = source.items?.length || 0;
  const target = name.toLowerCase().includes(type.toLowerCase()) ? name : `${name} · ${type}`;
  return `${target} · ${count} ${count === 1 ? 'item' : 'items'}`;
}

/** Mount the author controls beside the currently selected source. */
export function createPanel({ source, options, onPreset, onOption, onClose, onRestore, getCode, getStyle, applyStyle }) {
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
  heading.append(title, target);
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
  const presetRow = node('label', 'preset-row');
  const presetSelect = node('select', 'preset-select');
  presetSelect.setAttribute('aria-label', 'Layout');
  for (const preset of presets) {
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
  const copy = button('primary', 'Copy page code');
  const view = button('secondary', 'View code');
  view.setAttribute('aria-expanded', 'false');
  view.setAttribute('aria-controls', 'gc-author-code');
  exportActions.append(copy, view);
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
  footer.append(exportActions, codeView, footerLine);
  controls.append(scroll, footer);
  panel.append(header, controls);
  shadow.append(style, panel);
  document.body.append(element);

  function syncField(field) {
    const { definition, input, output, row } = field;
    const value = current[definition.key];
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
      const auto = spec.key === 'stageHeight' && spec.min === 0 && Number(input.value) === 0;
      const reading = auto ? 'Auto' : `${input.value}${spec.unit || ''}`;
      output.textContent = inherited ? `Inherit · ${reading}` : reading;
      input.setAttribute('aria-valuetext', reading);
      return;
    }
    input.value = String(value);
    if (definition.type === 'color') {
      row.hidden = current.colorSource === 'section';
      output.textContent = input.value.toUpperCase();
    }
  }

  function refreshCode() {
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
    if (key === 'colorSource') fields.forEach(syncField);
    else syncField(fields.get(key));
    for (const field of fields.values()) if (field.definition.inherits === key) syncField(field);
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
      const value = type === 'range' ? Number(input.value) : type === 'checkbox' ? input.checked : input.value;
      changeOption(key, value);
    });
    return row;
  }

  function buildGroups() {
    const openGroups = new Map([...groups].map(([name, details]) => [name, details.open]));
    fields.clear();
    groups.clear();
    groupArea.replaceChildren();
    for (const group of controlGroups(current)) {
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
