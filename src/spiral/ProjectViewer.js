/* A collection-shaped project preview. All content remains local mock data. */
const svg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export class ProjectViewer {
  constructor(root, cards, projects) {
    this.root = root;
    this.cards = cards;
    this.projects = projects;
    this.assetDirectory = new URL('.', cards[0].querySelector('img').src);
    this.dialog = document.createElement('dialog');
    this.dialog.className = 'project-dialog portfolio-project-dialog';
    const titleId = `${root.id}-project-title`;
    this.dialog.setAttribute('aria-labelledby', titleId);
    this.dialog.innerHTML = `<div class="project-topbar"><span class="project-frame-label" aria-live="polite"></span><button class="project-icon-button project-close" type="button" data-project-close aria-label="Close project" autofocus><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="project-layout"><div class="project-gallery"><div class="project-image-stage"><img class="project-image" width="1600" height="900" alt="" draggable="false"><button class="project-icon-button project-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">${svg}</button><button class="project-icon-button project-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">${svg}</button></div><div class="project-thumbnails" aria-label="Project gallery"></div></div><aside class="project-info"><p class="project-category"></p><h2 class="project-title" id="${titleId}"></h2><p class="project-summary"></p><div class="project-services"><h3>Project scope</h3><p></p></div><details class="project-notes"><summary>Project notes</summary><ul></ul></details><p class="project-demo-note">Portfolio preview · Project copy to come</p></aside></div>`;
    document.body.append(this.dialog);
    this.image = this.dialog.querySelector('.project-image');
    this.thumbnails = this.dialog.querySelector('.project-thumbnails');
    this.dialog.querySelector('[data-project-close]').addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('[data-gallery-prev]').addEventListener('click', () => this.showFrame(this.frame - 1));
    this.dialog.querySelector('[data-gallery-next]').addEventListener('click', () => this.showFrame(this.frame + 1));
    this.dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = this.previousOverflow;
      this.returnFocus?.focus({ preventScroll: true });
    });
    this.dialog.addEventListener('click', event => {
      if (event.target !== this.dialog) return;
      const box = this.dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) this.dialog.close();
    });
    this.dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        this.showFrame(this.frame + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    const stage = this.dialog.querySelector('.project-image-stage');
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.target.closest('button')) return;
      this.galleryPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointerup', event => {
      const point = this.galleryPointer;
      this.galleryPointer = null;
      if (!point || point.id !== event.pointerId) return;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      const dx = event.clientX - point.x, dy = event.clientY - point.y;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2) this.showFrame(this.frame + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener('pointercancel', () => { this.galleryPointer = null; });
  }

  open(index) {
    this.project = this.projects[index];
    if (!this.project) return;
    this.returnFocus = this.cards[index];
    this.dialog.querySelector('.project-category').textContent = this.project.category;
    this.dialog.querySelector('.project-title').textContent = this.project.title;
    this.dialog.querySelector('.project-summary').textContent = this.project.description;
    this.dialog.querySelector('.project-services p').textContent = this.project.services.join(' / ');
    this.dialog.querySelector('.project-services').hidden = !this.project.services.length;
    this.dialog.querySelector('.project-notes').hidden = !this.project.notes.length;
    const hasGallery = this.project.gallery.length > 1;
    this.dialog.querySelector('[data-gallery-prev]').hidden = !hasGallery;
    this.dialog.querySelector('[data-gallery-next]').hidden = !hasGallery;
    this.thumbnails.hidden = !hasGallery;
    const list = this.dialog.querySelector('.project-notes ul');
    list.replaceChildren(...this.project.notes.map(note => {
      const item = document.createElement('li'); item.textContent = note; return item;
    }));
    this.dialog.querySelector('details').open = false;
    this.thumbnails.replaceChildren(...this.project.gallery.map((frame, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-thumbnail';
      button.setAttribute('aria-label', `Show ${frame.label.toLowerCase()}`);
      const image = document.createElement('img');
      image.src = new URL(frame.file, this.assetDirectory).href;
      image.alt = '';
      image.width = 1600; image.height = 900;
      button.append(image);
      button.addEventListener('click', () => this.showFrame(index));
      return button;
    }));
    this.showFrame(0);
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    this.dialog.showModal();
    this.dialog.scrollTop = 0;
  }

  showFrame(index) {
    this.frame = (index + this.project.gallery.length) % this.project.gallery.length;
    const frame = this.project.gallery[this.frame];
    this.image.src = new URL(frame.file, this.assetDirectory).href;
    this.image.alt = `${this.project.title} — ${frame.label.toLowerCase()}`;
    this.dialog.querySelector('.project-frame-label').textContent = `${this.frame + 1} / ${this.project.gallery.length} — ${frame.label}`;
    [...this.thumbnails.children].forEach((button, i) => button.setAttribute('aria-current', String(i === this.frame)));
  }

  destroy() { if (this.dialog.open) { document.documentElement.style.overflow = this.previousOverflow; this.dialog.close(); } this.dialog.remove(); }
}
