const shapes = {
  previous: '<path d="M17 10H3m6-6-6 6 6 6"/>',
  next: '<path d="M3 10h14m-6-6 6 6-6 6"/>',
  play: '<path d="M7 4.5 15.8 10 7 15.5Z" fill="currentColor" stroke-width="1.25"/>',
  pause: '<path d="M7 5.4v9.2m6-9.2v9.2" stroke-width="2.8"/>',
};

function svg(name) {
  return `<svg class="gc-transport-icon gc-icon-${name}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${shapes[name]}</svg>`;
}

/** Playback shows the action corresponding to the button's data-paused state. */
export function setTransportIcon(button, name) {
  button.classList.add('gc-transport');
  button.innerHTML = name === 'playback' ? svg('play') + svg('pause') : svg(name);
  return button;
}
