import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { galleryData } from '../src/data/galleryData.js'
import { expeditionPages } from '../src/data/expeditionPages.js'
import { filterCollections } from '../src/data/collectionFilters.js'
import { atlasAncestry, atlasListNodes, getAtlasMaterials, atlasNodeById } from '../src/data/atlasContent.js'
import { atlasTerrainProfile, readAtlasContext } from '../src/data/atlasTerrain.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { searchSite } from '../src/data/siteSearch.js'
import { getPageMetadata, sitePages } from '../src/data/siteMetadata.js'

// Required by the compatibility catalogue loaded by the application at startup.
assert(galleryData.every(gallery => Array.isArray(gallery.relatedExpeditionIds)))
const unique = new Set()
for (const [id,count,place,date,nodes] of [
  ['katania-2026',40,'wlochy','2026-06-15',['italy','sicily','catania','taormina','etna']],
  ['hungaroring-2026',24,'wegry','2026-07-24',['hungary','hungaroring']],
]) {
  const trip=expeditionPages.find(item=>item.id===id), gallery=trip.gallery
  assert.equal(trip.sortDate,date)
  assert.equal(gallery.photos.length,count)
  assert.equal(gallery.sourceLabel,'SONY')
  assert.equal(new Set(gallery.previewPhotoIndices).size,3)
  assert(gallery.previewPhotoIndices.every(index=>Number.isInteger(index) && gallery.photos[index]))
  assert.notEqual(gallery.mediaKind,'video-frames')
  assert.deepEqual(filterCollections(expeditionPages,{place,year:'2026'}).map(item=>item.id),[id])
  assert.equal(filterCollections(expeditionPages,{place,year:'2025'}).length,0)
  assert(searchSite(trip.title).some(item=>item.id==='expedition:'+id))
  for (const node of nodes) {
    assert.deepEqual(getAtlasMaterials(node,'2026').galleries.map(item=>item.id),[id])
    assert.equal(getAtlasMaterials(node,'2025').galleries.length,0)
    assert.equal(atlasAncestry(node)[0].id,'world')
  }
  for(const prefix of ['galerie','wyprawy']) {
    const path=`/${prefix}/${id}`
    assert(sitePages.some(page=>page.path===path))
    assert.equal(getPageMetadata(path).image.src,`/share/${id}.jpg`)
  }
  for(const photo of gallery.photos) {
    assert(photo.width>0 && photo.height>0 && photo.alt)
    for(const variant of ['full','src','mobileSrc']) {
      const bytes=await readFile(new URL('../public'+photo[variant],import.meta.url))
      assert.equal(bytes.toString('ascii',8,12),'WEBP')
      const hash=createHash('sha256').update(bytes).digest('hex')
      assert(!unique.has(hash),'No duplicate frame or image variant')
      unique.add(hash)
    }
  }
  assert(!/[A-Z]:\\|private\/|\.ARW/i.test(JSON.stringify(gallery)))
}
assert.equal(galleryData.find(item=>item.id==='katania-2026').films.length,0)
assert.equal(filmCatalog.find(item=>item.youtubeId==='eWK-80Idong').expeditionId,'hungaroring-2026')
assert(searchSite('Formuła 1').some(item=>item.id==='film:eWK-80Idong'))
assert.deepEqual(atlasListNodes('italy').map(item=>item.id),['sicily'])
assert.deepEqual(atlasListNodes('sicily').map(item=>item.id),['catania','taormina','etna'])
assert.equal(atlasTerrainProfile('hungaroring').countryId,'hungary')
assert.equal(atlasTerrainProfile('sicily').countryId,null)
assert.equal(readAtlasContext('?atlas=etna&obszar=italy'),'italy')
assert.equal(readAtlasContext('?atlas=hungaroring&obszar=italy'),null)
assert.equal(atlasNodeById.etna.altitude,undefined,'No unsupported summit achievement')
console.log('PASS: two Sony trips, 64 distinct photos/192 WebP variants, correct dates, country filters, four routes and sharing images, 4 sourced atlas pins and one verified film; no invented Catania film or Etna summit claim.')
