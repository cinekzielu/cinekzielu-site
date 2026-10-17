# Route filters, seasons and Alps photo stages

Package approved for publication by the user on 17 October 2026, after local review and removal of route playback. Uses the six existing GPX tracks, existing trips and photographs; no new dependency or source material.

## Route browsing

The user requested removal of automatic route playback after reviewing the local version. The timer, speed controls and playback buttons have been removed. Manual profile scrubbing, keyboard point selection, summit shortcuts and the synchronized map point remain. Interpolation stays within recorded segments; recording gaps are not bridged.

The route atlas offers distance and estimated GPS ascent filters alongside the region selector. The map and list use the same filtered set. Filters are preserved in the `dystans` and `podejscia` URL parameters, browser history and comparison share links. Existing two-route comparisons stay selected outside the filtered list, with an explanatory note. Selecting a comparison point outside the filters clears the filters to reveal that route. Empty results offer a reset. No route difficulty or walking duration is inferred from distance or ascent.

## Seasons

`/sezony`, `/sezony/2025`, `/sezony/2026` are accessible from the expedition overview and global search. Counts derive from existing catalogs: trips, distinct summits, separate dated ascents and photographs in camera galleries. Unknown ascent years are excluded. Film grouping uses trip year, never publication year. Only available GPX records contribute to distance/ascent; multi-day tracks count once. The 2025 page states that no tracks are yet available instead of implying no walking took place. No homepage/header restructuring.

## Photo stages

The 48 selected Sony photographs have been matched to nine days/stages using original DateTimeOriginal metadata and the established trip chronology. 43 belong to climbing stages; five to breaks. Dufourspitze has 11 approach-day, 11 summit-day and six return-day photographs. Groups retain chronological order within a day. Every gallery photograph appears in exactly one group.

Original exports were read-only. All 48 dates match the prior private selection register. No GPS tags were found. The camera reports +01:00; its clock has not been calibrated against the GPX. Therefore this stage assigns photographs to a day/stage only, not a precise time, distance or coordinate. Original filenames, paths, times and private metadata remain outside the repository. Public data contains only stage/date labels and existing photograph indices.

The Alps gallery offers stage filters in `etap`, browser history and existing photograph deep links; incompatible photo/stage links show the full collection so the requested photograph is not lost. Route sections offer a three-photo preview, full expansion and Dufour day selection. Photographs are grouped by day/stage, not by a precise point on the track. Existing saved-photo identities, fullscreen viewer and sharing remain in use. The story's existing illustrative selection is retained.

Validation: build, repository checks including `check-routes-seasons-photos.mjs` and `check-route-filters.mjs`, and desktop/mobile browser review. Detailed evidence and limitations are stored privately.
