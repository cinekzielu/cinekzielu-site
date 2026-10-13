# Europe map interaction correction

Reviewed on 12 October 2026 and approved for release on 13 October 2026.

The country markers previously used the outer 560×360 scene while the manual country paths used the artwork's 442.38332×248.97292 viewBox. As a result, labels appeared over unrelated countries. Oversized HTML foreign objects also covered otherwise clickable map areas. Hungary had no country path, and the old Tatry ellipse intercepted clicks on the Polish/Slovak border.

Country paths and labels now share the manual SVG coordinate system and identical image framing. The existing country paths remain intact; Hungary has a manually traced hit area between the existing neighbours. These are artwork coordinates, not new geographic coordinates or country boundaries for the terrain maps. Dense Alpine labels have short leaders. Visible label rectangles are the only label hit targets; decorative dots and leaders cannot intercept clicks. Hover-only names for countries without materials do not consume the first click. All 14 country outlines support Enter/Space and a visible focus state. Tatry and Alps remain accessible from the separate region controls.

Narrow maps open at 200% around central Europe so labels remain usable; the existing zoom/reset and scroll controls still apply. Desktop framing, map artwork, country terrain maps and Romania's separate unpublished additions are preserved.

Build and the existing checks passed during review. Private browser evidence covers the home and full atlas, country and label selection, keyboard, zoom and emulated narrow screens. Physical phones are not tested. The release includes this correction and the Moje szczyty section, without the separate Romania map additions or dependency changes.
