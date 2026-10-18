# Route browsing, days and photographs

Local review package following PR171. No new tracks, media, summit claims, dependencies or homepage changes.

## Map and list

`/trasy?widok=lista` uses compact full-width rows. Map remains the default. Sort options are newest, longest, shortest and greatest approximate GPS ascent; `sortuj` persists alongside filters in URL/history/share links. Numeric ties use date and ID. Sorting does not mutate the source catalog or season totals.

Selecting a route name in list view opens its profile below; “Na mapie” switches to the selected map. Showing a comparison point also switches to map view while keeping both comparison scopes. The list does not mount the atlas map and requests only comparison tracks; selecting a full profile uses its existing lazy loader. Empty filters have a reset, and comparison loading errors have a retry.

## Two days of one journey

The comparison accepts the same route twice when valid, distinct scopes are supplied. The three journeys with recorded day metadata have a “Porównaj dni tej wyprawy” shortcut. Selecting that route in both dropdowns defaults to days 1 and 2. Whole journey versus a single day also works. Identical scopes are disabled and duplicate/invalid URL scopes normalize to one route; tracks without day metadata still cannot be duplicated.

`dzienA` and `dzienB` retain slot-specific scopes. React keys use slot identity, and map points use the selected day's rebased track. Shared links and browser Back preserve list/map, sorting, filters, route IDs and days. Original recording gaps and official peak heights are unchanged.

## Photographs beside the atlas

Selecting one of the five Across the Alps routes adds a strip of up to three existing photographs below the atlas map. Dufourspitze has three date-based photo stages; the other four routes have one each. The links open the specific photograph in the existing stage-filtered gallery. This extends the existing larger photo sections below route profiles, without replacing them.

Sources are the already verified `alpsPhotoStages.json` assignments (43 route photographs, five break photographs excluded from route previews). Camera photographs have no GPS and the clock is not calibrated to GPX; these remain day/stage associations, not exact pins or profile timestamps. No additional metadata or private paths are published.

## Validation

`check-route-browsing.mjs` covers sorting, URL roundtrips, same-route distinct scopes, invalid/legacy IDs, real per-day tracks, immutable catalogs and photo deep links. Existing route checks continue to run. Browser review covers desktop and emulated 320/390 px layouts, filtering/empty states, day comparison sharing/history, point-to-map navigation, and photo-stage links/lightbox.
