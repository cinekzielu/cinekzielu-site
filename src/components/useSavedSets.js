import {useEffect, useRef, useState} from 'react'
import {SAVED_CHANGED_EVENT} from '../data/savedBackup'
import {SETS_KEY, decodeSets, encodeSets, mutateSets} from '../data/savedSets'

export function useSavedSets() {
  const [sets,setSets] = useState([]), [ready,setReady] = useState(false), [persistent,setPersistent] = useState(true)
  const current = useRef([]), available = useRef(true)
  const update = rows => {current.current = rows; setSets(rows)}
  useEffect(() => {
    try { update(decodeSets(localStorage.getItem(SETS_KEY))) } catch { available.current=false; setPersistent(false) }
    setReady(true)
    const sync = event => {
      try { if (event.storageArea !== localStorage || (event.key !== SETS_KEY && event.key !== null)) return } catch { return }
      update(decodeSets(event.newValue))
    }
    const reload=()=>{try{update(decodeSets(localStorage.getItem(SETS_KEY)));available.current=true;setPersistent(true)}catch{available.current=false;setPersistent(false)}}
    window.addEventListener('storage',sync);window.addEventListener(SAVED_CHANGED_EVENT,reload)
    return () => {window.removeEventListener('storage',sync);window.removeEventListener(SAVED_CHANGED_EVENT,reload)}
  },[])
  const dispatch = action => {
    let base = current.current
    if (available.current) try { base=decodeSets(localStorage.getItem(SETS_KEY)) } catch { available.current=false }
    const next = mutateSets(base,action)
    if (available.current) try { localStorage.setItem(SETS_KEY,encodeSets(next)) } catch { available.current=false }
    update(next); setPersistent(available.current)
    return next
  }
  return {sets,ready,persistent,dispatch}
}
