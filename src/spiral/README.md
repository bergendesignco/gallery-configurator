# Existing Spiral Carousel core

Copied on November 5, 2026 from the existing `working/spiral carousel` project. The original project was not modified. `provenance.json` records the source paths and hashes.

The controller, geometry, playback and ProjectViewer files are preserved byte-for-byte from the original local files and match the historical Sites v69 manifest. The responsive renderer includes the accepted transparent-image-backing shader update. Compared with the November 3 source checkout for the published responsive configurator, its only additional change is an optional `textureSource` callback used for native unsized image URLs.

`../presets/spiral.js` is the new mounting/source adapter. It adapts native item content to the existing viewer and hides fields absent from that content. It does not import the old portable configurator, source watchers, CDN resizing, invented titles, or original-gallery toggle.

The retained core requires Three.js and GSAP with CustomEase. This folder contains no dependency installation or hosting setup.

The existing renderer's CSS fallback is retained. That fallback does not reproduce all responsive WebGL geometry settings. Native source images remain the source of truth.
