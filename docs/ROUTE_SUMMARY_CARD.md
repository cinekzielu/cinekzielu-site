# Route summary and card prototype

Local review package. No new recordings and no deployment.

The route catalogue shows count, total recorded distance and approximate ascent
for its current region/distance/ascent filters. Sorting, selected map route and
comparison days do not change these totals. `summarizeRoutes` canonicalizes old
day links and counts each complete journey once. This is a summary of supplied
recordings, not a claim about all lifetime walking statistics. Empty results show
zero and use the existing filter reset.

`#karta-trasy` opens a card preview, with a selector covering the 41 catalogue
routes. The selected map/list route supplies its default. The card always covers
the whole recording, including combined journeys, and uses the existing title,
dates, catalogue distance/ascent and official highest summit (when known).

The preview and download are the same 1080 × 1350 canvas. It uses the local heading
font, north-up Web Mercator route geometry at a uniform scale, a start marker and
GPS elevation profile. Recording gaps remain separate. The grid is explicitly a
schematic, not a terrain map. No external tiles, new library or third-party export
service is used. The profile retains measured elevations and is labeled GPS;
these do not overwrite official summit altitude. Unknown summits show an em dash.
Track loading and rendering happen only when the card is opened. Stale requests
are ignored; exports are disabled while loading, and object URLs are released.

Validation: build and 38 check scripts pass, including deduplication and geometry
bounds/gaps for all 41 routes. Browser checks cover filtered/empty summaries and
Back, long Polish titles, desktop and emulated 390/320 px without horizontal
overflow. A Dufourspitze PNG was downloaded via the visible button and inspected
at its original 1080 × 1350 size. Physical phone and native share sheet not tested.

Review: `/trasy?widok=lista&trasa=dufourspitze#karta-trasy` and
`/trasy?widok=lista&pasmo=Tatry`. Production remains unchanged.
