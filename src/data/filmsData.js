import { filmCatalog, filmRegionLabel } from './filmCatalog'

// Homepage and library share the same verified film metadata.
export const filmsData = filmCatalog.map(film => ({
  ...film,
  category: film.format,
  location: filmRegionLabel(film.region),
  year: film.publishedAt ? Number(film.publishedAt.slice(0, 4)) : null,
  homepageFeatured: Boolean(film.homepageOrder),
  thumbnail: film.homepageThumbnail || film.thumbnail,
}))
