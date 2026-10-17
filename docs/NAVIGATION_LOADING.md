# Navigation and homepage loading

Local review package, 17 October 2026. Not published.

## Shared navigation

The existing short header now groups related views:

- Wyprawy: all trips, travel timeline, seasons.
- Mapa: atlas of places, route atlas with comparisons.

The same header is rendered on the homepage and collection/detail pages. Native
details/summary disclosures work by click, touch and keyboard; only one group
stays open. Escape closes the current group and restores focus to its summary;
another Escape closes the phone menu. Outside clicks and leaving a group by Tab
close its disclosure. Search closes navigation before opening its dialog.
The active destination is indicated with aria-current, including the timeline
query and seasons/route pages. All submenu destinations are real prerendered links.

## Homepage map

HomeAtlas preserves the crawlable AtlasOverview until its container is within
120 px of the viewport. The MapAtlas module, map styles, terrain dependency and
world background then load. The dedicated /mapa page still loads immediately.

Explicit atlas URLs and anchors at/below the map start loading immediately;
the anchor is aligned after the interactive map mounts. A passive scroll check
also handles jumping past the whole placeholder or returning below it with Back.
Fallback links remain usable, a manual loading button is available, and a map
loading error leaves a readable atlas overview and link to the full atlas.
No map geometry, data, photographs or homepage section order changed.

## Verification

- Build: 46 public pages, 372 contextual share views, plus the saved-items page.
- Passed checks: release, prerender, site-tools, saved-items, atlas-view-state,
  route-atlas and routes-seasons-photos. Prerender rechecked after the final
  fast-scroll adjustment.
- Local HTTP: 47 pages on the current bundle, new links in every header,
  19 homepage resource references and 46 sitemap entries.
- Browser: 1440, 1024, 920, 390 and 320 px. No horizontal overflow observed.
  Checked disclosures, Tab/Enter/Escape, outside click, search, timeline,
  seasons, both atlases, deferred map scrolling, fast scrolling, direct Europe
  and film anchors, and Back from the film library. No page console errors observed.

## Startup resource measurement

Three baseline and three final runs at 390 × 844, no scrolling, through the same
local no-cache gzip proxy. Browser Resource Timing sampled 1.8 seconds after load.
Median compressed subresource payload: **730,258 → 303,078 bytes (58.5% less)**.
The map module/styles and world image were absent from the initial final samples.
This is transferred resource content, excluding document HTML and HTTP overhead.

Median local LCP was 64 ms both before and after; this very fast localhost result
does not establish a loading-time improvement on real mobile networks. The
measured improvement is reduced initial downloads and deferred map code. Map
resources are still downloaded once the visitor reaches the map. Phone sizes
were emulated; no physical-phone or throttled-network test was performed.
