export const isVideoCollection = gallery => gallery.mediaKind === 'video-frames'
export const galleryLinkLabel = gallery => isVideoCollection(gallery) ? 'Kadry z wyprawy' : 'Galeria'
export const galleryHref = gallery => isVideoCollection(gallery) ? `/wyprawy/${gallery.id}#kadry` : `/galerie/${gallery.id}`
export const galleryMapHref = (gallery) => `/mapa?atlas=${gallery.mapNodeId}`
export const galleryMapLinks = (gallery) => (gallery.mapPlaces || [{ id: gallery.mapNodeId, label: gallery.mapLabel }]).map(place => ({ ...place, href: `/mapa?atlas=${place.id}` }))
export const photoCount = (count) => `${count} ${count === 1 ? 'zdjęcie' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'zdjęcia' : 'zdjęć'}`
export const frameCount = (count) => `${count} ${count === 1 ? 'kadr' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'kadry' : 'kadrów'}`
export const galleryItemCount = gallery => gallery.mediaKind === 'video-frames' ? frameCount(gallery.photos.length) : photoCount(gallery.photos.length)
export const galleryCollectionCount = galleries => {
  const frames = galleries.filter(gallery => gallery.mediaKind === 'video-frames').reduce((sum, gallery) => sum + gallery.photos.length, 0)
  const photos = galleries.filter(gallery => gallery.mediaKind !== 'video-frames').reduce((sum, gallery) => sum + gallery.photos.length, 0)
  return [photos && photoCount(photos), frames && frameCount(frames)].filter(Boolean).join(' · ') || photoCount(0)
}
export const galleryMediaLabel = galleries => galleries.some(gallery => gallery.mediaKind === 'video-frames') ? galleries.every(gallery => gallery.mediaKind === 'video-frames') ? 'Kadry' : 'Zdjęcia i kadry' : 'Zdjęcia'
export const expeditionCount = (count) => `${count} ${count === 1 ? 'wyprawa' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'wyprawy' : 'wypraw'}`

