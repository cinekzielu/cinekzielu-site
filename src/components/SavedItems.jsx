import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { SAVED_STORAGE_KEY, decodeSaved, encodeSaved, savedByKey, toggleSaved } from '../data/savedItems'
import {SAVED_CHANGED_EVENT} from '../data/savedBackup'
import '../savedItems.css'

const SavedContext = createContext(null)
export function SavedProvider({ children }) {
  const [keys, setKeys] = useState([])
  const [ready, setReady] = useState(false)
  const [persistent, setPersistent] = useState(true)
  const current = useRef([])
  const canPersist = useRef(true)
  const update = next => { current.current = next; setKeys(next) }
  useEffect(() => {
    try { update(decodeSaved(window.localStorage.getItem(SAVED_STORAGE_KEY))) }
    catch { canPersist.current = false; setPersistent(false) }
    setReady(true)
    const sync = event => {
      if (event.key !== SAVED_STORAGE_KEY && event.key !== null) return
      try { if (event.storageArea !== window.localStorage) return } catch { return }
      update(decodeSaved(event.newValue))
      canPersist.current = true; setPersistent(true)
    }
    const reload = () => {try {update(decodeSaved(window.localStorage.getItem(SAVED_STORAGE_KEY)));canPersist.current=true;setPersistent(true)}catch{canPersist.current=false;setPersistent(false)}}
    window.addEventListener('storage', sync);window.addEventListener(SAVED_CHANGED_EVENT,reload)
    return () => {window.removeEventListener('storage', sync);window.removeEventListener(SAVED_CHANGED_EVENT,reload)}
  }, [])
  const toggle = key => {
    if (!savedByKey.has(key)) return canPersist.current
    let base = current.current
    if (canPersist.current) {
      try { base = decodeSaved(window.localStorage.getItem(SAVED_STORAGE_KEY)) }
      catch { canPersist.current = false }
    }
    const next = toggleSaved(base, key)
    if (canPersist.current) {
      try { window.localStorage.setItem(SAVED_STORAGE_KEY, encodeSaved(next)) }
      catch { canPersist.current = false }
    }
    update(next); setPersistent(canPersist.current)
    return canPersist.current
  }
  return <SavedContext.Provider value={{ keys, ready, persistent, toggle }}>{children}</SavedContext.Provider>
}
export const useSaved = () => useContext(SavedContext)
export function BookmarkIcon({ filled = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4z" /></svg>
}
export function SavedHeaderLink({ active = false }) {
  const { keys, ready } = useSaved()
  return <a className="cz-saved-header" href="/zapisane" aria-current={active ? 'page' : undefined} aria-label={`Zapisane${ready && keys.length ? `: ${keys.length}` : ''}`} title="Zapisane">
    <BookmarkIcon filled={ready && keys.length > 0} />
    {ready && keys.length > 0 && <span aria-hidden="true">{keys.length > 99 ? '99+' : keys.length}</span>}
  </a>
}
export function SaveButton({ itemKey, iconOnly = false, className = '' }) {
  const { keys, ready, toggle } = useSaved()
  const [notice, setNotice] = useState(false)
  const item = savedByKey.get(itemKey)
  if (!item) return null
  const saved = keys.includes(itemKey)
  const label = `${saved ? 'Usuń z zapisanych' : 'Zapisz'}: ${item.accessibleTitle || item.title}`
  return <span className={`cz-save-control ${className}`}>
    <button type="button" className={`cz-save-button${iconOnly ? ' is-icon' : ''}`} disabled={!ready} aria-label={label} aria-pressed={saved} title={label} onClick={() => setNotice(!toggle(itemKey))}>
      <BookmarkIcon filled={saved} />{!iconOnly && <span>{saved ? 'Zapisano' : 'Zapisz'}</span>}
    </button>
    {notice && <span className="cz-save-notice" role="status">Pamięć przeglądarki jest niedostępna. Zapis działa tylko do opuszczenia strony.</span>}
  </span>
}
