import catalog from './routeCatalog.json' with { type: 'json' }
import { galleryData } from './galleryData.js'
import { alpsPhotoStory, baraniePhotoStory } from './storyPhotoGroups.js'

const dufourGroups = ['dufour-podejscie', 'dufour-szczyt', 'dufour-powrot']
// References to existing associations only. No inferred location of a photograph.
export function routePhotoGroups(routeId, dayId = 'all') {
  const alpsIds = routeId === 'dufourspitze' ? dufourGroups : [routeId]
  const alps = alpsIds.map(id => alpsPhotoStory[id]).filter(Boolean)
  if (alps.length) {
    const groups = routeId === 'dufourspitze' && dayId !== 'all' ? alps.filter((_, index) => String(index + 1) === dayId) : alps
    return groups.map(group => ({ ...group, exactStage: true }))
  }
  const trip = catalog.find(row => row.id === routeId)?.trip
  if (trip === 'baranie-rogi-lodowy-szczyt-2026') return baraniePhotoStory.filter((_, index) => dayId === 'all' || String(index + 1) === dayId).map(group => ({ ...group, exactStage: true }))
  const gallery = galleryData.find(item => item.id === trip)
  return gallery?.photos.length ? [{ id: gallery.id, title: gallery.title, photos: gallery.photos, frames: gallery.mediaKind === 'video-frames' }] : []
}
