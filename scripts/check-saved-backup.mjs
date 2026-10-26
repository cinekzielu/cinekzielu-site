import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {savedCatalog,SAVED_STORAGE_KEY,encodeSaved} from '../src/data/savedItems.js'
import {SETS_KEY,encodeSets} from '../src/data/savedSets.js'
import {encodeSavedBackup,decodeSavedBackup,mergeSavedBackup,commitSavedBackup,readSavedSnapshot,snapshotSignature,BACKUP_MAX_BYTES} from '../src/data/savedBackup.js'
const keys=savedCatalog.filter(x=>x.type==='photo').slice(0,42).map(x=>x.key)
const current={saved:[keys[0]],sets:[{id:'one',name:'Żółć · Alpy',items:[keys[0]]}]}
const incoming={saved:[keys[0],keys[1]],sets:[{id:'one',name:'Old name',items:[keys[1],keys[0]]},{id:'two',name:'Nowy zestaw',items:[keys[2]]}]}
assert.deepEqual(decodeSavedBackup(encodeSavedBackup(current)),{...current,missing:0})
const merged=mergeSavedBackup(current,incoming)
assert.deepEqual(merged.snapshot.saved,keys.slice(0,2))
assert.deepEqual(merged.snapshot.sets[0],{id:'one',name:'Żółć · Alpy',items:keys.slice(0,2)})
assert.equal(merged.addedSets,1);assert.equal(merged.updatedSets,1)
assert.deepEqual(mergeSavedBackup(merged.snapshot,incoming).snapshot,merged.snapshot,'Repeated import is idempotent')
assert.equal(mergeSavedBackup(current,{saved:[],sets:[{...current.sets[0],id:'copy'}]}).skippedSets,1)
assert.deepEqual(current.sets[0].items,[keys[0]],'Input preserved')
assert(mergeSavedBackup({saved:[],sets:[{id:'one',name:'Full',items:keys.slice(0,40)}]},{saved:[],sets:[{id:'one',name:'More',items:[keys[40]]}]}).error)
assert(mergeSavedBackup({saved:[],sets:Array.from({length:20},(_,i)=>({id:`s${i}`,name:`Set${i}`,items:[]}))},incoming).error)
const raw={format:'cinek-zielu-zapisane',version:1,...current}
assert.equal(decodeSavedBackup(JSON.stringify({...raw,saved:[keys[0],'photo:gone','https://bad.example']})).missing,2)
for(const bad of ['oops','{}','null',JSON.stringify({...raw,version:2}),JSON.stringify({...raw,sets:[null]}),JSON.stringify({...raw,saved:[{}]}),JSON.stringify({...raw,sets:[...current.sets,...current.sets]}),JSON.stringify({...raw,sets:[{...current.sets[0],items:keys}]}),'x'.repeat(BACKUP_MAX_BYTES+1)])assert.throws(()=>decodeSavedBackup(bad))
function storage(seed=current,failAt=0){const map=new Map([[SAVED_STORAGE_KEY,encodeSaved(seed.saved)],[SETS_KEY,encodeSets(seed.sets)]]);let writes=0;return {getItem:k=>map.get(k)??null,setItem(k,v){if(++writes===failAt)throw Error('Quota');map.set(k,v)},removeItem:k=>map.delete(k)}}
let db=storage()
assert(commitSavedBackup(db,incoming,'old').changed)
assert.deepEqual(readSavedSnapshot(db),current)
assert.deepEqual(commitSavedBackup(db,incoming,snapshotSignature(current)).snapshot,merged.snapshot)
assert.deepEqual(readSavedSnapshot(db),merged.snapshot)
for(const failAt of [1,2]){db=storage(current,failAt);assert(commitSavedBackup(db,incoming,snapshotSignature(current)).error);assert.deepEqual(readSavedSnapshot(db),current,'Write failure restores both collections')}
const noStorage={getItem(){throw Error('Blocked')}}
assert.throws(()=>readSavedSnapshot(noStorage))
console.log('PASS: backup roundtrip, validation, unknown IDs, additive/idempotent merge, capacity rejection, stale preview, write rollback, blocked storage')
