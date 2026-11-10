// Paste into the gallery's frame console for a read-only geometry report.
// In Chromium, arbitrary 3D projections can also be supplied using CDP's
// DOM.getBoxModel().model.border, indexed by stage and then by card in DOM order.
// Without a native quad, verified affine geometry is exact for the 2D arc layouts.
function inspectGalleryFraming(doc = document, borderQuads = []) {
  const view = doc.defaultView;
  const width = doc.documentElement.clientWidth;
  const height = doc.documentElement.clientHeight;
  const round = n => Math.round(n * 10) / 10;
  const bounds = (poly, axis) => [Math.min(...poly.map(p => p[axis])), Math.max(...poly.map(p => p[axis]))];
  const box = rect => [rect.left, rect.top, rect.right, rect.bottom].map(round);

  // Intersect edges with the specified half plane. This includes the point
  // where a sloping card edge crosses a viewport boundary even if no corner lies there.
  function halfPlane(polygon, axis, edge, direction) {
    const result = [];
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i], b = polygon[(i + 1) % polygon.length];
      const insideA = (a[axis] - edge) * direction >= 0;
      const insideB = (b[axis] - edge) * direction >= 0;
      if (insideA) result.push(a);
      if (insideA !== insideB) {
        const t = (edge - a[axis]) / (b[axis] - a[axis]);
        result.push({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t});
      }
    }
    return result;
  }
  const xStrip = (poly, left, right) => halfPlane(halfPlane(poly, 'x', left, 1), 'x', right, -1);
  function cuts(poly, top, bottom) {
    if (poly.length < 3) return null;
    const [min, max] = bounds(poly, 'y');
    return {top: round(Math.max(0, top - min)), bottom: round(Math.max(0, max - bottom))};
  }

  function quad(card, supplied) {
    const rect = card.getBoundingClientRect();
    if (supplied?.length === 8) {
      // CDP may measure a child frame in its parent's coordinates; normalize
      // translation and any axis-aligned iframe zoom to this frame's CSS pixels.
      const p = [0,2,4,6].map(i => ({x:supplied[i], y:supplied[i+1]}));
      const [l,r] = bounds(p, 'x'), [t,b] = bounds(p, 'y');
      if (r > l && b > t) return p.map(({x,y}) => ({
        x: rect.left + (x-l) * rect.width/(r-l), y: rect.top + (y-t) * rect.height/(b-t)
      }));
    }
    const native = card.getBoxQuads?.({box:'border'})?.[0];
    if (native) return [native.p1, native.p2, native.p3, native.p4];
    let linear = new view.DOMMatrixReadOnly();
    for (let el = card; el; el = el.parentElement) {
      const style = view.getComputedStyle(el);
      // Independent translation changes the center, which we obtain from the
      // measured rectangle. Other independent transforms need a native quad.
      if ((style.rotate && style.rotate !== 'none') || (style.scale && style.scale !== 'none')) return null;
      if (style.transform === 'none') continue;
      const m = new view.DOMMatrixReadOnly(style.transform);
      if ([m.m13,m.m14,m.m23,m.m24,m.m31,m.m32,m.m34,m.m43].some(v => Math.abs(v) > 0.00001)) return null;
      linear = m.multiply(linear);
    }
    const style = view.getComputedStyle(card);
    const size = (axis, a, b) => {
      const value = Number.parseFloat(style[axis]);
      if (!Number.isFinite(value)) return axis === 'width' ? card.offsetWidth : card.offsetHeight;
      if (style.boxSizing === 'border-box') return value;
      return value + [a,b].reduce((sum, side) => sum +
        parseFloat(style['padding' + side]) + parseFloat(style['border' + side + 'Width']), 0);
    };
    const w = size('width', 'Left', 'Right')/2, h = size('height', 'Top', 'Bottom')/2;
    const center = {x:(rect.left+rect.right)/2, y:(rect.top+rect.bottom)/2};
    const p = [[-w,-h],[w,-h],[w,h],[-w,h]].map(([x,y]) => ({
      x:center.x + linear.a*x + linear.c*y,
      y:center.y + linear.b*x + linear.d*y
    }));
    const [l,r] = bounds(p,'x'), [t,b] = bounds(p,'y');
    return Math.max(Math.abs(l-rect.left),Math.abs(r-rect.right),Math.abs(t-rect.top),Math.abs(b-rect.bottom)) < 1 ? p : null;
  }

  return Array.from(doc.querySelectorAll('.gc-stage'), (host, i) => {
    const stage = host.querySelector('.gc-carousel-stage,.gc-spatial-canvas,.gc-stack-track,.orbit-stage');
    if (!stage) return {stage:null};
    const rect = stage.getBoundingClientRect();
    const clippingAncestors = [];
    let clipLeft = 0, clipRight = width, clipTop = -Infinity, clipBottom = Infinity;
    for (let el = stage; el && el !== doc.body; el = el.parentElement) {
      const s = view.getComputedStyle(el), clipX = s.overflowX !== 'visible', clipY = s.overflowY !== 'visible';
      if (!clipX && !clipY) continue;
      const b = el.getBoundingClientRect();
      clippingAncestors.push({element:el.className || el.tagName, axes:[s.overflowX,s.overflowY], box:box(b)});
      if (clipX) {clipLeft = Math.max(clipLeft,b.left); clipRight = Math.min(clipRight,b.right);}
      if (clipY) {clipTop = Math.max(clipTop,b.top); clipBottom = Math.min(clipBottom,b.bottom);}
    }
    const controls = host.querySelector('.gc-carousel-controls,.gc-spatial-nav,.orbit-controls');
    const bar = controls?.getBoundingClientRect();
    const overlayControls = bar && bar.top < rect.bottom - 1 && bar.bottom > rect.top + 1;
    const cards = stage.querySelectorAll('.gc-carousel-card,.gc-spatial-card,.gc-stack-slot > .gc-card,.orbit-card');
    const webgl = host.querySelector('.slot-carousel')?.dataset.renderer;
    const rows = [];
    if (webgl !== 'webgl') for (const [j, card] of cards.entries()) {
      const style = view.getComputedStyle(card);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
      const p = quad(card, borderQuads[i]?.[j]);
      const row = {slot:j, item:card.dataset.gcItemIndex ?? card.dataset.spatialSourceIndex ?? j,
        active:card.matches('.is-active,.is-selected,.is-centered')};
      if (!p) {rows.push({...row,geometry:'native quad needed'}); continue;}
      const page = xStrip(p, 0, width);
      if (page.length < 3) continue;
      const inside = xStrip(page, rect.left, rect.right);
      const horizontal = xStrip(page, clipLeft, clipRight);
      const painted = halfPlane(halfPlane(horizontal,'y',clipTop,1),'y',clipBottom,-1);
      const [left,right] = bounds(page,'x');
      const [minY,maxY] = bounds(page,'y');
      const overBar = bar && !overlayControls ? xStrip(inside, bar.left, bar.right) : [];
      rows.push({...row, polygon:p.map(v=>[round(v.x),round(v.y)]),
        pageStripY:[round(minY),round(maxY)],
        stageSideCut:{left:round(Math.max(0,Math.min(right,rect.left)-left)), right:round(Math.max(0,right-Math.max(left,rect.right)))},
        stageCutInPageWidth:cuts(page,rect.top,rect.bottom),
        stageCutInStageWidth:cuts(inside,rect.top,rect.bottom),
        pixelsPastControlTop:overBar.length ? round(Math.max(0,Math.max(...overBar.map(v=>v.y))-bar.top)) : null,
        actualAncestorCut:cuts(horizontal,clipTop,clipBottom),
        screenshotCut:cuts(painted,0,height)});
    }
    return {viewport:[width,height],stage:box(rect),controls:bar ? box(bar) : null,
      overlayControls:!!overlayControls,source:host.closest('.sqs-block-gallery,section.user-items-list-section')?.className,
      clippingAncestors,renderer:webgl ?? 'DOM',cards:rows};
  });
}
inspectGalleryFraming();
