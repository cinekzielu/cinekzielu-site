# Route atlas — 16 October 2026

`/trasy` extends the existing six-route catalogue with the shared terrain map and a compact list. Region filters (Alpy/Tatry), selected route and up to two comparison IDs are stored in `pasmo`, `trasa` and `porownaj`. Browser history and reload restore these selections. Filtering does not erase cross-region comparisons. Invalid IDs and duplicates are ignored.

Map markers and list buttons select the same route; its complete recorded geometry is fitted to the available viewport. List hover/keyboard focus highlights its trace without changing the viewport. The map uses the existing Top-O-Map tiles and controls/attribution. Mobile selection scrolls back to the map; reduced-motion preference is respected. Fullscreen still works. No changes to the global atlas, homepage composition or trip route views.

Comparison uses the same actual kilometre and GPS elevation axes for both traces, with gold solid A and muted teal dashed B. It never stretches each route to the same length or joins recording gaps. Official summit heights are displayed independently; noisy GPS maxima are not used as summit heights. Multi-day recordings retain their full distance and dates, with no invented time/difficulty comparison.

Ascent is an approximate derived statistic from the existing public, simplified GPS records. `estimateAscent` uses 10 m vertical hysteresis, counts significant uphill portions, and resets independently at each recording gap. Values are rounded to 10 m and labelled approximate GPS; they are not Strava totals or a safety/difficulty rating. `generate-route-catalog.mjs` refreshes this field with the existing miniature profiles. Original/private GPX files are never read or uploaded.

Full tracks and terrain-map code load only when this page is mounted. The server-rendered list and expedition links remain available before map loading. A failed track import exposes retry; unavailable terrain tiles use the existing map recovery UI. No dependencies added, no new trips, peaks or materials.

Run build, `check-route-catalog.mjs`, `check-route-atlas.mjs` and the existing regression checks. Browser evidence and exact validation results are in the private project state. The user approved publication of this atlas, comparison and selection note on 16 October 2026. The list notes that it represents only part of the recorded mountain walks; no unverified Strava profile link is included.

## Interactive comparison — 16 October 2026

The chart supports pointer selection and a native keyboard/touch range control (10 m steps). Both readouts use the same distance from the start of their own recordings. Values are interpolated within a recorded section only. Beyond the end of a route or inside a recording gap, no elevation or map action is fabricated. GPS elevation remains separate from official summit heights.

Each readout has its own map action. It selects that route, shows a labelled profile point at zoom 13.5, handles cross-region selection, and provides a return link. Hash navigation preserves the cursor. Selecting another route, changing comparisons or browser history clears stale map points.

The share action copies an origin-relative atlas URL with both route IDs, the region/selected route and the chosen kilometre (`km`), targeting `#porownanie`. The current origin keeps local previews local. A selectable read-only URL field is always provided, including when clipboard access fails. No GPX upload or external service is added. The user reviewed and explicitly approved this package for publication on 16 October 2026, following PR165.
