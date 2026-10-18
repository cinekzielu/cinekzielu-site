# Route atlas: area and material filters

Package based on PR174; approved for publication after local review.

- “Szukaj w tym obszarze” captures the visible map rectangle only on explicit click. Pan and zoom do not continuously change the list. The captured rectangle is outlined on the map and can be removed separately.
- Matches include any recorded GPX segment intersecting the rectangle, even with neither endpoint inside. Different recording sections are never joined across gaps. Totals refer to complete matching journeys, not clipped distances.
- `obszar=west,south,east,north` stores the selected bounds with five decimal places. Reload/history fit the bounds; the outline identifies the exact filter rectangle. Antimeridian-spanning bounds are unsupported (the existing catalog is Europe/Morocco).
- `rok` filters by the year of the GPS recording, never by film publication date.
- `materialy` accepts `zdjecia`, `film`, `oba`. Availability comes from the linked expedition: documentary photographs count, extracted video frames do not count as photographs; a verified trailer counts as a film. This does not claim exact matching of a photograph to a GPS point.
- Filters combine with distance, ascent and region, apply to map/list/totals and survive URLs/history. Comparison selections, individual days and the comparison cursor are retained. Choosing a new region or a comparison point clears the area to make that destination visible.
- Empty results keep the map usable. List mode with an area loads the recorded geometries before calculating results.

Validation: production build; all 39 data/render checks including segment crossing, gaps, URL validation and material provenance. Browser QA at 1280, 390 and 320 px: explicit search preserves viewport, pan alone preserves results, combined filters and totals, no results, reload/list/history and comparison days. No observed console errors. Mobile checks use emulation, not a physical phone. Evidence is private under `work/private/route-area-filters`.
