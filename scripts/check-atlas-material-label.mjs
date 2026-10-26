import assert from 'node:assert/strict'
import { atlasMaterialLabel } from '../src/data/atlasMaterialLabel.js'
import { atlasContentNodes, getAtlasMaterials, atlasYears } from '../src/data/atlasContent.js'

// Real GPX-only locations must not be advertised as empty in the place picker.
for (const id of ['starolesny-szczyt', 'baraniec', 'grzes', 'rakon', 'maly-lodowy-szczyt', 'slawkowski-szczyt']) {
  const data = getAtlasMaterials(id)
  assert.equal(data.galleries.length + data.films.length, 0, id)
  assert(data.routes.length > 0, id)
  assert.equal(atlasMaterialLabel(data), `${data.routes.length} GPX`, id)
}
let cases = 0
for (const node of atlasContentNodes) for (const year of ['all', ...atlasYears(node.id)]) {
  const data = getAtlasMaterials(node.id, year)
  const label = atlasMaterialLabel(data)
  const empty = data.galleries.length + data.films.length + data.routes.length === 0
  assert.equal(label === 'Brak materiałów', empty, `${node.id}/${year}`)
  if (data.routes.length) assert(label.includes(`${data.routes.length} GPX`))
  cases++
}
for (const [count, expected] of [[1,'film'],[2,'filmy'],[5,'filmów'],[12,'filmów'],[22,'filmy']]) {
  assert.equal(atlasMaterialLabel({ galleries:[], films:Array(count), routes:[] }), `${count} ${expected}`)
}
console.log(`PASS: six real GPX-only summits, ${cases} place/year summaries, true empty states and Polish labels.`)
