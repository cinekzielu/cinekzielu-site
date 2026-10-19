# Tatry and contextual search

Reviewed locally and approved for publication on 19 October 2026. Based on production PR176.

## Tatry

`/kierunki/tatry` gathers existing material: 14 trips, 8 photographic galleries / 120 photographs, 16 films, 21 recorded summits and 28 GPX routes. The page is reachable through the Wyprawy menu, trip index and global search. It follows the Alps destination layout without changing the homepage.

Year (`rok`) and season (`sezon=lato|zima`) apply to every section. Links retain both choices. Trips and films show six initial entries with an expand control. Photography stays separate from video frames and documentary trip photographs; those retain their existing links on individual trip pages.

Season labels come from the existing ascent register linked to the trip. A recording month alone does not establish the season. Twelve routes without that link appear under all seasons. GPX-only year 2024 has eight routes and no invented trip/gallery. Two winter films and ascents with unconfirmed years remain under “Rok nieustalony”; GPX dates are not assigned to those films. Existing summit heights and ascent records are unchanged.

## Search

Trip, gallery, route and film results display available year/season and material counts. Sibling links lead directly to photographic galleries, documentary photos or frames, films and up to two associated routes. Film shortcuts use the existing player and preserve return to search results. Multiple films link to the trip’s film section. Regular links retain new-tab behavior.

Search accepts combined queries such as `Baranie zima 2025`, including Polish diacritics and summer/winter terms. Existing exact-place chapter shortcuts remain unchanged. No publication dates are treated as ascent years.

## Verification

- Production build and all 41 data/render checks passed, including new filter-isolation and search-link checks.
- Local HTTP verified 48 canonical pages plus the private Saved page (49 total), initial metadata, sitemap and existing assets.
- Browser review at 1280, 390 and 320 px: year/season combinations, unknown years, GPX-only year, empty selection/reset, expanded lists, photographs, search film/player return, direct route shortcut and mobile menu.
- No horizontal overflow or observed browser console errors. Mobile checks use viewport emulation, not a physical phone. Player integration and the correct embed were verified; continuous playback was not audited.

Private screenshots and verification summary: `work/private/tatry-search-review`.
