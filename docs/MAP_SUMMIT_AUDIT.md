# Terrain provider and summit register audit

Reviewed locally and approved for publication on 19 October 2026. Base: published PR177.

## Terrain map

The reported QR and “for testing purposes only” text were baked into Top-O-Map raster tiles. Replace the shared URL with OpenTopoMap-R served by Openmaps.fr; retain contour lines, shaded relief, natural/dark modes and geographic projection. No overlay is used to conceal attribution or provider branding.

Policy checked: https://openmaps.fr/tile-usage-policy.html

Free, non-commercial use under 500,000 tiles/month; no key required. Best-effort service, no SLA. This personal free site currently fits that scope; revisit terms before a shop, paid access or fundraising is introduced. Normal browser User-Agent, real cross-origin origin Referer and browser caching remain; no offline/prefetch downloader. Visible attribution links OpenStreetMap, OpenTopoMap-R and the required provider-donation link. That link supports the map host, not a new donation feature for Cinek Zielu. Attribution minimum increased to 10px including narrow screens.

## Confirmed additions

Named user-supplied activities were checked against public OSM summit locations locally. Distances to the simplified tracks are 0.9–25.2m (Sławkowski 4.4m). A nearby point alone was not used as proof: the activity name must identify the summit too. No private original tracks or timestamps were sent to geographic services. Heights are independent of GPS elevation.

| Summit | Height | Ascent date | Existing GPX | Height source |
|---|---:|---|---|---|
| Sławkowski Szczyt | 2452 m | 2024-03-03 | slawkowski-2024 | https://www.tatry.sk/tatranska-selma-1/ |
| Staroleśny Szczyt (Bradavica) | 2476 m | 2024-11-01 | bradavica-2024 | https://www.tatry.sk/en/vystup-na-bradavicu/ |
| Baraniec | 2185 m | 2025-02-23 | baraniec-2025 | https://www.visitliptov.sk/en/route/skialp-baranec-from-ziarska-valley/ |
| Grześ | 1653 m | 2024-01-05 | grzes-rakon-2024 | https://tpn.gov.pl/pliki-do-pobrania/otworz/8ec9f3c0-6fa3-44bc-a2ee-3b8f60ed1df8.pdf |
| Rakoń | 1876 m | 2024-01-05 | grzes-rakon-2024 | https://tpn.gov.pl/pliki-do-pobrania/otworz/8ec9f3c0-6fa3-44bc-a2ee-3b8f60ed1df8.pdf |
| Mały Lodowy Szczyt (Široká veža) | 2461 m | 2024-08-25 | czerwona-lawka-2024 | https://tatry.nfo.sk/stitdb.php?mobil=0875 |
| Kasprowy Wierch | 1987 m | 2025-07-19 | swinica-2025 | https://kasprowywierch.pkl.pl/wysokogorskie-obserwatorium-meteorologiczne/ |
| Klingenstock | 1934 m | 2025-07-29 | fronalpstock-2025 | https://www.sac-cas.ch/en/huts-and-tours/sac-route-portal/chlingenstock-384/mountain-hiking/ |

39 distinct summits and 46 described ascent records in total. The previous entries are retained, plus eight summits and three earlier GPX ascents: Gerlach (12 September 2024), Kościelec (4 August 2024), Lodowy Szczyt (22 February 2025). Existing source reports confirm named tracks within 0.1–0.7m of those summits.

The new summit cards link to the actual GPX map and profile. Sławkowski retains its existing geographic atlas link. No speculative atlas nodes or film assignments were created for GPX-only records. Kasprowy is linked to day 1 of the combined Kasprowy–Świnica track. New geographic markers are included in existing route definitions. Polish summit names are searchable as route keywords. Tatry/Alps destination pages and seasonal summaries consume the same registry.

Source differences are intentional: Rakoń 1876m follows the cited TPN map (OSM lists 1879); Klingenstock 1934m follows SAC (some tourist maps use 1935); Baraniec 2185m follows Visit Liptov; Staroleśny 2476m follows Visit Tatry. These are sourced published heights, not claims of a new geodetic survey.

## Uncertainty preserved

Months alone do not establish winter climbing conditions. GPX-only entries with no confirmed seasonal description remain season-unspecified. Kasprowy and Klingenstock retain the documented summer-trip context. The undated winter films of Szatan and Wysoka remain undated; separate February 2025 GPX tracks are not treated as proof of the films' dates or counted as definitely separate ascents. The unsuccessful Lodowy December 2024 attempt is not an ascent. Matterhorn, Etna, passes and unnamed incidental peaks remain outside this register.

## Verification

Build, 42 checks and HTTP 49 local pages passed. Added evidence checks validate route associations, coordinate proximity, correct Kasprowy day, source links, exclusions and preserved unknowns. Browser: desktop 1280px and emulated 390/320px, working raster images, no test watermark, contour relief, natural/dark maps, new summit search/year filter and route link. No observed page console errors. Physical phone and production provider behavior have not been checked for this unpublished package.
