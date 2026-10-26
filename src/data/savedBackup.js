import {cleanSavedKeys, decodeSaved, encodeSaved, SAVED_STORAGE_KEY} from './savedItems.js'
import {cleanSets, decodeSets, encodeSets, MAX_SETS, MAX_SET_ITEMS, SETS_KEY, setName} from './savedSets.js'

export const BACKUP_MAX_BYTES = 1000000
export const SAVED_CHANGED_EVENT = 'cz:saved-data-changed'
export const snapshotSignature = snapshot => JSON.stringify([snapshot.saved,snapshot.sets])
export function readSavedSnapshot(storage) {
  return {saved:decodeSaved(storage.getItem(SAVED_STORAGE_KEY)),sets:decodeSets(storage.getItem(SETS_KEY))}
}
export function encodeSavedBackup(snapshot) {
  return JSON.stringify({format:'cinek-zielu-zapisane',version:1,saved:cleanSavedKeys(snapshot.saved),sets:cleanSets(snapshot.sets)},null,2)
}
export function decodeSavedBackup(raw) {
  if(typeof raw!=='string' || new TextEncoder().encode(raw).length>BACKUP_MAX_BYTES) throw Error('Plik jest za duży. Maksymalny rozmiar to 1 MB.')
  let data
  try {data=JSON.parse(raw)} catch {throw Error('Nie można odczytać pliku. Wybierz kopię Zapisanych w formacie JSON.')}
  const keysValid=keys=>Array.isArray(keys)&&keys.length<=2000&&keys.every(key=>typeof key==='string'&&key.length<=160)
  if(data?.format!=='cinek-zielu-zapisane'||data.version!==1||!keysValid(data.saved)||!Array.isArray(data.sets)||data.sets.length>MAX_SETS) throw Error('To nie jest obsługiwana kopia Zapisanych Cinek Zielu.')
  const ids=new Set()
  for(const set of data.sets) {
    if(!set || typeof set.id!=='string'||!/^[a-zA-Z0-9-]{1,64}$/.test(set.id)||ids.has(set.id)||!setName(set.name)||set.name.length>64||!keysValid(set.items)||set.items.length>MAX_SET_ITEMS) throw Error('Plik zawiera nieprawidłowy zestaw lub przekracza limit 40 materiałów.')
    ids.add(set.id)
  }
  const all=[...data.saved,...data.sets.flatMap(set=>set.items)]
  const missing=[...new Set(all.filter(key=>!cleanSavedKeys([key]).length))].length
  return {saved:cleanSavedKeys(data.saved),sets:cleanSets(data.sets),missing}
}
export function mergeSavedBackup(current,incoming) {
  const saved=cleanSavedKeys([...current.saved,...incoming.saved])
  const sets=cleanSets(current.sets).map(set=>({...set,items:[...set.items]}))
  let addedSets=0,updatedSets=0,skippedSets=0
  for(const source of incoming.sets) {
    const existing=sets.find(set=>set.id===source.id)
    if(existing) {
      const items=cleanSavedKeys([...existing.items,...source.items])
      if(items.length>MAX_SET_ITEMS) return {error:`Zestaw „${existing.name}” przekroczyłby 40 materiałów. Nic nie zostanie zaimportowane.`}
      if(items.length!==existing.items.length){existing.items=items;updatedSets++}else skippedSets++
    } else if(sets.some(set=>set.name===source.name&&JSON.stringify(set.items)===JSON.stringify(source.items))) skippedSets++
    else {
      if(sets.length>=MAX_SETS) return {error:'Po połączeniu byłoby więcej niż 20 zestawów. Nic nie zostanie zaimportowane.'}
      sets.push({...source,items:[...source.items]});addedSets++
    }
  }
  return {snapshot:{saved,sets},addedSaved:saved.length-current.saved.length,addedSets,updatedSets,skippedSets}
}
// Recheck immediately before writing so another tab's changes are never overwritten.
export function commitSavedBackup(storage,incoming,expectedSignature) {
  const current=readSavedSnapshot(storage)
  if(snapshotSignature(current)!==expectedSignature) return {changed:true,current}
  const result=mergeSavedBackup(current,incoming)
  if(result.error) return result
  const writes=[[SAVED_STORAGE_KEY,encodeSaved(result.snapshot.saved)],[SETS_KEY,encodeSets(result.snapshot.sets)]]
  const previous=writes.map(([key])=>[key,storage.getItem(key)])
  const completed=[]
  try {
    for(const [key,value] of writes){storage.setItem(key,value);completed.push(key)}
  } catch {
    let restored=true
    for(const key of completed.reverse()) {
      try {const value=previous.find(entry=>entry[0]===key)[1];if(value===null)storage.removeItem(key);else storage.setItem(key,value)} catch {restored=false}
    }
    return {error:restored?'Nie udało się zapisać importu. Dotychczasowe dane pozostały bez zmian. Zachowaj plik i spróbuj ponownie.':'Nie udało się zapisać całej kopii ani cofnąć części zmian. Zachowaj plik kopii i sprawdź Zapisane.',refresh:!restored}
  }
  return result
}
