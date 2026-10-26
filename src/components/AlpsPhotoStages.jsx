import React, { useEffect, useState } from 'react'
import stages from '../data/alpsPhotoStages.json'
import { alpsStoryGallery } from '../data/alpsStory'
import { useInitialLocation } from '../PageLocation'
import { PhotoGrid } from './PhotoGrid'
import { PhotoSlideshowButton } from './PhotoSlideshow'
import '../alpsPhotoStages.css'

const stagePhotos = groups => groups.flatMap(stage => stage.photos.map(number => alpsStoryGallery.photos[number - 1]))
const choices = routeId => stages.filter(stage => stage.routeId === routeId)
const galleryStage = search => {
  const params = new URLSearchParams(search), stage = stages.find(item => item.id === params.get('etap'))
  const photo = params.get('zdjecie')
  if (photo && stage && !stage.photos.some(n => photo === `alpy-2026-${String(n).padStart(2, '0')}`)) return 'all'
  return stage?.id || 'all'
}

export function AlpsGalleryStages({ gallery }) {
  const initial = useInitialLocation()
  const [selected, setSelected] = useState(() => galleryStage(initial.search))
  useEffect(() => {
    const sync = () => setSelected(galleryStage(window.location.search))
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const pick = id => {
    setSelected(id)
    const url = new URL(window.location.href)
    if (id === 'all') url.searchParams.delete('etap'); else url.searchParams.set('etap', id)
    url.searchParams.delete('zdjecie')
    window.history.pushState({}, '', url.pathname + url.search)
  }
  const stage = stages.find(item => item.id === selected)
  const photos = stage ? stagePhotos([stage]) : gallery.photos
  return <>
    <div className="cz-photo-stages"><div className="cz-photo-stage-heading"><h2>Etapy wyprawy</h2><span>{photos.length} fotografii</span></div>
      <div className="cz-photo-stage-tabs" role="group" aria-label="Etap fotografii"><button type="button" aria-pressed={!stage} onClick={() => pick('all')}>Wszystkie · 48</button>{stages.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => pick(item.id)}>{item.title}<small>{item.date} · {item.photos.length}</small></button>)}</div>
      <p>Podział według dat wykonania zdjęć. Przerwy między wejściami są osobnymi etapami.</p>
      {stage?.routeId && <a href={`/wyprawy/alpy-2026#${stage.routeId === 'dufourspitze' ? 'dufour' : stage.routeId}-trasa`}>Trasa i opowieść: {stage.title} ↗</a>}
    </div>
    <PhotoSlideshowButton key={`show-${selected}`} photos={photos} stage={stage?.title} chapters={stages.map(item=>({id:item.id,title:item.title,photos:stagePhotos([item]).map(photo=>photo.full)}))} />
    <PhotoGrid key={selected} gallery={{ ...gallery, photos }} shareable selectable />
  </>
}

export function RoutePhotoStages({ routeId }) {
  const groups = choices(routeId)
  const [selected, setSelected] = useState('all')
  const [expanded, setExpanded] = useState(false)
  if (!groups.length) return null
  const current = groups.find(item => item.id === selected)
  const photos = stagePhotos(current ? [current] : groups)
  return <section className="cz-photo-stages cz-route-photos" aria-label="Fotografie z etapu">
    <div className="cz-photo-stage-heading"><h3>Fotografie z etapu</h3><span>{photos.length} zdjęć</span></div>
    {groups.length > 1 ? <div className="cz-photo-stage-tabs" role="group" aria-label="Dzień fotografii"><button type="button" aria-pressed={!current} onClick={() => { setSelected('all'); setExpanded(false) }}>Trzy dni</button>{groups.map(stage => <button type="button" key={stage.id} aria-pressed={selected === stage.id} onClick={() => { setSelected(stage.id); setExpanded(false) }}>{stage.title.replace('Dufourspitze · ', '')}<small>{stage.date}</small></button>)}</div> : <p>{groups[0].date} 2026</p>}
    <p>Przypisane do etapu według dat wykonania zdjęć.</p>
    <PhotoGrid key={selected} gallery={{ ...alpsStoryGallery, title: current?.title || groups[0].title.split(' · ')[0], photos }} previewLimit={expanded ? null : 3} eagerFirst={false} />
    <div className="cz-route-photo-actions">{photos.length > 3 && <button type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Zwiń zdjęcia' : `Pokaż wszystkie · ${photos.length}`}</button>}<a href={`/galerie/alpy-2026${current || groups.length === 1 ? `?etap=${current?.id || groups[0].id}` : ''}`}>Galeria według etapów ↗</a><a href={`/wyprawy/alpy-2026#alpy-${routeId}`}>Rozdział wyprawy ↗</a></div>
  </section>
}
