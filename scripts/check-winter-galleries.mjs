import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { galleryData } from '../src/data/galleryData.js'
import { expeditionPages } from '../src/data/expeditionPages.js'
import { getAtlasMaterials } from '../src/data/atlasContent.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { searchSite } from '../src/data/siteSearch.js'
import { sitePages } from '../src/data/siteMetadata.js'
const cases=[
['baranie-rogi-zima-2025','baranie-rogi','0AtU5c83Y0M','30 listopada 2025'],
['kiezmarski-szczyt-zima-2025','kiezmarski-szczyt','IxTLYy6bOKo','1 grudnia 2025']]
const hashes=new Set()
for(const [id,node,film,date] of cases){
 const g=galleryData.find(x=>x.id===id)
 assert.equal(g.photos.length,20);assert.equal(g.year,2025)
 assert.equal(g.sourceLabel,'DJI');assert.equal(g.mediaKind,'video-frames')
 assert.equal(expeditionPages.find(x=>x.id===id).date,date)
 assert.equal(g.films[0].id,film)
 assert.equal(filmCatalog.find(x=>x.youtubeId===film).expeditionId,id)
 for(const region of ['world','europe','slovakia','tatry',node]) assert(getAtlasMaterials(region,'2025').galleries.some(x=>x.id===id),region)
 for(const region of ['poland','morocco']) assert(!getAtlasMaterials(region).galleries.some(x=>x.id===id))
 assert(!getAtlasMaterials(node,'2026').galleries.some(x=>x.id===id))
 assert(searchSite(g.title).some(x=>x.id==='expedition:'+id))
 for(const prefix of ['/wyprawy/']){
  const page=sitePages.find(x=>x.path===prefix+id)
  assert(page.description.includes('DJI'));assert(page.image.src.endsWith(id+'.jpg'))
 }
 for(const p of g.photos){
  assert.equal(p.width/p.height,16/9)
  for(const key of ['src','full','mobileSrc']){
   const bytes=await readFile(new URL('../public'+p[key],import.meta.url))
   assert.equal(bytes.toString('ascii',8,12),'WEBP')
   assert(bytes.length>1000 && bytes.length<1500000)
   if(key==='full')hashes.add(createHash('sha256').update(bytes).digest('hex'))
  }
 }
 assert(!/"[A-Z]:|[.]MP4|private[/]/i.test(JSON.stringify(g)))
}
assert.equal(hashes.size,40)
assert(getAtlasMaterials('huncowski-szczyt','2025').galleries.some(x=>x.id===cases[1][0]))
assert.deepEqual(getAtlasMaterials('baranie-rogi','2026').galleries.map(x=>x.id),['baranie-rogi-lodowy-szczyt-2026'])
assert.equal(galleryData.filter(x=>x.mediaKind!=='video-frames').reduce((n,g)=>n+g.photos.length,0),220)
assert.equal(sitePages.length,33)
console.log('PASS: two winter DJI galleries, 40 unique frames, dates, film/region/year associations, existing summer trip preserved, responsive assets and metadata.')
