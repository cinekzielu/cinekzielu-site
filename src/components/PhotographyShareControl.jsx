import React, { useEffect, useRef, useState } from 'react'
import { collectionSharePath } from '../data/sharePages'
import '../photographySharing.css'

export function PhotographyShareControl({ collection }) {
  const [link, setLink] = useState('')
  const [status, setStatus] = useState('')
  const input = useRef(null), button = useRef(null), revision = useRef(0)
  const path = collectionSharePath(collection.id)
  useEffect(() => () => { revision.current++ }, [])
  useEffect(() => { if (link) { input.current?.focus(); input.current?.select() } }, [link])
  if (!path) return null
  const copy = async () => {
    const current = ++revision.current
    const href = new URL(path, window.location.href).href
    setLink(href)
    setStatus('Zaznacz link i skopiuj go.')
    try {
      await navigator.clipboard.writeText(href)
      if (current === revision.current) setStatus('Link skopiowany.')
    } catch { /* The selected link field also works without clipboard access. */ }
  }
  const close = () => { revision.current++; setLink(''); setStatus(''); button.current?.focus() }
  return <div className="cz-collection-share" onKeyDown={event => {
    if (event.key === 'Escape' && link) { event.preventDefault(); close() }
  }}>
    <button ref={button} type="button" className="cz-collection-share-button" onClick={copy}>Kopiuj kolekcję</button>
    {link && <div className="cz-collection-share-field">
      <label>Link do kolekcji {collection.title}<input ref={input} readOnly value={link} onFocus={event => event.target.select()} onClick={event => event.currentTarget.select()} /></label>
      <button type="button" aria-label="Zamknij link do kolekcji" onClick={close}>×</button>
      <small role="status">{status}</small>
    </div>}
  </div>
}
