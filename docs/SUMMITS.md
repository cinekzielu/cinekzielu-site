# Moje szczyty

Reviewed on 12 October 2026 and approved for release on 13 October 2026. `/szczyty` lists 31 distinct summits and 35 ascent records using existing trip pages, films and atlas identifiers. No new trip, gallery, archive browsing or map geometry is part of this section.

## Interface

- One row per summit, height in whole metres, range, separate dated ascent rows, summer/winter labels.
- Search ignores Polish accents; filters by range, ascent year and summer/winter; sort by height or latest trip date. Counts refer to distinct matching summits.
- Year and season must match the **same ascent**. For example Wysoka's undated winter film never appears as a summer 2026 film. Baranie Rogi's 2025 winter footage stays separate from summer 2026 photography.
- Photographs, documentary photographs and video frames retain their existing labels and destinations. Missing material links are omitted. Existing `FilmLink` opens the existing player; a trailer remains labelled as a trailer.
- URL filters, reload and browser Back work. Shared subpage navigation, the trip index and a small link below the home map expose the section without rearranging the homepage.

## Evidence and limits

The explicit register is `src/data/summits.js`. It intentionally does not infer ascent from every atlas point. Etna's slopes, Zermatt's view of Matterhorn, Saxer Lücke, ridge names, and older atlas-only flags without reviewed ascent material are not counted.

- Trip years and date ranges come from `expeditionPages.js`, previously checked against the author's material. A weekend is not arbitrarily split into precise summit days. July's Baranie Rogi then Lodowa Kopa/Lodowy sequence comes from the author's account. The five Across the Alps summits and their sequence come from `alpsStory.js` and the author's post-trip account; only August 2026 is known.
- The Swiss 2025 summits use their individual verified films and the same year's gallery. Morocco uses the existing Toubkal film and summit chapter. Their trip-start ordering keys do not prove summit days: these entries retain **year precision only**. Toubkal's season is unclassified rather than guessed from snow or calendar date.
- Szatan's and Wysoka's winter films do not have verified ascent years: `year`/`orderDate` are null, visibly “Rok nieustalony”. They are available under that filter. Publication dates are never used for ascent dates.
- Latest sorting uses known trip periods. A month-only entry closes that month, a year-only entry closes that year; fully undated entries are last. The convention is explained alongside the sorting results. Multiple peaks of one trip use confirmed sequence only where known, otherwise height breaks ties. This does not assert an unknown day or route order.
- Rysy uses 2499 m for the existing border-summit atlas pin; the row explicitly names that elevation reference, without asserting which other Rysy top was visited.

## Heights

Each summit has a public `altitudeSource`, available in the collapsed source list on the page. Sources describe geography, not evidence of the author's ascent.

- Tatra coordinates reuse the existing OSM node identities in `tatryAtlas.js`; heights were read from the [OSM API](https://api.openstreetmap.org/api/0.6/nodes.json?nodes=385126469,385101740,385095983,26862937,1295278143,385127091,380695970,385118677,355985949,260278694,380717332,891526548,615589377,385113132,4366169405,380721955,1294543835,5131055060,3343362920,2302916813,12655996884,3508683869,6008115144,452477062,380695706,385107932) on 12 October 2026. The response is saved privately. © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright).
- Gerlach (2654 m) and Wysoka (2560 m) use the [official regional map](https://www.tatry.sk/wp-content/uploads/2026/02/mapa-zima-2025-26.pdf); Łomnica (2634 m) and Lodowy (2627 m) use [TANAP's magazine](https://www.tanap.sk/wp-content/uploads/TATRY_2022-6.pdf). These deliberately avoid differing whole-metre OSM values. Szpiglasowy's OSM 2172.1 m is rounded to 2172 m.
- Swiss peaks: [Fronalpstock, Swiss Tourism](https://www.myswitzerland.com/de-ch/erlebnisse/fronalpstock-panorama-aussicht/), [Augstmatthorn, SAC](https://www.sac-cas.ch/en/huts-and-tours/sac-route-portal/augstmatthorn-106/mountain-hiking/), [Bettmerhorn, SAC](https://www.sac-cas.ch/de/huetten-und-touren/sac-tourenportal/bettmerhorn-166/berg-und-alpinwandern/). Geographic source values take precedence over numbers in video titles.
- [Turbacz, Gorce National Park](https://gpn.gov.pl/pliki-do-pobrania/otworz/fd75999c-f10f-4b57-b36c-9f300ff6bd14.pdf); Alps and Toubkal reuse existing verified height fields and source links.

## Checks

Production build generates 42 pages. The release contains 22 `check-*.mjs` scripts, including a new check for same-ascent filtering, summer/winter film isolation, duplicate prevention, source coverage, valid material links, date precision, unknown years and URL round trips. The three existing page-count checks are updated for the new route. The separate, paused Romania map check is excluded from this release.

Local HTTP page/metadata verification passes. Browser checks at 1440, 1024, 920, 390 and 320 px cover filters, empty state, Polish search, height/latest sort, reload, Back after filters and trips, player open/close, material links, mobile menu and horizontal overflow. Desktop and narrow screenshots were inspected. This is emulation, not a physical-phone test. Player integration is tested; video playback reliability was not reverified for every third-party film.

Review evidence: `work/private/summits-review`. Release evidence: `work/private/release-summits-europe`. This section and the accepted Europe interaction correction are approved for publication. The paused Romania map additions are preserved locally and excluded from the release.
