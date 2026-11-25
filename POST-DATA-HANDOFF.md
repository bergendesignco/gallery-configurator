# Blog post data for the popup design

Start on the [redesign Summary Carousel page](https://round-disc-bbl6.squarespace.com/summary-carousel). Open the visitor page directly or use its preview frame if working inside the editor. The plugin lives in the page that contains the block. The installed module exposes `window.GalleryStudioRuntime.loadPostData` after it loads.

## Try the first linked post

Run this in the page console. It reads a real link from the Summary Block. In the popup implementation, pass the selected carousel item's `item.postUrl` instead.

```js
const link = document.querySelector('.sqs-block-summary-v2 .summary-title-link');
const post = await window.GalleryStudioRuntime.loadPostData(link.href);
console.log(post);
console.table(post.blocks.map(block => ({
  type: block.type,
  galleryLayout: block.gallery?.layout,
  slides: block.gallery?.slides.length
})));
```

## Fields to design with

| Content | Fields |
| --- | --- |
| Identity and summary | `id`, `url`, `title`, `excerptHtml`, `featuredImageUrl` |
| Post metadata | `categories`, `tags` (arrays), `authorId`, `author` (including displayName, bio and avatar when available), `location` (original address and map fields) |
| Dates | `publishedAt`, `createdAt`, `updatedAt` carry the original Squarespace timestamps, in milliseconds for these blog posts |
| Body | `bodyHtml` is the complete layout markup. `blocks` is an ordered index. Each entry has `id`, `type`, `typeId`, and `html`. Choose either the complete layout or individual blocks to avoid duplicating content. |
| Gallery Blocks | `block.gallery.layout`, `settings`, and ordered `slides`. Each slide has `type`, `imageUrl`, `imageId`, `dimensions`, `focalPoint`, `alt`, `title`, `descriptionHtml`, `href`, `lightbox`, and original `html`. With lightbox enabled the link may point to the full-size image. |
| Search and sharing | `seo.item` is the optional JSON SEO record. `seo.page` has the published title, description, canonicalUrl, and an ordered array of meta entries with name and content. |
| Additional data | `rawItem` contains the original post JSON item, including fields unique to a post or block implementation. |

## Connecting a design

Load on selection. The loader requests the same-site post with `?format=json`, then reads its published HTML head for SEO. A failed JSON request rejects the promise. Missing page SEO yields `seo.page === null`. Use the post URL as a fallback link. Pass `{signal: controller.signal}` as the second argument to cancel an outstanding request when the selection changes. Pass `includeSeo: false` in the same options object when only the post JSON is needed.

Use the actual title, excerpt and metadata independently of their visibility on the carousel card. Omit empty fields. Keep category and tag arrays separate. Use the structured slides for a custom gallery and preserve their order. Post markup is source data: use a suitable renderer for supported blocks, handle HTML as untrusted, and offer the original post link for interactive embeds or unsupported blocks. Squarespace block scripts do not initialize just because the data has been fetched.

## Portfolio popups

Set **Click action** to **Open blog post** for a Summary Block. In **Popup → Desktop layout**, choose **Split panel** (the default) or **Slide-in drawer**. Both choices use the full-screen gallery at viewport widths of 680 px or less.

The popup renders supported text and image blocks, uses the excerpt if the post has no readable blocks, and displays ordered Gallery Block slides. It falls back to the featured image or Summary thumbnail when there are no gallery slides. Categories and tags have their own lists. The project button links to the original post so visitors can open the complete content.

The popup uses the site's Bergen appearance when the page sets `data-bdco-review-theme` on its root. Otherwise it follows the browser color preference.
