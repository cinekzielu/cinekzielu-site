# Search metadata and contextual link previews

Prepared locally on 14 October 2026; publication remains a separate user decision.

The existing 42 public pages keep their addresses and canonical sitemap entries. Their metadata already existed in initial HTML. This stage adds a linked author identity and more precise structured data: WebSite uses the brand name Cinek Zielu; O mnie is a ProfilePage; photo galleries/portfolio identify their selected ImageObjects and credit Marcin Zieliński; collection pages list the actual published trips, films, galleries and summit register.

No licence, sales offer, invented date or VideoObject eligibility is claimed. YouTube URLs remain the verified catalogue links. Descriptions and thumbnails use existing approved material. The main films, summits and gallery sections now use different relevant photographs from the existing share image catalogue.

## Contextual sharing contract

`src/data/sharePages.js` defines separate share views, not new trips or photographic collections:

- `/udostepnij/zdjecie/{galleryId}/{photoId}`: the selected existing photograph and the gallery viewer.
- `/udostepnij/kolekcja/{collectionId}`: the selected portfolio theme.
- `/udostepnij/mapa/{atlasId}`: the selected published place or area; optional existing map camera/year/context parameters are retained.

The initial metadata uses the exact selected image. Photo images are existing stripped 2000px WebP web exports, with their actual dimensions checked from the image file. No camera original or new image is uploaded. Existing minimal photographic presentation is preserved.

The photo viewer's existing copy action uses the corresponding static share address. Each active portfolio theme has a small Kopiuj kolekcję action and an always-available manual link field after clicking. The terrain map's Kopiuj widok retains its current camera, background, year and area filters in the shared place URL; unlisted local places fall back to the existing map link. Copy actions preserve the current origin so a local preview never pretends to be the production version. Clipboard denial leaves a selectable field; no false copied confirmation is shown.

`sharePages` exports view descriptors; `resolvePageView(pathname, search)` resolves the existing UI route and query. Path identity takes priority over contradictory query values. `photoSharePath`, `collectionSharePath` and `atlasSharePath` supply validated links; an unknown/removed selection returns null. Portfolio photographs resolve to their source gallery. `sharePageMetadata` is exported separately from `sitePages` for the build generator. Share responses have their own canonical URL and `noindex, follow`; they stay outside the canonical sitemap to avoid indexing duplicate views. They must return real initial HTML, not a client-only redirect, for link preview crawlers.

There are 284 photographic variants, 3 portfolio themes and 84 atlas variants. The atlas list is explicitly scoped to the published PR160 places. The nine paused Romania additions are excluded; the previously published Romania country/trip remain intact. Video stills and documentary phone collections are not relabelled as premium photographic galleries.

## Verification

`scripts/check-sharing.mjs` checks every selected image, full-export dimensions, metadata identity, route mapping, portfolio source resolution, map context preservation, unknown/removed material, exclusion of paused Romania points and truthful structured data. Browser/build/initial-response checks are part of the encompassing SEO implementation. Search indexing, rich results and social-platform cache refreshes remain controlled by those external services; this code cannot guarantee them.
