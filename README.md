# Gallery Configurator

Preview advanced layouts directly on native Squarespace Simple List Sections and Gallery Blocks. A floating panel controls the layout, size, spacing, motion, navigation and card appearance.

## Try it on a page

Paste these two lines into **Page Settings → Advanced → Page Header Code Injection**, save, and reload the page outside Squarespace Edit mode.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/bergendesignco/gallery-configurator@v0.1.1/dist/gallery-inline.js"></script>
<script type="application/json" data-gallery-configure>{}</script>
```

Your normal list or gallery appears with a **Configure layout** button. Click it to start previewing layouts using the page's actual content. **Reset preview** restores the original layout. Preview changes last until you reload.

## Save a layout

Choose **Copy page code** in the panel. In Page Header Code Injection, replace the `data-gallery-configure` line with that copied configuration and keep the CDN script line. Save and reload. The selected layout now runs automatically for visitors.

Each saved configuration targets one section or block. For multiple galleries on a page, include one configuration per source and one CDN script.

To revise a saved layout, add the configure marker alongside its configuration, make your changes, and replace that source's configuration with fresh page code. Remove the configure marker when finished. The marker enables authoring controls for anyone viewing that page.

## Install across several pages

Alternatively, put the CDN script once in **site-wide Footer Code Injection**. Then individual page headers need only their configure marker or saved layout configuration. You can also put the configure marker in the site-wide footer to enable configuration on all pages with supported sources.

If upgrading from the large inline installer, replace that installer with the CDN script. Use one installer per page. Pages without either Gallery Configurator marker keep their normal content.

The URL is pinned to `v0.1.1`. Update the version in your script URL when you choose to install a newer release.

## Controls

- **Gallery width** defaults to Full page. Follow section or block uses the list's native gutters or the Gallery Block's assigned column. Give full-page Gallery Blocks their own Fluid Engine row.
- **Mobile overrides** independently adjust card width and spacing at viewport widths of 660px and below. Unchecked controls inherit their main value. Spiral spacing is measured as a percentage.
- **Minimum gallery height → Auto** lets the five carousel layouts size themselves to their cards, text, and animation. Spatial layouts and Spiral have their own height controls.
- **Section theme** and **Native list / site type** use the source section's Squarespace colors and typography.
- **Navigation → Auto** uses titles when all items have them and dots when a title is missing. This applies to Arc with tabs and Timed carousel.
- **Copy style / Paste style** transfers layout and appearance settings between sources. The destination supplies its content, links, click action, colors and typography.

## Layouts

Stacking cards, Infinite slider, Arc gallery, Arc with tabs, Stacked showcase, Timed carousel, 3D gallery wall, Spiral carousel, Interactive ring, and Angled gallery.

Simple List layouts reuse the original list nodes and native image loader. Native Squarespace Edit mode restores the source for editing. Spiral loads its pinned Three.js and GSAP dependencies when selected.

## Build

Requires Node.js 20 or newer.

```sh
npm ci
npm run build
npm run verify
```

The release asset is `dist/gallery-inline.js`. CSS is included in the module. `dist/install-cdn.txt` contains the script tag and `dist/configure-page.txt` contains the configure marker.

The local standalone workbench can also be built with `npm run build:standalone` and checked with `npm run verify:standalone` when a local `src/seed.js` demo dataset is available.
