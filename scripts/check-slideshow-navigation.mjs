import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {slideshowChapters} from '../src/data/slideshowNavigation.js'
import {alpsStoryGallery} from '../src/data/alpsStory.js'
const stages=JSON.parse(await readFile(new URL('../src/data/alpsPhotoStages.json',import.meta.url),'utf8'))
const chapters=stages.map(s=>({...s,photos:s.photos.map(n=>alpsStoryGallery.photos[n-1].full)}))
const all=slideshowChapters(alpsStoryGallery.photos,chapters)
assert.equal(all.length,9)
assert.equal(new Set(all.flatMap(s=>s.indices)).size,48)
for(const chapter of all)for(const i of chapter.indices)assert(chapter.photos.includes(alpsStoryGallery.photos[i].full))
const triglav=chapters.find(s=>s.id==='triglav')
const filtered=triglav.photos.map(full=>alpsStoryGallery.photos.find(p=>p.full===full))
const filteredNavigation=slideshowChapters(filtered,chapters)
assert.equal(filteredNavigation.length,1)
assert.deepEqual(filteredNavigation[0].indices,[0,1,2,3,4,5])
assert.deepEqual(slideshowChapters([],chapters),[])
assert.deepEqual(slideshowChapters(filtered),[])
const reordered=[filtered[4],filtered[0]]
assert.deepEqual(slideshowChapters(reordered,chapters)[0].indices,[0,1])
console.log('PASS: all 48 Alps photos covered, filtered and reordered shows use local indices, absent chapters omitted')
