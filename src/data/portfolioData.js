import { photoGalleries as galleryData } from './galleryData.js'

// Curated from existing galleries. Removed gallery photos disappear here automatically.
const selection = [
  {
    "galleryId": "alpy-2026",
    "src": "/assets/photos/galleries/alpy-2026/alpy-2026-01-small.webp"
  },
  {
    "galleryId": "alpy-2026",
    "src": "/assets/photos/galleries/alpy-2026/alpy-2026-02-small.webp"
  },
  {
    "galleryId": "szwajcaria-2025",
    "src": "/assets/photos/galleries/szwajcaria-2025/szwajcaria-01-small.webp"
  },
  {
    "galleryId": "szwajcaria-2025",
    "src": "/assets/photos/galleries/szwajcaria-2025/szwajcaria-03-small.webp"
  },
  {
    "galleryId": "szwajcaria-2025",
    "src": "/assets/photos/galleries/szwajcaria-2025/szwajcaria-22-small.webp"
  },
  {
    "galleryId": "alpy-2026",
    "src": "/assets/photos/galleries/alpy-2026/alpy-2026-20-small.webp"
  },
  {
    "galleryId": "alpy-2026",
    "src": "/assets/photos/galleries/alpy-2026/alpy-2026-38-small.webp"
  },
  {
    "galleryId": "konczysta-2026",
    "src": "/assets/photos/galleries/konczysta-2026/konczysta-2026-02-small.webp"
  },
  {
    "galleryId": "konczysta-2026",
    "src": "/assets/photos/galleries/konczysta-2026/konczysta-2026-11-small.webp"
  },
  {
    "galleryId": "liptowskie-mury-2026",
    "src": "/assets/photos/galleries/liptowskie-mury-2026/liptowskie-mury-2026-01-small.webp"
  },
  {
    "galleryId": "baranie-rogi-lodowy-szczyt-2026",
    "src": "/assets/photos/galleries/baranie-rogi-lodowy-szczyt-2026/baranie-rogi-lodowy-szczyt-2026-08-small.webp"
  },
  {
    "galleryId": "koscielec-2026",
    "src": "/assets/photos/galleries/koscielec-2026/koscielec-2026-16-small.webp"
  },
  {
    "galleryId": "turbacz-2026",
    "src": "/assets/photos/galleries/turbacz-2026/turbacz-2026-03-small.webp"
  },
  {
    "galleryId": "turbacz-2026",
    "src": "/assets/photos/galleries/turbacz-2026/turbacz-2026-01-small.webp"
  },
  {
    "galleryId": "szpiglasowy-wierch-2025",
    "src": "/assets/photos/galleries/szpiglasowy-wierch-2025/szpiglasowy-wierch-2025-01-small.webp"
  },
  {
    "galleryId": "krywan-2025",
    "src": "/assets/photos/galleries/krywan-2025/krywan-2025-10-small.webp"
  },
  {
    "galleryId": "alpy-2026",
    "src": "/assets/photos/galleries/alpy-2026/alpy-2026-40-small.webp"
  },
  {
    "galleryId": "alpy-2026",
    "src": "/assets/photos/galleries/alpy-2026/alpy-2026-22-small.webp"
  }
]

export const portfolioPhotos = selection.flatMap(({ galleryId, src }) => {
  const gallery = galleryData.find(item => item.id === galleryId)
  const photo = gallery?.photos.find(item => item.src === src)
  return photo ? [{ ...photo, sourceHref: `/galerie/${gallery.id}`, sourceLabel: `${gallery.title} ${gallery.year}` }] : []
})

// Explicit image references keep themes stable when the portfolio order changes.
const collections = [
  { id: 'jeziora', title: 'Jeziora', files: ['alpy-2026-01', 'szwajcaria-01', 'szwajcaria-03', 'szpiglasowy-wierch-2025-01', 'alpy-2026-40'] },
  { id: 'granie', title: 'Granie', files: ['alpy-2026-02', 'liptowskie-mury-2026-01', 'baranie-rogi-lodowy-szczyt-2026-08', 'alpy-2026-22'] },
  { id: 'zima', title: 'Zima', files: ['turbacz-2026-01', 'konczysta-2026-02', 'konczysta-2026-11', 'koscielec-2026-16', 'turbacz-2026-03'] },
]

export const photographyCollections = collections.map(({ files, ...collection }) => ({
  ...collection,
  photos: files.flatMap(file => portfolioPhotos.filter(photo => photo.src.endsWith(`/${file}-small.webp`))),
}))
export const photographyCollectionHref = collection => `/fotografia?kolekcja=${collection.id}`
