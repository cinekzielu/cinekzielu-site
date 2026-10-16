# Zapisane

Browser-local bookmarks. No account, backend, synchronization service or new material.

- `/zapisane` groups saved trips, routes and premium photographs, newest save first within each group. Type filters, removal and undo are available.
- The shared header has a bookmark link with the current count. Existing navigation links and homepage section order are preserved.
- Trips can be saved from the list, timeline and detail. Routes from the route atlas list. Photographs from the grid and full-screen viewer.
- Photograph identity uses its stable full-size asset, so portfolio and source gallery share one bookmark. Saved photographs open the source gallery with the selected photograph. Video frames and phone travel-documentation collections are excluded.
- Select exactly two saved routes to open the existing interactive comparison. A third choice is disabled; removing a saved route also removes it from the selection.

## Browser storage

`cz.saved.v1` contains only `{version: 1, items: [...]}` with known content IDs. Titles, URLs and image data are resolved from the current catalog. Unknown IDs, duplicates, malformed values and unsupported versions are ignored. Nothing is sent to a service.

The list is specific to this browser and origin. Localhost selections do not transfer to production. Clearing site data clears the list. Other open tabs update through the storage event; writes read the latest stored list first. If storage access or writing fails, the current page retains an in-memory list and displays a notice that it will not survive leaving the page.

`/zapisane` is prerendered as a generic empty shell with `noindex, follow`, excluded from the sitemap and structured data. No visitor selection is included in generated HTML or sharing metadata.

## Validation

- Build and 30 repository checks passed, including `check-saved-items.mjs`: stable identities, corrupted browser records, removed/unknown IDs, comparison rules, video separation, noindex and sitemap exclusion.
- Browser checks: empty state, save from trip/list/photo viewer, persistence after reload/navigation, two-tab synchronization, remove/undo, filters, source-photo deep link and two-route comparison.
- Responsive views checked at 1440, 920, 390 and 320 px. At narrow widths the photo-viewer bookmark becomes an icon, retaining its accessible label and pressed state.
- Phone views are emulated, not a physical device. Storage-denial notice is implemented; browser storage denial itself was not simulated.

Page: `/zapisane`. Local preview selections do not transfer to the production domain.
