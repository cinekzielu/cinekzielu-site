import React, { useEffect, useState } from 'react'
import { readBrowseReturn, requestBrowseReturn } from '../browseMemory'
import '../browseReturn.css'

export function BrowseReturn() {
  const [item, setItem] = useState(null)
  useEffect(() => {
    const sync = () => setItem(readBrowseReturn())
    sync()
    window.addEventListener('cz:browse-change', sync)
    return () => window.removeEventListener('cz:browse-change', sync)
  }, [])
  if (!item) return null
  return <nav className="cz-browse-return" aria-label="Powrót do przeglądania"><a href={item.url} data-browse-return onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) requestBrowseReturn(item) }}>← Wróć do {item.label}</a></nav>
}
