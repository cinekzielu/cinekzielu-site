import React from 'react'
import { createRoot } from 'react-dom/client'
import { Mountain, Menu, Play, X } from 'lucide-react'
import './styles.css'
import { contentData } from './data/contentData'
import { filmsData } from './data/filmsData'
import { expeditionsData } from './data/expeditionsData'
import { galleryData } from './data/galleryData'
import { MapAtlas } from './components/MapAtlas'
import iconAtlas from './assets/icons/icon-atlas.svg'
import iconCamera from './assets/icons/icon-camera.svg'
import iconFilm from './assets/icons/icon-film.svg'
import iconGallery from './assets/icons/icon-gallery.svg'
import iconLocationMark from './assets/icons/icon-location-mark.svg'

const socials = {
  youtube: 'https://www.youtube.com/@cinek_zielu',
  instagram: 'https://www.instagram.com/cinek_zielu/',
  tiktok: 'https://www.tiktok.com/@cinek_zielu',
}

const img = (name) => `/images/${name}`

function CzIcon({ src, className = '' }) {
  return (
    <span
      className={`cz-icon ${className}`.trim()}
      style={{ '--cz-icon-src': `url(${src})` }}
      aria-hidden="true"
    />
  )
}

const formatFilmCategory = (category = '') => category.replace(/[-_]/g, ' ').toUpperCase()

const formatFilmStatus = (status = '') => status.replace(/[-_]/g, ' ').toUpperCase()

const featuredFilms = filmsData
  .filter((film) => film.homepageFeatured || film.featured)
  .slice(0, 3)

const homepageFilms = (featuredFilms.length ? featuredFilms : filmsData.slice(0, 3)).map((film) => ({
  ...film,
  typeLabel: formatFilmCategory(film.category),
  statusLabel: formatFilmStatus(String(film.status || '')),
  timelineLabel: film.year || film.status,
  ctaUrl: film.youtubeUrl || null,
}))

const filmFallbackLabel = 'CINEMATIC STORY'
const expeditionFallbackLabel = 'Materiał w przygotowaniu'
const galleryFallbackLabel = 'Galeria w przygotowaniu'
const galleryPreviewIds = ['tatry', 'morocco', 'switzerland']

const preferredStoryIds = ['gerlach-winter', 'lomnica', 'durny-szczyt', 'koscielec-winter']

const homepageExpeditionStories = expeditionsData
  .filter((expedition) => expedition.homepageStory || expedition.storyFeatured || preferredStoryIds.includes(expedition.id))
  .slice(0, 3)
  .map((expedition) => ({
    ...expedition,
    statusLabel: formatFilmStatus(String(expedition.status || '')),
    timelineLabel: expedition.year || formatFilmStatus(String(expedition.season || '')),
    cardLocation: expedition.location || expedition.region || expedition.country,
    cardTags: expedition.tags || [],
    ctaLabel: expedition.youtubeUrl ? 'Zobacz historię' : 'Wkrótce więcej',
  }))

const formatContentStatus = (status = '') => {
  const normalized = String(status).trim().toLowerCase()
  if (normalized === 'planned') return 'w przygotowaniu'
  if (normalized === 'in-production') return 'w realizacji'
  if (normalized === 'published') return 'opublikowane'
  if (normalized === 'archived') return 'archiwalne'
  return normalized ? formatFilmStatus(normalized) : 'w przygotowaniu'
}

const homepageGalleryCards = galleryPreviewIds
  .map((id) => galleryData.find((gallery) => gallery.id === id))
  .filter(Boolean)
  .slice(0, 3)
  .map((gallery) => ({
    ...gallery,
    statusLabel: formatContentStatus(gallery.status),
    description: gallery.subtitle || 'Galeria kadrów z drogi.',
    ctaLabel: 'Galerie dla preview',
  }))

function GalleryPreviewCover({ gallery }) {
  const [isBroken, setIsBroken] = React.useState(false)
  const showFallback = !gallery.coverImage || isBroken

  return (
    <div className={`galleryPreviewVisual ${showFallback ? 'isFallback' : ''}`}>
      {!showFallback ? (
        <img src={gallery.coverImage} alt={`Kadr galerii ${gallery.title}`} loading="lazy" onError={() => setIsBroken(true)} />
      ) : null}
      <div className="galleryPreviewOverlay" />
      {showFallback ? (
        <div className="galleryPreviewFallback" aria-hidden="true">
          <span>{galleryFallbackLabel}</span>
        </div>
      ) : null}
    </div>
  )
}

function ExpeditionStoryCover({ expedition }) {
  const [isBroken, setIsBroken] = React.useState(false)
  const cover = expedition.coverImage || expedition.heroImage || expedition.thumbnail
  const showFallback = !cover || isBroken

  return (
    <div className={`expeditionStoryMedia ${showFallback ? 'isFallback' : ''}`}>
      {!showFallback ? (
        <img
          src={cover}
          alt={expedition.title}
          loading="lazy"
          onError={() => setIsBroken(true)}
        />
      ) : null}
      {showFallback ? (
        <div className="expeditionStoryMediaFallback" aria-hidden="true">
          <span>{expeditionFallbackLabel}</span>
        </div>
      ) : null}
    </div>
  )
}

const homepageFeaturedExpeditions = expeditionsData
  .filter((expedition) => expedition.homepageFeatured || expedition.featured)
  .slice(0, 3)
  .map((expedition) => ({
    ...expedition,
    statusLabel: formatFilmStatus(String(expedition.status || '')),
    timelineLabel: expedition.year || expedition.season || expedition.status,
    directionMeta: expedition.directionMeta || `${(expedition.country === 'Maroko' ? 'AFRYKA' : 'EUROPA')} / ${expedition.country}`,
    atlasCode: expedition.atlasCode || `ATLS-${expedition.id.slice(0, 3).toUpperCase()}` ,
    elevationLabel: expedition.elevationLabel || expedition.routeInfo?.elevationGain || '',
    routeAccent: expedition.routeAccent || 'rgba(221, 169, 92, 0.72)',
    featuredDirectionTitle: expedition.featuredDirectionTitle || expedition.displayTitle || expedition.directionTitle || expedition.title,
    featuredDirectionDescription: expedition.featuredDirectionDescription || expedition.shortDescription,
    featuredDirectionLocation: expedition.featuredDirectionLocation || expedition.country,
    featuredDirectionTags: expedition.featuredDirectionTags || expedition.tags,
  }))


const mobileNavLinks = [
  { href: '#map', label: 'Mapa' },
  { href: '#films', label: 'Filmy' },
  { href: '#featured-expeditions', label: 'Kierunki' },
  { href: '#expeditions', label: 'Historie' },
  { href: '#gallery-preview', label: 'Galeria' },
  { href: '#footer', label: 'Kontakt' },
]

const mobileMenuVariant = 'A'
const defaultMetadata = {
  title: 'Cinek Zielu | Góry, podróże i filmy dokumentalne',
  description:
    'Cinek Zielu (Marcin Zieliński) — góry, podróże i filmy dokumentalne. Zobacz zdjęcia, relacje i historie z wypraw.',
  image: '/og-image.jpg',
}

const setMetaTag = ({ selector, attribute, value }) => {
  const element = document.querySelector(selector)
  if (!element) return
  element.setAttribute(attribute, value)
}

const updatePageMetadata = ({ title, description, image }) => {
  document.title = title
  setMetaTag({ selector: 'meta[name="description"]', attribute: 'content', value: description })
  setMetaTag({ selector: 'meta[property="og:title"]', attribute: 'content', value: title })
  setMetaTag({ selector: 'meta[property="og:description"]', attribute: 'content', value: description })
  setMetaTag({ selector: 'meta[property="og:image"]', attribute: 'content', value: image })
  setMetaTag({ selector: 'meta[name="twitter:title"]', attribute: 'content', value: title })
  setMetaTag({ selector: 'meta[name="twitter:description"]', attribute: 'content', value: description })
  setMetaTag({ selector: 'meta[name="twitter:image"]', attribute: 'content', value: image })
}


const parseExpeditionSlugFromPath = (pathname) => {
  const match = pathname.match(/^\/wyprawy\/([^/]+)\/?$/)
  return match ? decodeURIComponent(match[1]) : null
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [atlasPath, setAtlasPath] = React.useState(['world'])
  const [activeExpeditionSlug, setActiveExpeditionSlug] = React.useState(null)
  const [isExpeditionNotFound, setIsExpeditionNotFound] = React.useState(false)
  const activeExpedition = React.useMemo(
    () => contentData.expeditionsBySlug[activeExpeditionSlug] ?? null,
    [activeExpeditionSlug]
  )
  const activeExpeditionCollection = React.useMemo(() => {
    if (!activeExpedition?.galleryCollectionSlug) return null
    return contentData.galleriesBySlug[activeExpedition.galleryCollectionSlug] ?? null
  }, [activeExpedition])
  const expeditionGalleryPhotos = React.useMemo(
    () => activeExpeditionCollection?.photos.slice(0, 6) ?? [],
    [activeExpeditionCollection]
  )
  const hasExpeditionGallery = expeditionGalleryPhotos.length >= 3
  const randomRelatedExpedition = React.useMemo(() => {
    if (!activeExpedition) return null

    const candidates = contentData.expeditions.filter((expedition) => expedition.slug !== activeExpedition.slug)
    if (!candidates.length) return null

    const randomIndex = Math.floor(Math.random() * candidates.length)
    return candidates[randomIndex] ?? null
  }, [activeExpedition])

  const atlasLookups = React.useMemo(() => ({
    ...contentData.atlasLookups,
  }), [])
  const atlasLevel = atlasPath.length - 1
  const activeId = atlasPath[atlasPath.length - 1]
  const activeNode = React.useMemo(() => {
    if (activeId === 'world') return { id: 'world', name: 'Świat', description: 'Wybierz kontynent, aby wejść głębiej w atlas wypraw.' }
    return atlasLookups.continents[activeId] || atlasLookups.countries[activeId] || atlasLookups.specialRegions[activeId] || atlasLookups.summits[activeId] || atlasLookups.places[activeId]
  }, [activeId, atlasLookups])

    React.useEffect(() => {
    const elements = document.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('isVisible')
          }
        })
      },
      {
        threshold: 0.12,
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      elements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  React.useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen])

  React.useEffect(() => {
    const syncExpeditionFromUrl = () => {
      const slugFromPath = parseExpeditionSlugFromPath(window.location.pathname)

      if (!slugFromPath) {
        setActiveExpeditionSlug(null)
        setIsExpeditionNotFound(false)
        return
      }

      const matchedExpedition = contentData.expeditionsBySlug[slugFromPath]
      if (matchedExpedition) {
        setActiveExpeditionSlug(matchedExpedition.slug)
        setIsExpeditionNotFound(false)
        return
      }

      setActiveExpeditionSlug(null)
      setIsExpeditionNotFound(true)
    }

    syncExpeditionFromUrl()
    window.addEventListener('popstate', syncExpeditionFromUrl)

    return () => window.removeEventListener('popstate', syncExpeditionFromUrl)
  }, [])

  React.useEffect(() => {
    if (!activeExpeditionSlug && !isExpeditionNotFound) return

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const detailEl = document.getElementById('expedition-detail')
        if (detailEl) {
          detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        document.getElementById('expeditions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }, [activeExpeditionSlug, isExpeditionNotFound])

  React.useEffect(() => {
    if (activeExpedition) {
      updatePageMetadata({
        title: `Cinek Zielu — ${activeExpedition.title}`,
        description: activeExpedition.shortDescription,
        image: activeExpedition.heroImage,
      })
      return
    }

    updatePageMetadata(defaultMetadata)
  }, [activeExpedition])

  // Uwaga: crawlers social media zwykle nie wykonują JS w SPA konsekwentnie.
  // Dla pełnego SEO/OG per URL docelowo potrzebne będą SSR (np. Next.js) albo statycznie generowane strony.

  const openExpedition = (slug) => {
    const nextUrl = `/wyprawy/${slug}`
    if (window.location.pathname !== nextUrl) {
      window.history.pushState({}, '', nextUrl)
    }
    setActiveExpeditionSlug(slug)
    setIsExpeditionNotFound(false)
  }

  const goBackToExpeditions = () => {
    window.history.pushState({}, '', '/#expeditions')
    setActiveExpeditionSlug(null)
    setIsExpeditionNotFound(false)

    window.requestAnimationFrame(() => {
      document.getElementById('expeditions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main>
      <section className="hero">
        <div className="cinematicNoise"></div>
        <div className="cinematicFog fogOne"></div>
        <div className="cinematicFog fogTwo"></div>
        <div className="glow"></div>
        <nav className={`nav container mobileVariant${mobileMenuVariant}`}>
          <div>
            <div className="logo">Cinek Zielu</div>
            <div className="sublogo">Marcin Zieliński • Góry • Podróże • Film</div>
          </div>
          <div className="navLinks">
            {mobileNavLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="hamburgerButton"
            type="button"
            aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        <div
          className={`mobileMenuBackdrop ${isMobileMenuOpen ? 'isOpen' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={`mobileMenu mobileVariant${mobileMenuVariant} ${isMobileMenuOpen ? 'isOpen' : ''}`}>
          {mobileNavLinks.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="heroGrid container">
          <div className="heroText">
            <div className="eyebrow">Cinek Zielu / Marcin Zieliński</div>
            <h1 className="heroTitle">Wyprawy, filmy i historie z miejsc, które zostają ze mną na długo.</h1>
            <p>
              Chodzę po górach, podróżuję, filmuję i fotografuję. Czasem powstaje z tego dłuższa opowieść,
              czasem krótka forma — zawsze zapis prawdziwej drogi i momentów po trasie.
            </p>
            <div className="buttons">
              <a className="button primary" href="#films">
                <Play size={16} /> Obejrzyj filmy
              </a>
              <a className="button" href={socials.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a className="button" href={socials.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            </div>
          </div>

          <div className="heroCard">
            <div className="heroImageWrap">
              <img src={img('hero.jpg')} alt="Marcin Zieliński na górskim szczycie" className="heroImage" />
              <div className="heroOverlay"></div>
              <div className="heroBadge"><CzIcon src={iconCamera} /> Cinek Zielu</div>
              <div className="heroCaption">
                <h2>Marcin Zieliński</h2>
                <p>Góry, podróże i filmowe kadry z miejsc, do których wracam myślami.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="section sectionDarker reveal"><div className="container"><SectionHeader icon={iconAtlas} label="MAPA WYPRAW" title="Interaktywna mapa wypraw" text="Hierarchia: Świat → kontynent → kraj/region → Tatry/szczyty." /><MapAtlas atlasPath={atlasPath} setAtlasPath={setAtlasPath} activeNode={activeNode} atlasLookups={atlasLookups} /></div></section>

      <section id="films" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            icon={iconFilm}
            label="WYBRANE FILMY"
            title="Filmy z drogi"
            text="Trzy historie z gór i podróży — zapisane w rytmie drogi, obrazu i momentów po trasie."
          />
          <div className="filmGrid">
            {homepageFilms.map((film) => (
              <article className="filmCard" key={film.id}>
                <div className="filmImageWrap">
                  {film.thumbnail ? (
                    <img
                      src={film.thumbnail}
                      alt={`Miniatura filmu ${film.title}`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                        event.currentTarget.parentElement?.classList.add('filmImageWrapFallback')
                      }}
                    />
                  ) : null}
                  <div className="filmImageFallback" aria-hidden="true">
                    <span>{filmFallbackLabel}</span>
                  </div>
                  <div className="filmImageBadges">
                    <span className="filmImageBadge filmImageBadgeType">{film.typeLabel}</span>
                    {film.ctaUrl ? (
                      <span className="filmImageBadge filmImageBadgeYoutube"><Play size={13} /> YouTube</span>
                    ) : (
                      <span className="filmImageBadge filmImageBadgeSoon">Wkrótce</span>
                    )}
                  </div>
                  {film.duration ? <span className="filmDuration">{film.duration}</span> : null}
                </div>
                <div className="filmMetaRow">
                  <div className="cardType">{film.statusLabel}</div>
                  <span className="filmHelperLabel">{film.timelineLabel}</span>
                </div>
                <h3>{film.title}</h3>
                <div className="filmLocation">{film.location}</div>
                <p>{film.shortDescription}</p>
                {film.tags?.length ? (
                  <div className="filmTags">
                    {film.tags.slice(0, 3).map((tag) => (
                      <span key={`${film.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                ) : null}
                {film.ctaUrl ? (
                  <a className="smallButton filmCta" href={film.ctaUrl} target="_blank" rel="noreferrer">
                    <Play size={14} /> Obejrzyj na YouTube
                  </a>
                ) : (
                  <div className="filmStatusSoon">Premiera wkrótce</div>
                )}
              </article>
            ))}
          </div>
          <a className="smallButton filmsArchiveCta" href="#films" aria-label="Zobacz wszystkie filmy (wkrótce)">
            Zobacz wszystkie filmy
          </a>
        </div>
      </section>

      <section id="featured-expeditions" className="section sectionDarker reveal">
        <div className="container">
          <SectionHeader
            icon={iconLocationMark}
            label="WYBRANE KIERUNKI"
            title="Miejsca, które prowadzą dalej"
            text="Tatry, Maroko i Szwajcaria — trzy różne skale wypraw, które najlepiej pokazują kierunek tej strony."
          />
          <div className="featuredExpeditionsGrid">
            {homepageFeaturedExpeditions.map((expedition) => (
              <article className="featuredExpeditionCard" key={expedition.id} style={{ '--route-accent': expedition.routeAccent }}>
                <div className="featuredExpeditionTopLine">
                  <span className="featuredExpeditionDirection">{expedition.directionMeta}</span>
                  <span className="featuredExpeditionCode">{expedition.atlasCode}</span>
                </div>
                <div className="featuredExpeditionRoute" aria-hidden="true">
                  <span className="featuredExpeditionRouteDot" />
                  <span className="featuredExpeditionRouteTrail" />
                  <Mountain size={14} />
                </div>
                <div className="featuredExpeditionMetaRow">
                  <div className="cardType">{expedition.statusLabel}</div>
                  <span className="filmHelperLabel">{expedition.timelineLabel}</span>
                </div>
                <h3>{expedition.featuredDirectionTitle}</h3>
                <div className="featuredExpeditionLocation"><CzIcon src={iconLocationMark} /> {expedition.featuredDirectionLocation}</div>
                <p>{expedition.featuredDirectionDescription}</p>
                <div className="featuredExpeditionExtraMeta">{expedition.elevationLabel}</div>
                {expedition.featuredDirectionTags?.length ? (
                  <div className="filmTags featuredExpeditionTags">
                    {expedition.featuredDirectionTags.slice(0, 3).map((tag) => (
                      <span key={`${expedition.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                ) : null}
                <a className="smallButton featuredExpeditionCta" href="#map">
                  Zobacz na mapie
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="expeditions" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            icon={iconLocationMark}
            label="WYPRAWY"
            title="Historie z wypraw"
            text="Każda wyprawa ma własną historię: krótki kontekst trasy, najważniejsze dane i kadry z drogi."
          />
          {activeExpedition || isExpeditionNotFound ? (
            activeExpedition ? (
              <article id="expedition-detail" className="expeditionDetail">
              <div className="expeditionCinematicHero reveal">
                <img src={activeExpedition.heroImage} alt={activeExpedition.title} className="expeditionCinematicHeroImage" />
                <div className="expeditionCinematicHeroOverlay" />
                <div className="expeditionCinematicHeroContent">
                  <p className="galleryBreadcrumb">Historie z wypraw / {activeExpedition.title}</p>
                  <div className="cardType">{activeExpedition.type}</div>
                  <h3>{activeExpedition.title}</h3>
                  <p className="expeditionHeroSubtitle">{activeExpedition.subtitle}</p>
                  <div className="expeditionHeroMeta">
                    <span>{activeExpedition.location}</span>
                    <span>{activeExpedition.season}</span>
                    <span>{activeExpedition.mood}</span>
                  </div>
                  <div className="expeditionTags">
                    {activeExpedition.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="expeditionHeroActions">
                    {activeExpedition.filmUrl && (
                      <a className="smallButton expeditionWatchButton" href={activeExpedition.filmUrl} target="_blank" rel="noreferrer">
                        <Play size={14} /> Obejrzyj film
                      </a>
                    )}
                    <button className="smallButton" type="button" onClick={goBackToExpeditions}>
                      Wróć do wypraw
                    </button>
                  </div>
                </div>
              </div>

              <div className="expeditionStatsBar reveal">
                <div><span>Wysokość</span><strong>{activeExpedition.stats.height}</strong></div>
                <div><span>Region</span><strong>{activeExpedition.stats.region}</strong></div>
                <div><span>Format filmu</span><strong>{activeExpedition.stats.filmFormat}</strong></div>
                <div><span>Sezon</span><strong>{activeExpedition.season}</strong></div>
                <div><span>Klimat</span><strong>{activeExpedition.mood}</strong></div>
              </div>

              <div className="expeditionStory reveal">
                <div className="expeditionStoryInner">
                  <p className="storyLabel">Historia wyprawy</p>
                  <p>{activeExpedition.longDescription}</p>
                </div>
              </div>


              <div className="expeditionPlaceholder reveal">
                <div className="expeditionGalleryHeader">
                  <p className="storyLabel">Galeria wyprawy</p>
                  <span className="smallButton isDisabled">Galeria wkrótce</span>
                </div>
                {hasExpeditionGallery ? (
                  <div className="expeditionGalleryGrid">
                    {expeditionGalleryPhotos.map((photo) => (
                      <figure
                        className={`expeditionPhotoCard ${photo.format === 'portrait' ? 'portrait' : ''}`}
                        key={`${activeExpeditionCollection.slug}-${photo.title}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Otwórz podgląd zdjęcia: ${photo.title}`}
                        onClick={() => {}}
                        onKeyDown={() => {}}
                      >
                        <img src={photo.src} alt={photo.title} />
                        <figcaption>{photo.title}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p>Ta galeria będzie jeszcze rozwijana.</p>
                )}
              </div>

              {randomRelatedExpedition && (
                <div className="expeditionNextStory reveal">
                  <div className="expeditionNextStoryHeader">
                    <p className="storyLabel">Zobacz też</p>
                    <p className="expeditionNextStoryHint">Kolejna historia, jeśli chcesz iść dalej tym szlakiem.</p>
                  </div>
                  <article className="expeditionCard expeditionNextStoryCard">
                    <div className="expeditionImageWrap">
                      <img src={randomRelatedExpedition.heroImage} alt={randomRelatedExpedition.title} />
                    </div>
                    <div className="expeditionBody">
                      <div className="cardType">Polecana historia</div>
                      <h3>{randomRelatedExpedition.title}</h3>
                      <p className="expeditionLocation">{randomRelatedExpedition.location}</p>
                      <p>{randomRelatedExpedition.shortDescription}</p>
                      <button className="smallButton" type="button" onClick={() => openExpedition(randomRelatedExpedition.slug)}>
                        Wejdź w historię
                      </button>
                    </div>
                  </article>
                </div>
              )}
            </article>
            ) : (
              <article id="expedition-detail" className="expeditionDetail">
                <div className="expeditionDetailTop">
                  <p className="galleryBreadcrumb">Historie z wypraw / Nie znaleziono</p>
                  <button className="smallButton" type="button" onClick={goBackToExpeditions}>
                    Wróć do wypraw
                  </button>
                </div>
                <div className="expeditionDetailBody">
                  <div>
                    <div className="cardType">Spokojnie</div>
                    <h3>Nie znaleziono tej wyprawy</h3>
                    <p>Ten adres nie prowadzi do istniejącej relacji. Wróć do listy wypraw i wybierz jedną z dostępnych historii.</p>
                  </div>
                </div>
              </article>
            )
          ) : (
            <div className="expeditionStoriesGrid">
              {homepageExpeditionStories.map((expedition) => (
                <article className="expeditionStoryCard" key={expedition.id}>
                  <ExpeditionStoryCover expedition={expedition} />
                  <div className="expeditionStoryBody">
                    <div className="expeditionStoryMetaTop">
                      <div className="cardType">{expedition.statusLabel}</div>
                      <span className="filmHelperLabel">{expedition.timelineLabel}</span>
                    </div>
                    <h3>{expedition.title}</h3>
                    <p className="expeditionLocation"><CzIcon src={iconLocationMark} /> {expedition.cardLocation}</p>
                    <p>{expedition.shortDescription}</p>
                    {expedition.cardTags.length ? (
                      <div className="expeditionTags">
                        {expedition.cardTags.slice(0, 3).map((tag) => (
                          <span key={`${expedition.id}-${tag}`}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                    <div className="expeditionStoryActions">
                      <span className={`smallButton expeditionStoryCta ${expedition.youtubeUrl ? '' : 'isDisabled'}`}>
                        {expedition.ctaLabel}
                      </span>
                      {expedition.youtubeUrl ? (
                        <a className="expeditionStoryYouTube" href={expedition.youtubeUrl} target="_blank" rel="noreferrer">
                          Film na YouTube
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="gallery-preview" className="section sectionDarker reveal">
        <div className="container">
          <SectionHeader
            icon={iconGallery}
            label="GALERIE"
            title="Galerie z wypraw"
            text="Zdjęcia z gór i podróży — miejsca, światło i momenty, które warto było zostawić poza filmem."
          />
          <div className="galleryPreviewGrid">
            {homepageGalleryCards.map((gallery) => (
              <article className="galleryPreviewCard" key={gallery.id}>
                <GalleryPreviewCover gallery={gallery} />
                <div className="galleryPreviewBody">
                  <div className="galleryPreviewMetaTop">
                    <div className="cardType">{gallery.statusLabel}</div>
                    <span className="filmHelperLabel">{gallery.location}</span>
                  </div>
                  <h3>{gallery.title}</h3>
                  <p>{gallery.description}</p>
                  {gallery.tags?.length ? (
                    <div className="filmTags galleryPreviewTags">
                      {gallery.tags.slice(0, 3).map((tag) => (
                        <span key={`${gallery.id}-${tag}`}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                  <span className="smallButton galleryPreviewCta isDisabled">{gallery.ctaLabel}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      <footer id="footer" className="footerSignature">
        <div className="footerSeparator" aria-hidden="true" />
        <div className="container footerInner">
          <div className="footerBrand">
            <p className="footerEyebrow">Cinek Zielu</p>
            <p className="footerTagline">Historie z drogi — góry, podróże i film.</p>
            <p className="footerMicro">Dzięki, że jesteś tu ze mną.</p>
          </div>

          <div className="footerLinksWrap">
            <div className="footerLinks">
              <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={socials.youtube} target="_blank" rel="noreferrer">YouTube</a>
              <a href={socials.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            </div>
            <a className="footerAnchor" href="mailto:kontakt@cinekzielu.com">Kontakt i współpraca</a>
            <p className="footerCopyright">© 2026 Cinek Zielu</p>
          </div>
        </div>
      </footer>
    </main>
  )
}


function SectionHeader({ icon, label, title, text }) {
  return (
    <header className="sectionHeader">
      <div className="sectionHeaderLabel">
        {icon ? <CzIcon src={icon} /> : null}
        <div className="cardType">{label}</div>
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  )
}


createRoot(document.getElementById('root')).render(<App />)
