import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import '../routePresentation.css'

// A stable portal host moves the existing map/profile into the native dialog.
// The route, cursor, selected day and map viewport stay mounted when opening/closing.
export function RoutePresentation({ title, children }) {
  const [expanded, setExpanded] = useState(false)
  const [host, setHost] = useState(null)
  const inline = useRef(null), modal = useRef(null), dialog = useRef(null), trigger = useRef(null)
  const headingId = useId()
  useLayoutEffect(() => {
    const element = document.createElement('div')
    inline.current.appendChild(element)
    setHost(element)
    return () => element.remove()
  }, [])
  useLayoutEffect(() => {
    if (!host || !expanded) return
    const element = dialog.current, placeholder = inline.current
    const bodyOverflow = document.body.style.overflow, rootOverflow = document.documentElement.style.overflow
    modal.current.appendChild(host)
    document.body.style.overflow = document.documentElement.style.overflow = 'hidden'
    element.addEventListener('keydown', keepFocus)
    element.showModal()
    element.querySelector('.cz-route-viewer-close').focus({ preventScroll: true })
    const leave = () => setExpanded(false)
    window.addEventListener('popstate', leave)
    window.addEventListener('hashchange', leave)
    return () => {
      window.removeEventListener('popstate', leave)
      window.removeEventListener('hashchange', leave)
      element.removeEventListener('keydown', keepFocus)
      element.close()
      placeholder.appendChild(host)
      placeholder.style.minHeight = ''
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [host, expanded])
  const keepFocus = event => {
    if (event.key !== 'Tab') return
    const focusable = [...dialog.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), summary, [tabindex="0"]')]
      .filter(element => element.getClientRects().length > 0)
    const first = focusable[0], last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  return <>
    <button ref={trigger} type="button" className="cz-route-viewer-open" aria-haspopup="dialog" onClick={() => { inline.current.style.minHeight = `${inline.current.getBoundingClientRect().height}px`; setExpanded(true) }}>Oglądaj trasę na pełnym ekranie ↗</button>
    <div ref={inline} />
    <dialog ref={dialog} className="cz-route-viewer" aria-labelledby={headingId} onClose={() => { if (!dialog.current.open) setExpanded(false) }} onCancel={event => { event.preventDefault(); setExpanded(false) }}>
      <div className="cz-route-viewer-header"><div><span>Trasa · mapa, profil i zdjęcia</span><h2 id={headingId}>{title}</h2></div><button type="button" className="cz-route-viewer-close" onClick={() => setExpanded(false)}>Zamknij ×</button></div>
      <div className="cz-route-viewer-body" ref={modal} />
    </dialog>
    {host && createPortal(children(expanded), host)}
  </>
}
