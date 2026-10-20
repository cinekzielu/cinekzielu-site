import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createWatchStore, parseWatchProgress, trackPlayback, watchProgressKey } from '../src/data/watchProgress.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { resolveFilmLink } from '../src/data/videoPlayer.js'
import { comparisonPicks, comparisonPickHref } from '../src/data/comparisonPicks.js'
import { readRouteAtlas, dayIds } from '../src/data/routeAtlas.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
const id=filmCatalog[0].youtubeId
const memory = new Map()
let changes=0
const storage={ getItem:key=>memory.get(key), setItem:(key,value)=>memory.set(key,value) }
const store=createWatchStore(()=>storage,()=>changes++)
assert.deepEqual(store.read(),[])
for(const raw of ['broken','null','{}','{"version":2,"items":[]}',JSON.stringify({version:1,items:[{id:'unknown',position:12,duration:100,updated:1}]})]) assert.deepEqual(parseWatchProgress(raw),[])
let time=30
const player={getCurrentTime:()=>time,getDuration:()=>300}
const tracker=trackPlayback(id,store)
tracker.capture(player); assert.equal(store.read().length,0,'Opening alone does not save')
tracker.state({data:2,target:player}); assert.equal(store.read().length,0,'Pause without playback does not save')
tracker.state({data:1,target:player}); assert.equal(store.read()[0].position,30)
const unchanged=changes; tracker.capture(player);assert.equal(changes,unchanged,'Paused unchanged time does not write repeatedly')
time=45;tracker.state({data:2,target:player});assert.equal(store.read()[0].position,45)
assert.equal(createWatchStore(()=>storage).read()[0].position,45,'Reload persistence')
assert.equal(resolveFilmLink(filmCatalog[0].youtubeUrl+'&t=45s').start,45)
assert.equal(resolveFilmLink(filmCatalog[0].youtubeUrl+'&t=12s').start,12,'Explicit chapter remains unchanged')
tracker.state({data:0,target:player});tracker.capture(player);assert.equal(store.read().length,0,'End cannot be reinserted by cleanup')
time=20;tracker.state({data:1,target:player});assert.equal(store.read()[0].position,20,'Replay can save again')
time=0;tracker.capture(player);assert.equal(store.read().length,0,'Restart removes former position')
store.save(id,291,300);assert.equal(store.read().length,0,'Near completion removed')
for(const args of [[id,NaN,300],[id,30,0],['unknown',30,300],[id,-10,300],[id,30,Infinity]])store.save(...args)
assert.equal(store.read().length,0)
for(const film of filmCatalog)store.save(film.youtubeId,30,300)
assert.equal(store.read().length,12,'Bounded history')
store.remove(store.read()[0].id);assert.equal(store.read().length,11)
store.clear();assert.equal(store.read().length,0)
for(const provider of [()=>{throw Error('blocked')},()=>({getItem:()=>null,setItem:()=>{throw Error('quota')}})]) {
 const unavailable=createWatchStore(provider);unavailable.save(id,30,300);assert.equal(unavailable.read()[0].position,30);assert.equal(unavailable.isPersistent(),false);unavailable.clear();assert.equal(unavailable.read().length,0)
}
for(const pick of comparisonPicks){
 const url=new URL(comparisonPickHref(pick),'https://example.org')
 const parsed=readRouteAtlas(url.search)
 assert.deepEqual(parsed.compare,pick.compare);assert.deepEqual(parsed.compareDays,pick.compareDays);assert.equal(url.hash,'#porownanie')
 for(const [slot,route] of pick.compare.entries()){
  const track=JSON.parse(await readFile(new URL(route === 'dufourspitze' ? '../src/data/dufourTrack.json' : `../src/data/tracks/${route}.json`, import.meta.url)))
  assert(track.points.length>0)
  if(pick.compareDays[slot]!=='all')assert(dayIds.get(route).includes(pick.compareDays[slot]))
 }
}
const scoped=readRouteAtlas(new URL(comparisonPickHref(comparisonPicks[2],{region:'Tatry',view:'list',year:'2026'}),'https://example.org').search)
assert.equal(scoped.region,'Tatry');assert.equal(scoped.view,'list');assert.equal(scoped.year,'2026');assert.equal(scoped.compare.length,2)
console.log('PASS: progress lifecycle, chapters, reload, ending/replay, malformed data, 12-item bound, deletion, denied/quota storage, all comparison routes/days and filter preservation.')

