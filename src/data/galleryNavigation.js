export const galleryHref = (gallery) => `/galerie/${gallery.id}`
export const galleryMapHref = (gallery) => `/mapa?atlas=${gallery.mapNodeId}`
export const photoCount = (count) => `${count} ${count === 1 ? 'zdjęcie' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'zdjęcia' : 'zdjęć'}`

