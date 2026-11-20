# Gallery Configurator

Preview advanced layouts directly on native Squarespace Simple List Sections, Gallery Blocks and blog Summary Blocks. A floating panel controls the layout, size, spacing, motion, navigation and card appearance.

## Try it on a page

Paste these two lines into **Page Settings → Advanced → Page Header Code Injection**, save, and reload the page outside Squarespace Edit mode.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/bergendesignco/gallery-configurator@v0.6.0/dist/gallery-inline.js"></script>
<script type="application/json" data-gallery-configure>{}</script>
```

Your normal list or gallery appears with a **Configure layout** button. Click it to start previewing layouts using the page's actual content. **Reset preview** restores the original layout. Preview changes last until you reload.

## Save a layout

While signed in to your Squarespace site, click **Save to page**. The configurator reads the current page header, updates this source's `data-gallery-layout` configuration, and verifies the saved header. Other galleries, schema, GSAP code, and unrelated page settings are retained. The installed CDN script remains required.

Save leaves the configure marker in place so you can continue editing. The Configure button appears inside the Squarespace editor preview frame. Visitors see the saved gallery.

**Copy code** and **View code** remain available for manual installation. **Download header backup** appears after a save attempt has read the original header; download it before closing the panel if you want to keep it. The backup is the header from before that attempt, not a full site backup.

Preview changes are temporary until Save succeeds. After saving, Reset preview returns to the last saved settings. Local previews and pages without a signed-in session use the copy fallback. A page whose private password is omitted by Squarespace's settings response also uses that fallback, to avoid changing its password.

Each saved configuration targets one section or block. Saving a second source keeps the first. If page settings change during a save, no write is sent. Failed or uncertain saves are reported without automatic write retries.

## Install across several pages

Alternatively, put the CDN script once in **site-wide Footer Code Injection**. Then individual page headers need only their configure marker or saved layout configuration. You can also put the configure marker in the site-wide footer to enable configuration on all pages with supported sources.

If upgrading from the large inline installer, replace that installer with the CDN script. Use one installer per page. Pages without either Gallery Configurator marker keep their normal content.

The URL is pinned to `v0.6.0`. Update the version in your script URL when you choose to install a newer release.

## Controls

- **Gallery width** defaults to Full page. Follow section or block uses the list's native gutters or the Gallery Block's assigned column. Give full-page Gallery Blocks their own Fluid Engine row.
- **Mobile overrides** independently adjust card width and spacing at viewport widths of 660px and below. Unchecked controls inherit their main value. Spiral spacing is measured as a percentage.
- **Minimum gallery height → Auto** lets the five carousel layouts size themselves to their cards, text, and animation. Spatial layouts and Spiral have their own height controls.
- **Section theme** and **Native list / site type** use the source section's Squarespace colors and typography.
- **Navigation → Auto** uses titles when all items have them and dots when a title is missing. This applies to Arc with tabs and Timed carousel.
- **Copy style / Paste style** transfers layout and appearance settings between sources. The destination supplies its content, links, click action, colors and typography.

**Appearance** includes corner radius, borders and image fit. DOM layouts also offer shadows and hover effects. Spiral and Interactive ring support solid or mirrored backs. Stage edges can use the layout default, a hard cutoff or an adjustable gradient on moving galleries.

**Control styling** sets the navigation button size, shape, arrow and colors. **Title styling** controls size in rem, weight and color. Leave the layout defaults selected to follow the section theme and native typography.

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


### v0.2.0: block fitting and responsive Spiral

- Fluid Engine Gallery Blocks default to their own width and height. Resize the block in Squarespace to resize the gallery. Navigation and captions are included in the height budget.
- Height sizing → Custom height restores content-driven sizing and the gallery-height control. Classic Gallery Blocks without a Fluid Engine grid remain content-driven.
- Placement choices persist when switching presets. List Sections keep their existing content-driven height.
- Stacking cards is available only for List Sections, using page scroll. It is excluded from Gallery Block choices. Legacy saved block stacking configurations retain their previous page-scroll behavior until reconfigured.
- Spiral limits card curvature, height, and vertical overlap using the actual available stage size. Pixel card width is a preferred maximum, not an unconditional rendered width.
- The settings panel has a persistent scrollbar, keyboard-focusable scroll area, and wheel/touch event isolation from page-level smooth scrolling.

Existing explicit full-page width settings are preserved. Existing Fluid Engine gallery configurations now follow block height by default; choose Custom height to opt out.

### v0.3.0: direct page saving

- Primary Save to page action, secondary copy/view controls, and downloadable pre-save header backup.
- Uses the native GetCollectionSettings / SaveCollectionSettings envelope and the current browser session.
- Updates the selected gallery only; reads the saved header back before reporting success.
- Native Squarespace trims outer header whitespace; verification permits that normalization.

A blog-linked **Summary Block** can also supply cards. Select the blog in the native Summary Block, then use **Configure layout → Interaction → Click action → Open blog post**. The popup loads the post body on demand, including text, links and images. The full-post link is available for interactive blocks and embeds. **Interaction → Show controls** toggles the carousel navigation.
