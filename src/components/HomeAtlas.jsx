import React, { useEffect, useRef, useState } from 'react'
import { AtlasOverview } from './AtlasOverview'

const MapAtlas = React.lazy(() => import('./MapAtlas').then(module => ({ default: module.MapAtlas })))

class AtlasBoundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <AtlasOverview note="Nie udało się wczytać mapy. Możesz skorzystać z linków lub otworzyć pełny atlas." /> : this.props.children }
}

function Ready({ onReady }) {
  useEffect(onReady, [onReady])
  return null
}

// Only the homepage waits for the map section. The dedicated atlas stays eager.
// Render the same crawlable fallback on the server and during hydration.
export function HomeAtlas() {
  const [requested, setRequested] = useState(false)
  const container = useRef(null)
  const pendingAnchor = useRef('')
  const onReady = React.useCallback(() => {
    const hash = pendingAnchor.current
    if (!hash || hash !== window.location.hash) return
    const frame = requestAnimationFrame(() => { pendingAnchor.current = ''; document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' }) })
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    if (requested) return
    const requestFromLocation = () => {
      const hash = window.location.hash
      const target = hash && document.getElementById(hash.slice(1))
      const map = document.getElementById('map')
      const mapOrLater = target && map && (target === map || (map.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING))
      if (mapOrLater || new URLSearchParams(window.location.search).has('atlas')) {
        if (mapOrLater) pendingAnchor.current = hash
        setRequested(true)
      }
    }
    requestFromLocation()
    // A fast scroll or browser Back can land below the observer altogether.
    const passedMap = () => { if (container.current?.getBoundingClientRect().bottom < 0) setRequested(true) }
    passedMap()
    window.addEventListener('scroll', passedMap, { passive: true })
    window.addEventListener('hashchange', requestFromLocation)
    window.addEventListener('popstate', requestFromLocation)
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setRequested(true); observer.disconnect() }
    }, { rootMargin: '120px 0px' }) : null
    if (observer && container.current) observer.observe(container.current)
    return () => { observer?.disconnect(); window.removeEventListener('scroll', passedMap); window.removeEventListener('hashchange', requestFromLocation); window.removeEventListener('popstate', requestFromLocation) }
  }, [requested])
  const fallback = <AtlasOverview note={requested ? 'Wczytywanie mapy… Linki do miejsc i wypraw są już dostępne.' : 'Mapa wczyta się, gdy przejdziesz do tej części strony. Możesz też otworzyć miejsce lub wyprawę przez powyższe linki.'}>
    {!requested && <button type="button" className="cz-atlas-load" onClick={() => setRequested(true)}>Wczytaj mapę</button>}
  </AtlasOverview>
  return <div ref={container} className="cz-home-atlas" data-map-state={requested ? 'requested' : 'waiting'}>
    {requested ? <AtlasBoundary><React.Suspense fallback={fallback}><MapAtlas /><Ready onReady={onReady} /></React.Suspense></AtlasBoundary> : fallback}
  </div>
}
