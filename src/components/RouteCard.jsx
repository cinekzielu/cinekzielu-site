import React, { useEffect, useRef, useState } from 'react'
import { tripRoutes } from '../data/tripRoutes'
import catalog from '../data/routeCatalog.json'
import { highestPeak } from '../data/routeAtlas'
import { drawRouteCard } from '../data/routeCardDrawing'
import '../routeCard.css'

export function RouteCard({ selected }) {
  const [id, setId] = useState(selected || 'dufourspitze')
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [ready, setReady] = useState(false)
  const [retry, setRetry] = useState(0)
  const canvas = useRef(null), section = useRef(null)
  useEffect(() => { if (selected) setId(selected) }, [selected])
  useEffect(() => {
    if (!ready || window.location.hash !== '#karta-trasy') return
    const frame = requestAnimationFrame(() => section.current?.scrollIntoView({ block: 'start', behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [ready])
  useEffect(() => {
    const sync = () => {
      if (window.location.hash !== '#karta-trasy') return
      setOpen(true)
      requestAnimationFrame(() => section.current?.scrollIntoView({ block: 'start', behavior: 'instant' }))
    }
    sync(); window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => {
    if (!open) return
    let live = true
    setReady(false); setStatus('Przygotowywanie karty…')
    Promise.all([tripRoutes[id].load(), document.fonts.load('64px "Cinek Zielu Abstract"')])
      .then(([module]) => {
        if (!live) return
        drawRouteCard(canvas.current, tripRoutes[id], catalog.find(row => row.id === id), module.default, highestPeak(tripRoutes[id]))
        setReady(true); setStatus('Karta gotowa · PNG 1080 × 1350 px')
      })
      .catch(() => { if (live) setStatus('Nie udało się przygotować karty. Spróbuj ponownie.') })
    return () => { live = false }
  }, [id, open, retry])
  const download = () => {
    if (!ready) return
    canvas.current.toBlob(blob => {
      if (!blob) { setStatus('Nie udało się zapisać obrazu. Spróbuj ponownie.'); return }
      const url = URL.createObjectURL(blob), link = document.createElement('a')
      link.href = url; link.download = `cinek-zielu-${id}.png`
      document.body.appendChild(link); link.click(); link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 30000)
      setStatus('Przekazano plik PNG do pobrania.')
    }, 'image/png')
  }
  return <section className="cz-route-card" id="karta-trasy" ref={section} aria-labelledby="route-card-heading">
    <div className="cz-route-card-heading"><h2 id="route-card-heading">Karta trasy</h2><span>Prototyp</span></div>
    <p>Przebieg, profil i najważniejsze liczby w jednym obrazie do zapisania.</p>
    {!open ? <button type="button" onClick={() => setOpen(true)}>Pokaż kartę trasy</button> : <div className="cz-route-card-layout">
      <div className="cz-route-card-settings">
        <label>Trasa na karcie<select value={id} onChange={event => setId(event.target.value)}>{catalog.map(row => <option key={row.id} value={row.id}>{tripRoutes[row.id].title} · {tripRoutes[row.id].dates}</option>)}</select></label>
        <p>Całe przejście, także dla tras połączonych z kilku dni. Schemat zachowuje kierunek północy i przerwy w nagraniu.</p>
        <p>Dystans i podejścia pochodzą z GPS. Wysokość najwyższego szczytu jest podana osobno, według danych używanych na stronie.</p>
        <button type="button" onClick={download} disabled={!ready}>Pobierz PNG</button>
        {!ready && <button type="button" onClick={() => setRetry(value => value + 1)}>Ponów przygotowanie</button>}
        <p role="status">{status}</p>
        <p className="cz-route-card-alt">{tripRoutes[id].title} · {tripRoutes[id].dates}. Podgląd poniżej przedstawia ten sam obraz, który zostanie pobrany.</p>
      </div>
      <canvas ref={canvas} width="1080" height="1350" style={{ visibility: ready ? 'visible' : 'hidden' }} role="img" aria-label={`Karta trasy ${tripRoutes[id].title}: schemat GPS, profil wysokości, dystans, podejścia i najwyższy szczyt.`} />
    </div>}
  </section>
}
