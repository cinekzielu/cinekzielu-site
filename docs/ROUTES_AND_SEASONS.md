# Trasy and Baranie Rogi seasons

Local review stage, 14 October 2026. The user selected the compact list concept and authorized implementation. This stage is separate from published SEO PR162.

`/trasy` lists the six existing GPX routes, newest first, with an Alpy/Tatry filter stored in the URL and synchronized with browser history. Each row links directly to the existing expedition route section. Official summit heights come from `tripRoutes`; GPS distance is explicitly labelled and comes from the published track. No difficulty ratings, estimates or new hiking statistics are inferred.

`routeCatalog.json` is a small derived catalogue, containing dates, regions, expedition IDs, GPS distance and normalized SVG elevation polylines. It contains no coordinates, original track timestamps or private source paths. Profiles preserve separate recording segments; each uses its own vertical and horizontal scale. Full tracks remain lazy-loaded only in route views. If a source track changes, regenerate its profile and run `check-route-catalog.mjs`.

The catalogue is linked from Wyprawy, Moje szczyty, route sections and collection footers. Global search includes six route entries and a Trasy filter. Homepage composition is unchanged.

Both Baranie Rogi expedition pages contain `#dwa-sezony`: summer July 2026 and winter 30 November 2025. The existing two-day summer photography collection is explicitly described as including Baranie Rogi and the next day's Lodowy Szczyt. Winter material remains labelled DJI video stills, linking to the expedition's `#kadry` section. Both original film links are retained. The views do not claim matching camera positions or identical routes. A link from the Baranie Rogi summit row leads to this section.

No new original materials, expeditions, map points, dependencies or files from the paused Romania stage were changed. Build and `check-route-catalog.mjs` cover actual route targets, catalogue data, search, structured data and the photography/video boundary. Responsive and interaction checks are recorded in the private project state.

The video player now resolves canonical expedition material links and labels: photography galleries, video stills and documentary photos each lead to their actual collection. Unknown expeditions do not produce invented gallery URLs. Regenerate catalogue mini profiles with `scripts/generate-route-catalog.mjs`.

Validation completed: isolated build, 27 checks, 414 HTML routes and 337 assets; desktop and emulated 320/390px, filters/history/search, route anchors and both season film players. No physical phone test. Local stage remains unpublished.
