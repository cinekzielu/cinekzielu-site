import { photoViewId } from './photoView.js'

export function curatedGalleryPhotos(gallery) {
  const ids = new Set(gallery.curatedPhotoIds || [])
  return gallery.photos.filter(photo => ids.has(photoViewId(photo)))
}

export function gallerySelectionMode(gallery, search = '') {
  const params = new URLSearchParams(search)
  const photo = params.get('zdjecie')
  if (photo && gallery.photos.some(item => photoViewId(item) === photo) && !gallery.curatedPhotoIds?.includes(photo)) return 'all'
  return params.get('wybor') === 'wszystkie' ? 'all' : 'selected'
}
