// Summit locations: OpenStreetMap contributors, ODbL 1.0. Verified 2026-10-04.
// https://www.openstreetmap.org/copyright — source node retained for every point.
// Rysy uses the Polish border summit; Wysoka the southeast summit.
// Ridge traversals are intentionally kept in the content list without invented pins.
export const tatryLocations = [
  ['baranie-rogi', 49.2016399, 20.1971608, 385126469],
  ['durny-szczyt', 49.1975923, 20.2079960, 385101740],
  ['ganek', 49.1742559, 20.1039921, 385095983],
  ['gerlach', 49.1640319, 20.1340595, 26862937],
  ['giewont', 49.2509538, 19.9341016, 1295278143],
  ['jagniecy-szczyt', 49.2196942, 20.2081025, 385127091],
  ['kiezmarski-szczyt', 49.1992348, 20.2194606, 380695970],
  ['konczysta', 49.1573111, 20.1140729, 385118677],
  ['koscielec', 49.2251794, 20.0145834, 355985949],
  ['krywan', 49.1628335, 20.0000452, 260278694],
  ['lodowy-szczyt', 49.1985452, 20.1827652, 380717332],
  ['lomnica', 49.1951431, 20.2130329, 891526548],
  ['mieguszowiecki-szczyt-wielki', 49.1870300, 20.0592982, 615589377],
  ['posrednia-gran', 49.1849785, 20.1943573, 385113132],
  ['rysy', 49.1795756, 20.0881081, 4366169405],
  ['slawkowski-szczyt', 49.1660785, 20.1845921, 380721955],
  ['starorobocianski-wierch', 49.1995255, 19.8198353, 1294543835],
  ['szatan', 49.1631527, 20.0528304, 5131055060],
  ['swinica', 49.2194211, 20.0093063, 3343362920],
  ['wolowiec', 49.2075694, 19.7631281, 2302916813],
  ['wysoka', 49.1726908, 20.0941846, 12655996884],
  ['zabi-kon', 49.1785869, 20.0793064, 3508683869],
  ['lodowa-kopa', 49.1964482, 20.1825885, 6008115144],
  ['szpiglasowy-wierch', 49.1972908, 20.0401058, 452477062],
  ['huncowski-szczyt', 49.1979918, 20.2251697, 380695706],
  ['walentkowy-wierch', 49.2134347, 20.0068154, 385107932],
].map(([id, lat, lng, osmNode]) => ({ id, lat, lng, source: `https://www.openstreetmap.org/node/${osmNode}`, sourceName: 'OpenStreetMap' }))

export const tatryLocationById = Object.fromEntries(tatryLocations.map(point => [point.id, point]))
