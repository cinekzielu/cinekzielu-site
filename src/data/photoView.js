// Asset names remain stable when photos are reordered in a collection.
export const photoViewId = photo => photo.full.split('/').pop().replace(/\.[^.]+$/, '')
export function linkedPhotoIndex(photos, search) {
  const id = new URLSearchParams(search).get('zdjecie')
  const index = id ? photos.findIndex(photo => photoViewId(photo) === id) : -1
  return index < 0 ? null : index
}
export function photoViewUrl(href, photo) {
  const url = new URL(href)
  url.searchParams.set('zdjecie', photoViewId(photo))
  return url.href
}
export function fittedPhotoSize(photo, width, height) {
  const ratio = Math.min(width / photo.width, height / photo.height)
  return { width: photo.width * ratio, height: photo.height * ratio }
}
