import { PlaneGeometry } from 'three';

// A connected, indexed surface: adjacent faces share vertices and one texture.
// Width is the arc length, just as it is in the retained CSS implementation.
export function createCurvedPanelGeometry(cardWidth, panelArc, segments = 64) {
  const radius = cardWidth / panelArc;
  const geometry = new PlaneGeometry(cardWidth, cardWidth * 9 / 16, segments, 1);
  const positions = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < positions.count; i++) {
    const angle = (uv.getX(i) - .5) * panelArc;
    positions.setX(i, radius * Math.sin(angle));
    positions.setZ(i, radius * (Math.cos(angle) - 1));
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

// CSS uses downward-positive Y; Three.js uses upward-positive Y. All other
// dimensions and the original helix formula stay in CSS pixels.
export function panelPose(offset, { radius, pitch, halfWindow, radiansPerSlide }) {
  const angle = offset * radiansPerSlide;
  const cosine = Math.cos(angle);
  const taper = 1 - offset / halfWindow * .11;
  return {
    x: Math.sin(angle) * radius * taper,
    y: -offset * pitch,
    z: cosine * radius * taper - radius,
    angle, taper, shade: (1 - cosine) / 2 * .58,
  };
}

export function cameraFov(stageHeight, cameraDistance) {
  return 2 * Math.atan(stageHeight / (2 * cameraDistance)) * 180 / Math.PI;
}
