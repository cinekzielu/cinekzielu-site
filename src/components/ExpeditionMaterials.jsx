import React from 'react'
import { MaterialIcon } from './MaterialIcon'
import { filmCount } from '../data/expeditionPages'
import { galleryItemCount, isVideoCollection } from '../data/galleryNavigation'
import '../cardDetails.css'

export function ExpeditionMaterials({ gallery }) {
  return <span className="cz-card-materials">
    <span><MaterialIcon name={isVideoCollection(gallery) ? 'film' : 'photo'} />{galleryItemCount(gallery)}</span>
    {gallery.films.length > 0 && <span><MaterialIcon name="film" />{filmCount(gallery.films)}</span>}
  </span>
}
