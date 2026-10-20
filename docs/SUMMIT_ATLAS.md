# Complete summit coverage in the main atlas

Local review, 20 October 2026. Base: PR180, 442625f39e96322ce4749e8f62c321bdd8a1810b. Not published.

All 39 registered summits now have reachable geographic pins in the shared homepage/full-page atlas. Seven new atlas nodes reuse the reviewed coordinates from `auditedSummits.json`: Staroleśny Szczyt, Baraniec, Grześ, Rakoń, Mały Lodowy Szczyt, Kasprowy Wierch and Klingenstock. No new ascent claims or source archives were added. The registry remains 39 summits / 46 described ascents.

The existing Turbacz content node now also has a terrain pin, visible in Gorce and Poland. Public OSM/Nominatim returned natural=peak node [26864983](https://www.openstreetmap.org/node/26864983), 49.5428239 N, 20.1113839 E. Its height remains the registry's sourced 1310 m, independent of GPS and tile labels. All coordinates retain source attribution. Existing Tatra locations are unchanged; border peaks Grześ, Rakoń and Kasprowy are visible from both countries. Klingenstock appears in Switzerland and the Alps.

Summit-to-trip and film associations consume the explicit ascent register, preserving existing place chapters. The Across the Alps trailer is not relabelled as a separate summit episode. GPS links reuse the existing summit/route associations, dates and canonical combined recordings. No geometric nearest-route guessing is used. GPX-only peaks show their route instead of an empty media message. They participate in the material filter and year selector. Unknown winter film years remain unknown even when separate dated GPX recordings exist.

Route sections link to the existing route map/profile and summit entry. Region views with only GPS material offer three routes and an expansion control. Film, gallery and expedition links remain available where confirmed; no fictitious trip pages were added. Seven map share destinations and no-JavaScript route links are included. Old paused Romania work is untouched.

## Validation

- Build and all 44 `check-*.mjs` scripts passed. `check-summit-atlas.mjs` verifies all 39 pins, source associations, GPX-only year visibility, country/area membership, no invented film/trip links, and preserved unknowns.
- HTTP: 49 canonical/utility pages, seven new map share pages, 336 referenced resources passed on local port 8776.
- Browser: 1280, 390 and 320 px; Baraniec route navigation and Back; year 2024 and Grześ selection; long Mały Lodowy heading; Klingenstock's route/trip/gallery and correct film dialog; homepage Fronalpstock marker selection; Turbacz pin; expansion of six 2024 routes. No observed console errors or horizontal overflow in mobile checks.
- Limits: phone widths are emulated, not a physical phone; correct video dialog verified, continuous playback not audited. No publishing, push or commit performed. Remote fetch was unavailable in this session; the starting local main and origin/main both matched the last verified PR180 release.

Preview: `/mapa?atlas=tatry`, `/mapa?atlas=baraniec`, `/?atlas=klingenstock#map`.


## Małołączniak and Giewont — 20 October follow-up

The owner identified the previously ambiguous “Marcin sam w górach” recording.
Added `malolaczniak-giewont-2024` (26 October 2024): 22.3868 km, 2329 simplified points.
Both summit locations match the original recording within 2.8 m / 0.6 m.
Małołączniak uses OSM node 496805360; Giewont reuses node 1295278143.
Heights 2096 m / 1894 m follow the TPN map:
https://tpn.gov.pl/pliki-do-pobrania/otworz/9f0999e0-663c-49fc-bcfc-f68011e7c92d.pdf

The shared summit register now has 41 summits / 48 ascents; atlas 93 nodes; routes 42.
Małołączniak belongs to both border-country views. Giewont remains Poland-only.
Original activity name is searchable. No film, gallery, season or expedition was invented.
The private GPX retains timestamps; the public derived track does not.
The earlier batch exclusion for this activity is superseded by the owner's identification.

Build and 45 check scripts passed (updated count expectations and confirmed Giewont ascent).
Local HTTP: 57 documents and 336 referenced assets. Browser checks at 1280/390/320 px:
route map/profile, both summit buttons, atlas year filter and route navigation; no observed
console errors or horizontal overflow. Mobile is emulated. Unpublished, alongside the
existing summit atlas package.

## Approved release extension

The owner additionally confirmed Ciemniak and Kopa Kondracka on the same recording
and authorized publication of this package. Both OSM summits match the original
GPX within 3.9 m and 0.4 m respectively (display track 3.9 m / 5.5 m).
Sources: OSM nodes 496805357 and 3560695684; heights 2096 m / 2005 m from
the same TPN map cited above. The route retains its existing URL and distance.
Its title now lists all four owner-confirmed summits; both added summits are border
points. No additional peaks inferred just from passing nearby.

Final package: 43 summits, 50 ascents, 42 routes, 95 atlas nodes and 382 share views.
Build and 45 check scripts passed. Prior local summit atlas changes are included;
paused Romania changes remain outside this checkout and release.
