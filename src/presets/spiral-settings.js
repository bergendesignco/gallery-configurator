export const spiralDefaults = Object.freeze({
  containerWidth: 100, stageHeight: 680, spiralWidth: 87, cardWidth: 280,
  spiralRise: 52, spiralRiseUnit: 'px', aspectRatio: '16:9', spiralGap: 3,
  fit: 'cover', imagePadding: 0, showSlots: false,
});

export const spiralControls = Object.freeze([
  { key: 'containerWidth', label: 'Container width', type: 'range', min: 50, max: 100, step: 1, unit: '%' },
  { key: 'spiralWidth', label: 'Spiral width', type: 'range', min: 60, max: 100, step: 1, unit: '%' },
  { key: 'spiralRiseUnit', label: 'Rise measured in', type: 'select', choices: [{ value: 'px', label: 'Pixels' }, { value: 'percent', label: '% of height' }] },
  { key: 'spiralRise', label: 'Rise per slot', type: 'range', min: 8, max: 280, step: 1, unit: 'px', percent: { min: 1, max: 30, step: .1, unit: '%' } },
  { key: 'aspectRatio', label: 'Aspect ratio', type: 'select', choices: ['16:9', '3:2', '4:3', '1:1', '4:5', '9:16'].map(value => ({ value, label: value })) },
  { key: 'spiralGap', label: 'Gap between cards', type: 'range', min: 0, max: 16, step: 1, unit: '%' },
  { key: 'imagePadding', label: 'Image padding', type: 'range', min: 0, max: 20, step: 1, unit: '%' },
  { key: 'showSlots', label: 'Show slot outlines', type: 'checkbox' },
]);
