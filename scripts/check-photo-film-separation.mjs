import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { photoGalleries, videoFrameCollections } from '../src/data/galleryData.js'
import { galleryHref } from '../src/data/galleryNavigation.js'
import { expeditionPages, sortExpeditionsNewest } from '../src/data/expeditionPages.js'
import { sitePages, legacyRedirects, getPageMetadata } from '../src/data/siteMetadata.js'
import { siteSearchIndex, searchSite } from '../src/data/siteSearch.js'
import { filterCollections } from '../src/data/collectionFilters.js'
assert.equal(photoGalleries.length,11)
assert.equal(photoGalleries.reduce((n,x)=>n+x.photos.length,0),220)
assert.equal(videoFrameCollections.reduce((n,x)=>n+x.photos.length,0),102)
assert.equal(siteSearchIndex.filter(x=>x.kind==='gallery').length,11)
for(const frames of videoFrameCollections){
 const old='/galerie/'+frames.id,target='/wyprawy/'+frames.id
 assert.equal(galleryHref(frames),target+'#kadry')
 assert.equal(legacyRedirects[old],target+'#kadry')
 assert(!sitePages.some(x=>x.path===old))
 assert.equal(getPageMetadata(old).path,target)
 assert(!siteSearchIndex.some(x=>x.id==='gallery:'+frames.id))
 assert(searchSite(frames.title).some(x=>x.id==='expedition:'+frames.id))
 const html=await readFile(new URL('../dist'+old+'.html',import.meta.url),'utf8')
 assert(html.includes('content="0;url='+target+'#kadry"'))
}
assert.deepEqual(expeditionPages.slice(0,3).map(x=>x.id),['zabi-kon-2026','alpy-2026','baranie-rogi-lodowy-szczyt-2026'])
assert.deepEqual(filterCollections(expeditionPages,{place:'wszystkie',year:'2025'}).map(x=>x.id),['kiezmarski-szczyt-zima-2025','baranie-rogi-zima-2025','krywan-2025','szpiglasowy-wierch-2025','szwajcaria-2025','swinica-2025','maroko-2025','gerlach-zima-2025'])
const input=[{year:2025,sortDate:'2025-09',id:1},{year:2026,sortDate:'2026-01-10',id:2},{year:2025,sortDate:'2025-09-21',id:3}]
assert.deepEqual(sortExpeditionsNewest(input).map(x=>x.id),[2,3,1])
assert.deepEqual(input.map(x=>x.id),[1,2,3])
console.log('PASS: photo-only galleries/search/sitemap, four frame deep links and legacy redirects, newest-first homepage/list/filter order without input mutation.')
