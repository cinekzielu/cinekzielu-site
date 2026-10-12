import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { galleryData, photoGalleries } from '../src/data/galleryData.js'
import { expeditionPages } from '../src/data/expeditionPages.js'
import { galleryHref } from '../src/data/galleryNavigation.js'
import { getAtlasMaterials } from '../src/data/atlasContent.js'
import { filterCollections } from '../src/data/collectionFilters.js'
import { searchSite } from '../src/data/siteSearch.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { sitePages } from '../src/data/siteMetadata.js'
import { photoInquiry } from '../src/data/photoInquiry.js'
const d=galleryData.find(x=>x.id==='durny-lomnica-2025'),r=galleryData.find(x=>x.id==='rumunia-2024')
assert.equal(d.photos.length,24);assert.equal(r.photos.length,30)
assert.equal(r.mediaKind,'trip-photos');assert.equal(r.films.length,0)
assert.equal(galleryHref(r),'/wyprawy/rumunia-2024#zdjecia')
assert.equal(galleryHref(d),'/wyprawy/durny-lomnica-2025#kadry')
for(const g of [d,r]) {
 assert(!photoGalleries.includes(g),'Trip material must not enter photography portfolio/galleries')
 assert(!sitePages.some(p=>p.path==='/galerie/'+g.id))
 assert(searchSite(g.title).some(x=>x.id==='expedition:'+g.id))
 assert.equal(new Set(g.photos.map(p=>p.full)).size,g.photos.length)
 for(const p of g.photos) {
  assert.equal(photoInquiry(p),null,'Archive photos and video frames are excluded from photo inquiries')
  for(const key of ['src','full','mobileSrc']) await access(new URL('../public'+p[key],import.meta.url))
 }
}
for(const id of ['WGqn-Kley2w','zb8zqv8gpZk']) assert.equal(filmCatalog.find(x=>x.youtubeId===id).expeditionId,d.id)
for(const id of ['durny-szczyt','lomnica','tatry','slovakia']) assert(getAtlasMaterials(id,'2025').galleries.includes(d))
assert(getAtlasMaterials('romania','2024').galleries.includes(r))
assert(!getAtlasMaterials('romania','2025').galleries.includes(r))
assert.deepEqual(filterCollections(expeditionPages,{place:'rumunia',year:'2024'}).map(x=>x.id),[r.id])
assert.equal(expeditionPages.at(-1).id,r.id)
console.log('PASS: Durny/Łomnica links, Romania archive separation, country/year filters, assets and oldest-first-year boundary.')
