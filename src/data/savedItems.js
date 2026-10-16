import { expeditionPages } from './expeditionPages.js'
import { photoGalleries } from './galleryData.js'
import { photoViewId } from './photoView.js'
import { tripRoutes } from './tripRoutes.js'
import routeCatalog from './routeCatalog.json' with { type: 'json' }

// Store stable content IDs only. Titles, links and images always come from the
// current catalog, never from browser storage.
export const SAVED_STORAGE_KEY = 'cz.saved.v1'
export const savedCatalog = [
  ...expeditionPages.map(trip => ({
    key: `trip:${trip.id}`, id: trip.id, type: 'trip', title: trip.title,
    detail: `${trip.region} · ${trip.year}`, href: `/wyprawy/${trip.id}`,
    photo: trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage),
    position: trip.gallery.coverPosition,
  })),
  ...routeCatalog.map(row => ({
    key: `route:${row.id}`, id: row.id, type: 'route', title: tripRoutes[row.id].title,
    detail: `${row.region} · ${tripRoutes[row.id].dates}`, href: `/trasy?trasa=${row.id}`,
    distance: row.distance, ascent: row.ascentEstimate, profiles: row.profiles,
  })),
  ...photoGalleries.flatMap(gallery => gallery.photos.map((photo, index) => ({
    key: `photo:${photoViewId(photo)}`, id: photoViewId(photo), type: 'photo',
    title: `${gallery.title} ${gallery.year}`, detail: 'Fotografia',
    accessibleTitle: `${gallery.title} ${gallery.year}, zdjęcie ${index + 1}`,
    href: `/galerie/${gallery.id}?zdjecie=${encodeURIComponent(photoViewId(photo))}`, photo,
  }))),
]
export const savedByKey = new Map(savedCatalog.map(item => [item.key, item]))
const photoKeys = new Map(savedCatalog.filter(item => item.type === 'photo').map(item => [item.photo.full, item.key]))
export const savedPhotoKey = photo => photoKeys.get(photo?.full) || null

export function cleanSavedKeys(keys) {
  if (!Array.isArray(keys)) return []
  return [...new Set(keys.filter(key => typeof key === 'string' && savedByKey.has(key)))].slice(0, savedByKey.size)
}
export function decodeSaved(raw) {
  if (!raw || typeof raw !== 'string' || raw.length > 200000) return []
  try {
    const value = JSON.parse(raw)
    return value?.version === 1 ? cleanSavedKeys(value.items) : []
  } catch { return [] }
}
export const encodeSaved = keys => JSON.stringify({ version: 1, items: cleanSavedKeys(keys) })
export function toggleSaved(keys, key) {
  const safe = cleanSavedKeys(keys)
  if (!savedByKey.has(key)) return safe
  return safe.includes(key) ? safe.filter(item => item !== key) : [key, ...safe]
}
export function savedComparisonHref(keys) {
  const routes = cleanSavedKeys(keys).filter(key => savedByKey.get(key).type === 'route')
  if (routes.length !== 2) return null
  return `/trasy?${new URLSearchParams({ porownaj: routes.map(key => savedByKey.get(key).id).join(',') })}#porownanie`
}
