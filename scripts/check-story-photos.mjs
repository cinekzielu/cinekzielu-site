import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { alpsPhotoStory, baraniePhotoStory } from '../src/data/storyPhotoGroups.js'
import { storyPhotoAssets } from '../src/data/storyPhotoAssets.js'
import { galleryData } from '../src/data/galleryData.js'

assert.equal(Object.keys(storyPhotoAssets).length, 46)
assert.equal(galleryData.find(g=>g.id==='alpy-2026').photos.length,48)
assert.equal(galleryData.find(g=>g.id==='baranie-rogi-lodowy-szczyt-2026').photos.length,14)
const groups = [...Object.values(alpsPhotoStory),...baraniePhotoStory]
assert.equal(Object.keys(alpsPhotoStory).length,12)
assert.deepEqual(baraniePhotoStory.map(g=>g.date),['2026-07-04','2026-07-05'])
for (const group of groups) {
  assert(group.photos.length>0)
  assert.equal(new Set(group.photos.map(p=>p.full)).size,group.photos.length)
  for (const photo of group.photos) {
    assert(photo.alt && photo.width>0 && photo.height>0)
    for (const field of ['src','full','mobileSrc']) assert(existsSync(`public${photo[field]}`),photo[field])
    if(photo.capturedDate) assert(photo.capturedDate>=group.date && photo.capturedDate<=(group.endDate||group.date),`${group.id}: wrong day`)
  }
}
const used = groups.flatMap(g=>g.photos.map(p=>p.full))
for (const photo of Object.values(storyPhotoAssets)) assert.equal(used.filter(full=>full===photo.full).length,1,'Every documentary photo appears in one group')
assert.equal(new Set(Object.values(alpsPhotoStory).flatMap(g=>g.photos.map(p=>p.full))).size,86)
const source=readFileSync('src/data/storyPhotoAssets.js','utf8')
assert(!/[DG]:[\\/]|DateTimeOriginal|latitude|longitude|CIN\d{5}|GZ_\d{5}/i.test(source),'Private source information in public catalog')
console.log('PASS: 46 new documentary photos, 12 Alps groups and two Tatry days, valid assets/dates, no duplicates or private source data; original galleries preserved.')
