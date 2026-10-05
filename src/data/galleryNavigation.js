export const galleryHref = (gallery) => `/galerie/${gallery.id}`
export const galleryMapHref = (gallery) => `/mapa?atlas=${gallery.mapNodeId}`
export const galleryMapLinks = (gallery) => (gallery.mapPlaces || [{ id: gallery.mapNodeId, label: gallery.mapLabel }]).map(place => ({ ...place, href: `/mapa?atlas=${place.id}` }))
export const photoCount = (count) => `${count} ${count === 1 ? 'zdjęcie' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'zdjęcia' : 'zdjęć'}`
export const expeditionCount = (count) => `${count} ${count === 1 ? 'wyprawa' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'wyprawy' : 'wypraw'}`

