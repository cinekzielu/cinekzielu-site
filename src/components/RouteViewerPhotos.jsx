import React, { useId, useState } from 'react'
import { ResponsivePhoto } from './ResponsivePhoto'
import { routePhotoGroups } from '../data/routePhotoGroups'

export default function RouteViewerPhotos({ routeId, dayId }) {
  const groups = routePhotoGroups(routeId, dayId)
  const groupId = useId()
  const [selected, setSelected] = useState(groups[0]?.id)
  const [index, setIndex] = useState(0)
  const group = groups.find(item => item.id === selected) || groups[0]
  if (!group) return <aside className="cz-route-viewer-photos"><h3>Zdjęcia z trasy</h3><p>Do tej trasy nie przypisano jeszcze zdjęć.</p></aside>
  const current = Math.min(index, group.photos.length - 1), photo = group.photos[current]
  const step = delta => setIndex((current + delta + group.photos.length) % group.photos.length)
  return <aside className="cz-route-viewer-photos" aria-label="Zdjęcia przy trasie">
    <h3>{group.frames ? 'Kadry z wyprawy' : 'Zdjęcia z wyprawy'}</h3>
    {groups.length > 1 ? <label htmlFor={groupId}>Etap zdjęć<select id={groupId} value={group.id} onChange={event => { setSelected(event.target.value); setIndex(0) }}>{groups.map(item => <option key={item.id} value={item.id}>{item.title} · {item.dateLabel}</option>)}</select></label> : <p className="cz-route-viewer-photo-stage">{group.title}{group.dateLabel && ` · ${group.dateLabel}`}</p>}
    <figure tabIndex={0} aria-label="Fotografie. Strzałki w lewo i w prawo zmieniają zdjęcie, Home i End wybierają pierwsze i ostatnie." onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault()
        if (event.key === 'Home') setIndex(0)
        else if (event.key === 'End') setIndex(group.photos.length - 1)
        else step(event.key === 'ArrowRight' ? 1 : -1)
      }
    }}>
      <ResponsivePhoto key={photo.src} photo={photo} sizes="(max-width:800px) calc(100vw - 32px), 34vw" loading="eager" />
      <figcaption>{photo.alt}</figcaption>
    </figure>
    <div className="cz-route-viewer-photo-controls"><button type="button" aria-label="Poprzednie zdjęcie" disabled={group.photos.length < 2} onClick={() => step(-1)}>←</button><span role="status">{current + 1} / {group.photos.length}</span><button type="button" aria-label="Następne zdjęcie" disabled={group.photos.length < 2} onClick={() => step(1)}>→</button></div>
    <p className="cz-route-viewer-photo-note">{group.exactStage ? 'Zdjęcia przypisane do etapu według dat.' : 'Materiały z powiązanej wyprawy.'} Bez dokładnego przypisania do punktów GPS.</p>
  </aside>
}
