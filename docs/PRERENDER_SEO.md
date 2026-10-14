# Build-time HTML and search preparation

Prepared locally on 14 October 2026. This extends the existing Vite/React site; hosting, visual layout, content selections and dependencies are preserved.

## Initial content

The normal build now renders the same React components into 42 page documents and 371 contextual share documents. `src/App.jsx` owns the shared page router, `entry-server.jsx` renders it at build time, and `main.jsx` hydrates it in the browser. Vite compiles the server entry into ignored `.vite/prerender`; no server code or additional runtime is deployed.

Every normal document contains its actual heading, text, photos and internal links before JavaScript. Interactive maps have an accessible location/material overview until the map loads. Gallery rows remain readable at phone widths without JavaScript. Homepage sections are visible without waiting for scroll observers. Search, filters, image zoom and map controls still require JavaScript.

Initial URL context is serialized as escaped JSON and reused for the first browser render. Query filters synchronize after hydration. Share URLs return their own static metadata and content, then enter the existing gallery, portfolio or atlas view with the appropriate selection. The dev/preview fallback document does not turn unknown URLs into the homepage. Vercel retains its existing clean URLs and custom 404.

## Sharing and structured data

See `SEO_SHARING.md`. Main sitemap remains 42 canonical pages. The separate 284 photograph, 3 theme and 84 atlas share documents are `noindex, follow` and stay outside the sitemap. They are not new trips or galleries. Share actions retain a selectable field if clipboard access fails.

## Search Console

The existing logged-in Google session was used to add the URL-prefix property `https://www.cinekzielu.pl/`. Its ownership verification is pending. The provided HTML verification tag is prepared in `index.html`; it is a public verification marker, not a secret. No DNS, analytics, permission delegation or production changes were made. After an approved publication, complete verification in Search Console and submit `https://www.cinekzielu.pl/sitemap.xml`. Indexing and rich-result display remain Google's decisions.

## Verification and release boundary

- Build and all 25 local data/build checks passed, including the existing paused-Romania test.
- `check-prerender.mjs`: 413 rendered documents, 31 summit rows, 717 file resources, 121 internal targets, metadata, bootstrap, sitemap and 404.
- Local HTTP: all 413 documents and 337 referenced resources return appropriate responses.
- Browser: homepage, summit filters, film library, timeline, Alps/Morocco stories, selected photo, collection share and country share tested; responsive 390/320px and desktop checked. No observed hydration/page errors or horizontal overflow.
- Temporary QA copies without the application script confirmed visible homepage content and 48 gallery photos at 1280/320px, then were removed.
- System clipboard read through the browser tool remained empty; the copy UI and selectable manual fields worked. Do not claim physical clipboard pasting or a physical phone test.
- External messaging-app previews cannot be validated against these localhost URLs; verify representative public URLs after approved publication.

The seven paused Romania-map files are preserved byte-for-byte, not included in this stage's authorized release scope. The 84-place share allowlist excludes the nine unpublished Romanian additions. The ordinary local interactive atlas still contains those preserved local changes; prepare a release from the published baseline plus this stage when publication is authorized.

