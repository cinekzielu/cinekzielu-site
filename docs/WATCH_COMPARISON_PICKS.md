# Oglądaj dalej i gotowe porównania

Local review package, 20 October 2026. Production baseline: PR179, c1e908a. No deployment in this stage.

## Films

`/filmy` includes Oglądaj dalej, backed by `cz:watch-progress:v1` localStorage. The existing YouTube player saves only after a PLAYING event, every five seconds, on pause, close, pagehide and visibility change. Mere opening, buffering before playback and blocked embeds create no history. Explicit chapter links retain their start time. Resume is an explicit link on a history card; regular film links still start normally.

The latest 12 known films are retained. Positions below ten seconds or within the final min(15 seconds, 3%) are removed, as are ended films. Actual player duration is used for progress; catalog metadata is unchanged. Invalid JSON/versions/unknown IDs/nonfinite values are rejected. Repeated unchanged positions do not write. Deleting one film or all history updates other open tabs. If storage is denied/full, a page-lifetime fallback and accurate notice remain. No account, server write, analytics or synchronization with YouTube history. Existing YouTube requests and restrictions still apply.

## Comparisons

Three real presets use the existing query parser and comparison renderer:
- Baranie Rogi summer 2026 day 1 / winter 2025.
- Baranie Rogi–Lodowy Szczyt, day 1 / day 2 of the same journey.
- Dufourspitze / Ganek–Wysoka–Rysy, complete tracks.

Filters and list/map choice remain intact. Anchors support open-in-new-tab; ordinary clicks select both tracks/days, scroll and move keyboard focus to the comparison. On small screens presets expand under a button so the map stays accessible. The catalog, track data and summit heights are unchanged.

## Validation

Build and eight relevant check scripts passed, including `check-watch-comparison-picks.mjs`. Static HTML includes both sections. HTTP checked 49 local pages. Browser: real Hungaroring playback, save at 0:12, reload, resume at 0:12 (player observed at 0:14), later update to 0:18, deletion and cross-tab removal. All three comparison presets checked; same-route days A=1/B=2, browser Back, keyboard focus, desktop 1280px and emulated 390/320px without horizontal overflow. No page console errors observed.

Across the Alps trailer returned YouTube embedding restriction in this session and correctly created no history. Playback is not possible for videos YouTube blocks from embedding; external viewing cannot be tracked. Completion/replay, invalid records, history bounds and denied/quota storage verified in the lifecycle test harness. Mobile checks are emulation, not a physical device. Private evidence: work/private/watch-comparison-review.
