import { alpsEpisodes } from './alpsEpisodes.js'
import { photoGalleries } from './galleryData.js'
import { portfolioPhotos } from './portfolioData.js'

const hungaroring = photoGalleries.find(gallery => gallery.id === 'hungaroring-2026')

// Dates describe publication on the site, not the trip or photograph date.
// Keep this a short editorial selection of material updates; copy fixes are omitted.
// Photography entries were published together in PR189 on 2 November 2026.
export const homeUpdates = [
  {
    id: 'triglav-episode-one',
    publishedAt: alpsEpisodes.triglav.publishedAt,
    kind: 'film',
    label: 'Nowy film',
    title: 'Triglav — odcinek 1',
    description: `Across the Alps · ${alpsEpisodes.triglav.duration}`,
    href: alpsEpisodes.triglav.youtubeUrl,
    action: 'Obejrzyj odcinek',
    thumbnail: alpsEpisodes.triglav.thumbnail,
  },
  {
    id: 'hungaroring-edited-photos',
    publishedAt: '2026-11-02',
    kind: 'gallery',
    label: 'Nowe fotografie',
    title: 'Hungaroring 2026',
    description: '16 obrobionych fotografii dodanych do galerii.',
    href: '/galerie/hungaroring-2026',
    action: 'Zobacz galerię',
    photo: hungaroring.photos.find(photo => photo.src === hungaroring.coverImage),
    photoPosition: '50% 70%',
  },
  {
    id: 'portfolio-november',
    publishedAt: '2026-11-02',
    kind: 'photography',
    label: 'Uzupełnione portfolio',
    title: 'Fotografia',
    description: 'Nowe fotografie z Alp, Sycylii i Hungaroringu.',
    href: '/fotografia',
    action: 'Zobacz portfolio',
    photo: portfolioPhotos.find(photo => photo.sourceHref === '/galerie/katania-2026'),
  },
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3)
