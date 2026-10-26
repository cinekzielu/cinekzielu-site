import { cleanSavedKeys, savedByKey } from './savedItems.js'

export const SETS_KEY = 'cz.saved.sets.v1'
export const MAX_SETS = 20
export const MAX_SET_ITEMS = 40
export const MAX_SHARE_LENGTH = 14000
export const setName = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 64) : ''
const validId = id => typeof id === 'string' && /^[a-zA-Z0-9-]{1,64}$/.test(id)
export function cleanSets(value) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  return value.filter(row => row && validId(row.id) && setName(row.name) && Array.isArray(row.items) && !seen.has(row.id) && seen.add(row.id))
    .slice(0, MAX_SETS).map(row => ({id:row.id, name:setName(row.name), items:cleanSavedKeys(row.items).slice(0, MAX_SET_ITEMS)}))
}
export function decodeSets(raw) {
  if (typeof raw !== 'string' || raw.length > 200000) return []
  try { const data = JSON.parse(raw); return data?.version === 1 ? cleanSets(data.sets) : [] } catch { return [] }
}
export const encodeSets = sets => JSON.stringify({version:1, sets:cleanSets(sets)})
export function mutateSets(sets, action) {
  const rows = cleanSets(sets)
  if (action.type === 'create') {
    if (rows.length >= MAX_SETS || !validId(action.id) || rows.some(row => row.id === action.id) || !setName(action.name)) return rows
    return [...rows, {id:action.id, name:setName(action.name), items:cleanSavedKeys(action.items || []).slice(0, MAX_SET_ITEMS)}]
  }
  if (action.type === 'delete') return rows.filter(row => row.id !== action.id)
  return rows.map(row => {
    if (row.id !== action.id) return row
    if (action.type === 'move' && (action.delta === -1 || action.delta === 1)) {
      const index = row.items.indexOf(action.key), target = index + action.delta
      if (index < 0 || target < 0 || target >= row.items.length) return row
      const items = [...row.items]
      ;[items[index], items[target]] = [items[target], items[index]]
      return {...row, items}
    }
    if (action.type === 'rename' && setName(action.name)) return {...row, name:setName(action.name)}
    if (action.type === 'remove') return {...row, items:row.items.filter(key => key !== action.key)}
    if (action.type === 'addMany') {
      const additions = cleanSavedKeys(action.keys || []).filter(key => !row.items.includes(key))
      if (row.items.length + additions.length > MAX_SET_ITEMS) return row
      return {...row, items:[...row.items, ...additions]}
    }
    if (action.type === 'add' && savedByKey.has(action.key) && !row.items.includes(action.key) && row.items.length < MAX_SET_ITEMS) return {...row, items:[...row.items, action.key]}
    return row
  })
}

// The URL fragment holds an explicit snapshot, never a browser history or a storage ID.
// It is not included in the HTTP request, sitemap or social preview HTML.
export function encodeSharedSet(set) {
  const data = {v:1, n:setName(set.name), k:cleanSavedKeys(set.items).slice(0,MAX_SET_ITEMS)}
  if (!data.n || !data.k.length) return null
  const bytes = new TextEncoder().encode(JSON.stringify(data))
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join('')).replaceAll('+','-').replaceAll('/','_').replace(/=+$/, '')
}
export function decodeSharedSet(token) {
  if (typeof token !== 'string' || !token || token.length > MAX_SHARE_LENGTH || !/^[A-Za-z0-9_-]+$/.test(token)) return {error:'Ten link do zestawu jest niepełny lub nieprawidłowy.'}
  try {
    const bytes = Uint8Array.from(atob(token.replaceAll('-','+').replaceAll('_','/')), char => char.charCodeAt(0))
    const data = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes))
    if (data?.v !== 1 || !setName(data.n) || !Array.isArray(data.k) || !data.k.length || data.k.length > MAX_SET_ITEMS || data.k.some(key => typeof key !== 'string' || key.length > 160)) throw Error('Invalid snapshot')
    const items = cleanSavedKeys(data.k)
    return {set:{name:setName(data.n), items}, missing:[...new Set(data.k)].filter(key => !cleanSavedKeys([key]).length).length}
  } catch { return {error:'Nie udało się odczytać zestawu. Poproś o ponowne skopiowanie całego linku.'} }
}
export const sharedSetPath = set => { const token = encodeSharedSet(set); return token ? `/zapisane#zestaw=${token}` : null }
