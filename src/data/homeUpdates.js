import { latestAlpsChapter } from './alpsStory.js'
import { photoGalleries } from './galleryData.js'
import { portfolioPhotos } from './portfolioData.js'

const hungaroring = photoGalleries.find(gallery => gallery.id === 'hungaroring-2026')
const latestAlpsUpdate = latestAlpsChapter && {
  id: `alps-episode-${latestAlpsChapter.id}`,
  publishedAt: latestAlpsChapter.episode.publishedAt,
  kind: 'film',
  label: 'Nowy film',
  title: `${latestAlpsChapter.title} — odcinek ${Number(latestAlpsChapter.number)}`,
  description: `Across the Alps · ${latestAlpsChapter.episode.duration}`,
  href: latestAlpsChapter.episode.youtubeUrl,
  action: 'Obejrzyj odcinek',
  thumbnail: latestAlpsChapter.episode.thumbnail,
}

// Dates describe publication of the material, not the trip or photograph date.
// Keep this a short editorial selection of material updates; copy fixes are omitted.
// Photography entries were published together in PR189 on 2 November 2026.
export const homeUpdates = [
  ...(latestAlpsUpdate ? [latestAlpsUpdate] : []),
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
