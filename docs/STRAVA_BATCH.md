# GPX batch — local preview, 17 October 2026

Imported 39 of 41 supplied activities, preserving the six published tracks. The atlas now has 45 records in the Tatras, Alps, Gorce and High Atlas. Two ambiguous activity names remain in the private review inventory; no new expedition pages or summit claims were created for them.

Records are sorted by local activity date. Existing expedition links were matched using place, date and the site's previously verified material. Routes without a matching expedition have an independent map/profile in `/trasy?trasa=<id>#profil`; search, saved items and structured data use that destination. Year summaries include all available records in that year, not just records with an expedition page. The existing season pages remain 2025 and 2026.

Toubkal's approach, summit trip and descent are separate recordings. The unsuccessful December 2024 attempt on Lodowy Szczyt is explicitly an attempt, with no summit height or summit marker. Names alone do not add entries to the ascent register. Official heights come only from the existing verified summit catalogue; missing heights are omitted, never replaced by the GPS maximum or an activity's title.

## Processing

Original GPX files, filenames, timestamps and source hashes remain in the private workspace. Published track modules contain only rounded coordinates, elevation, segment and cumulative distance. No GPX upload or Strava credentials are involved.

Distance is computed before display simplification. The existing 8 m horizontal / 4 m elevation retention rule preserves extrema and segment endpoints; nearest verified summit points are retained too. Gaps over 5 minutes stay separate. In this batch, jumps exceeding both 30 metres and 30 m/s (or a nonzero jump at the same timestamp) also split the recording and are excluded from distance. All coordinates on either side remain recorded; no replacement path is inferred. The route introduction flags these records. These are approximate GPS statistics, not a reproduction of Strava's statistics. Existing six published track files are unchanged.

Display points are matched to catalogue summits only when the track comes within 150 m horizontally. This geometric association is not used to infer unknown conditions, route difficulty, exact ascent time or a new achievement. Public route titles/dates and existing trip evidence remain separate from the summit register.

## Verification

Build and route geometry, atlas, catalogue, filters, seasons, saved items, sharing, prerender and release checks. `check-strava-batch.mjs` covers the unsuccessful attempt, Toubkal legs, official heights differing from GPX filenames, new regions and local date crossing. Browser checks and private import reports are in the project state.

Not published. Navigation/loading and the approved heading font remain local alongside this work.
