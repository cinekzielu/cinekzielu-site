# Combined recordings

Toubkal is one catalog route (`toubkal-2025`), dated 4–5 May 2025, comprising the approach from Imlil, the summit round trip from the refuge and the descent. All 3,476 previously published points retain their coordinates and elevations. Each recording keeps its internal gaps; recording boundaries receive distinct segment IDs. Cumulative distance is offset by the preceding recordings' distance, without adding any connecting distance: 16,950.8 + 9,288.1 + 9,958.7 = 36,197.6 m. The existing verified summit height remains 4,167 m, independent of GPS elevation.

`track.stages` contains contiguous point-index ranges, labels, dates and each recording's distance. Buttons select the exact first point of a stage, even where two points on either side of a gap share the same cumulative distance. Ordinary slider movement returns to distance-based interpolation.

Only the combined route appears in the catalog, search, season totals and Maroko expedition. The source GPX files and copies of all three earlier display tracks remain in private local provenance storage.

`routeAliases.js` resolves former approach/descent IDs in selected-route and comparison URLs; duplicate comparison choices collapse. Saved-item IDs migrate through the same aliases. Old expedition hashes are recognized by the combined route's lazy-loading and scroll handling.

Validation: `check-combined-route.mjs` checks stage ranges, distances, separation, peak height and legacy IDs; existing route, catalog, search, season and saved-item checks cover integration. Private provenance verification additionally compares every point against the three earlier tracks.

The user also authorized combining Kasprowy–Świnica (19–20 July 2025) and Baranie Rogi–Lodowy Szczyt (4–5 July 2026). The canonical IDs remain `swinica-2025` and `baranie-rogi-lato-2026`; former Kasprowy and Lodowy IDs/anchors resolve to them. All 4,036 and 3,525 earlier points are preserved respectively. Combined GPS distances are 39,098.7 m and 36,972.7 m. There are now 41 catalog routes representing the same 45 source recordings, with no duplicate season totals. Two nearby records are not merged automatically without an editorial decision. Dufourspitze and Ganek/Wysoka/Rysy already use combined records and are unchanged.

## Whole journey and individual days

Each of the three newly combined routes has two explicit `track.days` entries with an inclusive point range, date, label and verified `peakIds`. Toubkal's second day includes both the summit loop and descent recording; it is not treated as two days. Metadata `dayIds` validates comparison links without eagerly loading full tracks.

`routeDayView` slices the chosen day, rebases its distance to zero, recalculates its GPS elevation range, and retains the recorded segment boundaries. It filters summit markers to that day's verified peaks. No new height is inferred for Kasprowy. The original full track is never mutated. The route widget remounts its map/profile when switching days, fitting the selected day's bounds and resetting the cursor. The whole-journey summit heading is explicitly labelled as such. Existing stage buttons are retained where a view contains multiple recordings.

Comparison selectors can independently choose a day or the whole journey. Distance, approximate ascent, peak height, profile scale and sampled map point all use that scope. `dzienA`/`dzienB` persist valid day IDs alongside `porownaj`; invalid IDs fall back to the full route. Changing a route resets day choices, changing a day drops a stale shared distance, and history/share links restore the scope. The atlas list itself remains one row per full journey; saving a route saves the journey.

Validation: `check-route-days.mjs` covers all six day views, unchanged source points, zero-based distances, gap boundaries, peak attribution, aliases and sharing. Private verification compares both new merged routes point by point with their earlier display tracks. All 35 repository checks and build pass. Browser review covers all six days, full-route restoration, a cursor at the end before changing days, comparison/share/history, and emulated 390/320px layouts. No production deployment is included.
