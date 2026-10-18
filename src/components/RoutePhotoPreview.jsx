import React, { useState } from 'react'
import stages from '../data/alpsPhotoStages.json'
import { alpsStoryGallery } from '../data/alpsStory'
import { photoViewId } from '../data/photoView'
import { ResponsivePhoto } from './ResponsivePhoto'

export function RoutePhotoPreview({ routeId }) {
  const groups = stages.filter(stage => stage.routeId === routeId)
  const [selected, setSelected] = useState(groups[0]?.id)
  const stage = groups.find(group => group.id === selected)
  if (!stage) return null
  const numbers = [...new Set([stage.photos[0], stage.photos[Math.floor(stage.photos.length / 2)], stage.photos.at(-1)])]
  return <section className="cz-atlas-photos" aria-label="Zdjęcia przy trasie">
    <div className="cz-atlas-photos-heading"><h3>Zdjęcia z etapu</h3><span>{stage.photos.length} fotografii</span></div>
    {groups.length > 1 ? <label>Etap zdjęć<select value={selected} onChange={event => setSelected(event.target.value)}>{groups.map(group => <option key={group.id} value={group.id}>{group.title} · {group.date}</option>)}</select></label> : <p>{stage.title} · {stage.date} 2026</p>}
    <div className="cz-atlas-photo-strip">{numbers.map(number => {
      const photo = alpsStoryGallery.photos[number - 1]
      return <a key={photoViewId(photo)} href={`/galerie/alpy-2026?etap=${stage.id}&zdjecie=${photoViewId(photo)}`} aria-label={`Otwórz fotografię: ${photo.alt}`}><ResponsivePhoto photo={photo} loading="lazy" sizes="(max-width: 820px) 30vw, 200px" /></a>
    })}</div>
    <p>Zdjęcia z tego etapu wyprawy, według dat wykonania. Bez dokładnego przypisania do punktów GPS.</p>
    <a href={`/galerie/alpy-2026?etap=${stage.id}`}>Wszystkie zdjęcia z etapu ↗</a>
  </section>
}
