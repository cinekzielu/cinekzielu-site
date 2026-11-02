import React, { useEffect, useState } from 'react'
import { useInitialLocation } from '../PageLocation'
import { curatedGalleryPhotos, gallerySelectionMode } from '../data/gallerySelection'
import { PhotoGrid } from './PhotoGrid'

export function GalleryPhotoSelection({ gallery }) {
  const initial = useInitialLocation()
  const [mode, setMode] = useState(() => gallerySelectionMode(gallery, initial.search))
  useEffect(() => {
    const sync = () => setMode(gallerySelectionMode(gallery, window.location.search))
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [gallery])
  const selected = curatedGalleryPhotos(gallery)
  const photos = mode === 'all' ? gallery.photos : selected
  const choose = value => {
    const url = new URL(window.location.href)
    if (value === 'all') url.searchParams.set('wybor', 'wszystkie'); else url.searchParams.delete('wybor')
    url.searchParams.delete('zdjecie')
    window.history.pushState({}, '', url.pathname + url.search + url.hash)
    setMode(value)
  }
  return <>
    <div className="cz-gallery-selection">
      <div role="group" aria-label="Wybór fotografii"><button type="button" aria-pressed={mode === 'selected'} onClick={() => choose('selected')}>Wybrane · {selected.length}</button><button type="button" aria-pressed={mode === 'all'} onClick={() => choose('all')}>Cały weekend · {gallery.photos.length}</button></div>
      <p role="status">{mode === 'all' ? 'Fotografie z toru i z trybun.' : 'Wybrane fotografie z toru.'}</p>
    </div>
    <PhotoGrid key={mode} gallery={{ ...gallery, photos }} shareable selectable />
  </>
}
