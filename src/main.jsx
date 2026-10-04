import React from 'react'
import { createRoot } from 'react-dom/client'
import { Mountain, Menu, Play, X } from 'lucide-react'
import './styles.css'
import { contentData } from './data/contentData'
import { filmsData } from './data/filmsData'
import { FilmIndex } from './components/Films'
import { getAtlasMaterials } from './data/atlasContent'
import { applyPageMetadata } from './pageMetadata'
import { legacyRedirects, normalizePagePath } from './data/siteMetadata'
import { NotFound } from './components/NotFound'
import { galleryData } from './data/galleryData'
import { GalleryCards, GalleryIndex, GalleryPage } from './components/Galleries'
import { ExpeditionIndex, ExpeditionPage, ExpeditionList } from './components/Expeditions'
import { expeditionPages, findExpeditionPage } from './data/expeditionPages'
import iconMap from './assets/icons/icon-map.svg'
import iconCamera from './assets/icons/icon-camera.svg'
import iconFilm from './assets/icons/icon-film.svg'
import iconGallery from './assets/icons/icon-gallery.svg'
import iconLocationMark from './assets/icons/icon-location-mark.svg'

const MapPage = React.lazy(() => import('./components/MapPage').then(module => ({ default: module.MapPage })))
const MapAtlas = React.lazy(() => import('./components/MapAtlas').then(module => ({ default: module.MapAtlas })))

const socials = {
  youtube: 'https://www.youtube.com/@cinek_zielu',
  instagram: 'https://www.instagram.com/cinek_zielu/',
  tiktok: 'https://www.tiktok.com/@cinek_zielu',
}

const img = (name) => `/images/${name}`

function CzIcon({ src, className = '' }) {
  return <img src={src} alt="" className={`cz-icon ${className}`.trim()} aria-hidden="true" />
}

const formatFilmCategory = (category = '') => category.replace(/[-_]/g, ' ').toUpperCase()

const formatFilmStatus = (status = '') => status.replace(/[-_]/g, ' ').toUpperCase()

const featuredFilms = filmsData
  .filter((film) => film.homepageFeatured || film.featured)
  .sort((a, b) => a.homepageOrder - b.homepageOrder)
  .slice(0, 3)

const homepageFilms = (featuredFilms.length ? featuredFilms : filmsData.slice(0, 3)).map((film) => {
  const ctaUrl = film.status === 'published' ? film.youtubeUrl?.trim() || null : null
  return {
    ...film,
    typeLabel: formatFilmCategory(film.category),
    statusLabel: ctaUrl ? 'Opublikowane' : 'Wkrótce',
    timelineLabel: film.year ? `Publikacja ${film.year}` : '',
    ctaUrl,
  }
})

const filmFallbackLabel = 'CINEMATIC STORY'
const homepageFeaturedExpeditions = [
  { id: 'tatry', name: 'Tatry', location: 'Polska i Słowacja', continent: 'EUROPA', code: 'ATLS-TAT-001', description: 'Granie, zimowe wejścia i filmy ze szczytów.', tags: ['Tatry', 'granie', 'zima'] },
  { id: 'morocco', name: 'Maroko / Toubkal', location: 'Maroko', continent: 'AFRYKA', code: 'ATLS-MAR-002', description: 'Podróż po Maroku i wejście na Toubkal.', tags: ['Atlas Wysoki', 'podróż', 'film'] },
  { id: 'switzerland', name: 'Szwajcaria', location: 'Szwajcaria', continent: 'EUROPA', code: 'ATLS-CHE-003', description: 'Alpejskie jeziora, grzbiety i lodowce.', tags: ['Alpy', 'fotografia', 'filmy'] },
].map(direction => {
  const materials = getAtlasMaterials(direction.id)
  return { id: direction.id, featuredMapNodeId: direction.id, featuredDirectionTitle: direction.name,
    featuredDirectionLocation: direction.location, featuredDirectionDescription: direction.description, featuredDirectionTags: direction.tags,
    directionMeta: `${direction.continent} / ${direction.location}`, atlasCode: direction.code, routeAccent: 'rgba(221, 169, 92, 0.72)',
    statusLabel: `${materials.films.length} ${materials.films.length === 2 ? 'filmy' : 'filmów'}`,
    timelineLabel: materials.galleries.length ? `${materials.galleries.length} ${materials.galleries.length === 1 ? 'galeria' : 'galerie'}` : 'YouTube',
    elevationLabel: materials.photoCount ? `${materials.photoCount} zdjęć` : '',
  }
})

const mobileNavLinks = [
  { href: '#map', label: 'Mapa' },
  { href: '#films', label: 'Filmy' },
  { href: '#featured-expeditions', label: 'Kierunki' },
  { href: '#expeditions', label: 'Wyprawy' },
  { href: '#gallery-preview', label: 'Galerie' },
  { href: '#footer', label: 'Kontakt' },
]

const mobileMenuVariant = 'A'
const parseExpeditionSlugFromPath = (pathname) => {
  const match = pathname.match(/^\/wyprawy\/([^/]+)\/?$/)
  if (!match) return null
  try { return decodeURIComponent(match[1]) } catch { return null }
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const menuRef = React.useRef(null)
  const menuButtonRef = React.useRef(null)
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
  const randomRelatedExpedition = React.useMemo(() => {
    if (!activeExpedition) return null

    const candidates = contentData.expeditions.filter((expedition) => expedition.slug !== activeExpedition.slug)
    if (!candidates.length) return null

    const randomIndex = Math.floor(Math.random() * candidates.length)
    return candidates[randomIndex] ?? null
  }, [activeExpedition])

    React.useEffect(() => {
    const elements = document.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('isVisible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0,
        rootMargin: '120px 0px',
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      elements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  React.useEffect(() => {
    if (!isMobileMenuOpen) return
    const previous = document.body.style.overflow
    const links = [...menuRef.current.querySelectorAll('a')]
    const controls = [menuButtonRef.current, ...links]
    const media = window.matchMedia('(min-width:901px)')
    const close = () => { setIsMobileMenuOpen(false); menuButtonRef.current?.focus() }
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); close() }
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus() }
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus() }
      }
    }
    const resize = () => { if (media.matches) setIsMobileMenuOpen(false) }
    document.body.style.overflow = 'hidden'
    links[0]?.focus()
    window.addEventListener('keydown', keydown)
    media.addEventListener('change', resize)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', keydown); media.removeEventListener('change', resize) }
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
    <main className="homepage">
      <a className="cz-skip-link" href="#home-content">Przejdź do treści</a>
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
            ref={menuButtonRef}
            aria-controls="mobile-navigation"
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
        <div ref={menuRef} id="mobile-navigation" role="navigation" aria-label="Menu mobilne" inert={!isMobileMenuOpen} className={`mobileMenu mobileVariant${mobileMenuVariant} ${isMobileMenuOpen ? 'isOpen' : ''}`}>
          {mobileNavLinks.map((item) => (
            <a href={item.href} key={item.href} onClick={() => { setIsMobileMenuOpen(false); requestAnimationFrame(() => { const target = document.querySelector(item.href); if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }) } }) }}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="heroGrid container" id="home-content" tabIndex={-1}>
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
              <img src="/images/optimized/hero-720.webp" srcSet="/images/optimized/hero-720.webp 720w, /images/optimized/hero-1280.webp 1280w" sizes="(max-width:900px) calc(100vw - 40px), (max-width:1400px) 44vw, 600px" width="1760" height="2048" fetchPriority="high" decoding="async" alt="Marcin Zieliński na górskim szczycie" className="heroImage" />
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

      <section id="map" className="section sectionDarker reveal"><div className="container"><SectionHeader icon={iconMap} label="MAPA WYPRAW" title="Mapa wypraw" text="Wybierz miejsce, aby zobaczyć zdjęcia i filmy z wypraw." /><React.Suspense fallback={<p role="status">Wczytywanie mapy…</p>}><MapAtlas /></React.Suspense></div></section>

      <section id="films" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            icon={iconFilm}
            label="WYBRANE FILMY"
            title="Filmy z drogi"
            text="Trzy wybrane filmy. Więcej znajdziesz w bibliotece."
          />
          <div className="filmGrid">
            {homepageFilms.map((film) => (
              <article className="filmCard" key={film.id}>
                <div className="filmImageWrap">
                  {film.thumbnail ? (
                    <img
                      src={film.thumbnail}
                      srcSet={film.homepageThumbnail ? `${film.homepageThumbnail.replace('-960.webp', '-640.webp')} 640w, ${film.homepageThumbnail} 960w` : undefined}
                      sizes="(max-width:900px) calc(100vw - 40px), (max-width:1400px) 31vw, 400px"
                      width="960"
                      height="540"
                      decoding="async"
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
                  <span className={`cardType${film.ctaUrl ? '' : ' contentStatus'}`}>{film.statusLabel}</span>
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
                  <div className="filmStatusSoon">Wkrótce</div>
                )}
              </article>
            ))}
          </div>
          <a className="cz-gallery-text-link" href="/filmy">Biblioteka filmów →</a>
        </div>
      </section>

      <section id="featured-expeditions" className="section sectionDarker reveal">
        <div className="container">
          <SectionHeader
            icon={iconLocationMark}
            label="WYBRANE KIERUNKI"
            title="Miejsca, które prowadzą dalej"
            text="Tatry, Maroko i Szwajcaria. Wybierz miejsce i zobacz materiały."
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
                <a className="smallButton featuredExpeditionCta" href={`/mapa?atlas=${expedition.featuredMapNodeId || expedition.mapNodeId || 'world'}`}>
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
            title="Wyprawy"
            text="Zdjęcia, filmy, miejsca."
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


              {activeExpeditionCollection && <div className="expeditionPlaceholder reveal">
                <p className="storyLabel">Galeria wyprawy</p>
                <GalleryCards galleries={[activeExpeditionCollection]} />
              </div>}

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
            <>
              <ExpeditionList expeditions={expeditionPages.slice(0, 3)} compact />
              <a className="cz-gallery-text-link" href="/wyprawy">Wszystkie wyprawy →</a>
            </>
          )}
        </div>
      </section>

      <section id="gallery-preview" className="section sectionDarker reveal">
        <div className="container">
          <SectionHeader icon={iconGallery} label="GALERIE" title="Zdjęcia z wypraw" />
          <GalleryCards galleries={galleryData.slice(0, 3)} compact />
          <a className="cz-gallery-text-link" href="/galerie">Wszystkie galerie · {galleryData.length} wyprawy →</a>
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


// Full-page links keep browser history and static metadata consistent.
const pathname = normalizePagePath(window.location.pathname)
if (legacyRedirects[pathname]) window.location.replace(legacyRedirects[pathname])
applyPageMetadata(pathname)
const pageRoute = pathname.match(/^\/(galerie|wyprawy)(?:\/(.*?))?$/)
let pageSlug = null
try { pageSlug = pageRoute?.[2] ? decodeURIComponent(pageRoute[2]) : null } catch { pageSlug = '__invalid__' }
let page = pathname === '/' ? <App /> : <NotFound />
if (pathname === '/mapa') page = <React.Suspense fallback={<p role="status">Wczytywanie mapy…</p>}><MapPage /></React.Suspense>
if (pathname === '/filmy') page = <FilmIndex />
if (pageRoute?.[1] === 'galerie') page = pageSlug ? <GalleryPage slug={pageSlug} /> : <GalleryIndex />
if (pageRoute?.[1] === 'wyprawy') page = pageSlug ? <ExpeditionPage slug={pageSlug} /> : <ExpeditionIndex />
createRoot(document.getElementById('root')).render(page)
