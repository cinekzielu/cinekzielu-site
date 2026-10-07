import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { galleryData } from '../src/data/galleryData.js'
import { galleryItemCount, galleryCollectionCount } from '../src/data/galleryNavigation.js'
import { getAtlasMaterials, atlasYears } from '../src/data/atlasContent.js'
import { filterCollections } from '../src/data/collectionFilters.js'
import { searchSite } from '../src/data/siteSearch.js'
import { sitePages, legacyRedirects } from '../src/data/siteMetadata.js'
import { expeditionPages } from '../src/data/expeditionPages.js'
const gallery=galleryData.find(item=>item.id==='gerlach-zima-2025')
assert.equal(gallery.sourceLabel,'GoPro')
assert.equal(gallery.mediaKind,'video-frames')
assert.equal(gallery.photos.length,22)
assert.equal(galleryItemCount(gallery),'22 kadry')
assert.equal(galleryCollectionCount(galleryData),'220 zdjęć · 102 kadry')
assert.deepEqual(gallery.films,[], 'No unverified film association')
assert(gallery.photos.some(photo=>photo.src===gallery.coverImage))
assert.equal(expeditionPages.find(trip=>trip.id===gallery.id).date,'25 stycznia 2025')
for(const id of ['gerlach','tatry','slovakia','europe','world']) assert(getAtlasMaterials(id,'2025').galleries.some(item=>item.id===gallery.id),id)
assert(!getAtlasMaterials('poland').galleries.some(item=>item.id===gallery.id),'Gerlach is not in Poland')
assert(!getAtlasMaterials('morocco').galleries.some(item=>item.id===gallery.id))
assert.equal(getAtlasMaterials('gerlach','2026').photoCount,0)
assert.deepEqual(atlasYears('gerlach'),['2025'])
assert(filterCollections(galleryData,{place:'tatry',year:'2025'}).some(item=>item.id===gallery.id))
assert(searchSite('GoPro').some(item=>item.id==='expedition:'+gallery.id))
assert.equal(legacyRedirects['/wyprawy/gerlach-winter'],'/wyprawy/gerlach-zima-2025')
for(const prefix of ['/wyprawy/']) {
  const page=sitePages.find(item=>item.path===prefix+gallery.id)
  assert(page.description.includes('GoPro') && !page.description.includes('DJI'))
  assert(page.image.src.endsWith('gerlach-zima-2025.jpg'))
}
const hashes=new Set()
for(const photo of gallery.photos) {
  assert.equal(photo.width / photo.height,16/9)
  for(const key of ['src','full','mobileSrc']) {
    const bytes=await readFile(new URL('../public'+photo[key],import.meta.url))
    assert.equal(bytes.toString('ascii',8,12),'WEBP')
    assert(bytes.length>1000 && bytes.length<1500000)
    if(key==='full') hashes.add(createHash('sha256').update(bytes).digest('hex'))
  }
}
assert.equal(hashes.size,22)
assert(!/"[A-Z]:|GX[0-9]|[.]MP4|native|private[/]/i.test(JSON.stringify(gallery)))
console.log('PASS: Gerlach 22 distinct GoPro frames, country/year membership, no invented film, legacy route, source-specific metadata and responsive files.')
