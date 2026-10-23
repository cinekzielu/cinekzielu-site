import React, { useState } from 'react'
import { PhotoGrid } from './PhotoGrid'
import { baraniePhotoStory } from '../data/storyPhotoGroups'
import { photoCount } from '../data/galleryNavigation'
import '../storyPhotoGroups.css'

export function StoryPhotoGroup({ group, tripId }) {
  const [expanded, setExpanded] = useState(false)
  const gridId = `historia-zdjecia-${group.id}`
  return <div className="cz-story-photo-group" id={`zdjecia-${group.id}`}>
    <h4 className="cz-story-photo-heading">Zdjęcia z etapu</h4>
    <div className="cz-story-photo-date"><time dateTime={group.date}>{group.dateLabel}</time><span>{photoCount(group.photos.length)}</span></div>
    <div id={gridId}><PhotoGrid gallery={{ id: tripId, title: group.title, photos: group.photos }} previewLimit={expanded ? null : 3} eagerFirst={false} /></div>
    {group.photos.length > 3 && <button className="cz-story-photo-more" type="button" aria-controls={gridId} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Zwiń zdjęcia' : `Pokaż cały etap · ${photoCount(group.photos.length)}`}</button>}
  </div>
}

export function BaraniePhotoStory() {
  return <section className="cz-trip-photo-story" id="historia-zdjecia" aria-labelledby="baranie-photo-story-title">
    <p className="cz-expedition-eyebrow">4–5 lipca 2026</p><h2 id="baranie-photo-story-title">Dwa dni na zdjęciach</h2>
    <p className="cz-story-photo-intro">Wybrane fotografie SONY z drogi, ułożone według dni.</p>
    {baraniePhotoStory.map((group,index) => <section className="cz-trip-photo-day" key={group.id} aria-labelledby={`story-title-${group.id}`}>
      <span className="cz-story-photo-day-number" aria-hidden="true">0{index+1}</span>
      <div><h3 id={`story-title-${group.id}`}>{group.title}</h3><p className="cz-story-photo-intro">{group.description}</p><StoryPhotoGroup group={group} tripId="baranie-rogi-lodowy-szczyt-2026" /></div>
    </section>)}
  </section>
}
