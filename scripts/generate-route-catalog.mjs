// Run after updating an existing public track. Original GPX files are not read.
import { readFile, writeFile } from 'node:fs/promises'
const root = new URL('../src/data/', import.meta.url)
const file = new URL('routeCatalog.json', root)
const catalog = JSON.parse(await readFile(file, 'utf8'))
for (const row of catalog) {
  const path = row.id === 'dufourspitze' ? 'dufourTrack.json' : `tracks/${row.id}.json`
  const track = JSON.parse(await readFile(new URL(path, root), 'utf8'))
  row.distance = track.distance
  row.profiles = [...new Set(track.points.map(point => point[3]))].sort((a, b) => a - b).map(segment => {
    const points = track.points.filter(point => point[3] === segment)
    const step = Math.max(1, Math.floor(points.length / 70))
    const selected = points.filter((_, index) => index % step === 0)
    if (selected.at(-1) !== points.at(-1)) selected.push(points.at(-1))
    return selected.map(point => `${(point[4] / track.distance * 200).toFixed(1)},${(48 - (point[2] - track.minElevation) / Math.max(1, track.maxElevation - track.minElevation) * 42).toFixed(1)}`).join(' ')
  })
}
catalog.sort((a, b) => b.sortDate.localeCompare(a.sortDate))
await writeFile(file, JSON.stringify(catalog) + '\n')
console.log(`Updated ${catalog.length} compact profiles from existing public tracks.`)
