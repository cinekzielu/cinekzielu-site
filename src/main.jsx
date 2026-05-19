import React from 'react'
import { createRoot } from 'react-dom/client'
import { Camera, ChevronLeft, ChevronRight, MapPin, Mountain, Menu, Play, X } from 'lucide-react'
import './styles.css'
import { contentData } from './data/contentData'
import { filmsData } from './data/filmsData'
import { expeditionsData } from './data/expeditionsData'
import { MapAtlas } from './components/MapAtlas'

const socials = {
  youtube: 'https://www.youtube.com/@cinek_zielu',
  instagram: 'https://www.instagram.com/cinek_zielu/',
  tiktok: 'https://www.tiktok.com/@cinek_zielu',
}

const img = (name) => `/images/${name}`

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


const places = [
  {
    title: 'Tatry',
    desc: 'Wejścia, granie, zimowe warunki i bardziej wymagające trasy. Filmy, które pokazują góry prawdziwie — z wysiłkiem, emocją i klimatem drogi.',
    meta: 'Góry • szczyty • droga',
    className: 'place-tatry',
  },
  {
    title: 'Maroko',
    desc: 'Podróż, trekking, inne światło i pierwszy mocniejszy krok poza europejski klimat. Materiały zbudowane wokół przygody, kontrastu i atmosfery miejsca.',
    meta: 'Podróż • trekking • kontrast',
    className: 'place-maroko',
  },
  {
    title: 'Szwajcaria',
    desc: 'Alpejskie krajobrazy, cinematic short films, spokojniejsze tempo i najmocniejsze wizualnie zdjęcia oparte na przestrzeni, świetle i skali gór.',
    meta: 'Alpy • cinematic • krajobraz',
    className: 'place-swiss',
  },
]

const formats = [
  {
    title: 'Vlogi',
    desc: 'Dłuższe historie z wypraw: przygotowanie, droga, wejście, komentarz, zmęczenie i klimat całego dnia.',
  },
  {
    title: 'Short films',
    desc: 'Krótsze, bardziej dopracowane formy — obraz, muzyka, rytm, nastrój i spójna wizja miejsca.',
  },
  {
    title: 'Reels',
    desc: 'Dynamiczne pionowe materiały pod Instagram i TikTok: mocne momenty, szybki rytm i kulisy tworzenia.',
  },
]


const creativeGear = [
  {
    title: 'Aparat',
    label: 'Obraz i detal',
    desc: 'To nim łapię światło, fakturę skały i drobne momenty po drodze. Ma dawać obraz, który czuć, a nie tylko oglądać.',
  },
  {
    title: 'Kamera sportowa',
    label: 'Ruch i tempo',
    desc: 'Wchodzi tam, gdzie liczy się dynamika: podejścia, ekspozycja, szybkie zmiany pogody. Dzięki niej film oddaje rytm wyprawy od środka.',
  },
  {
    title: 'Obiektywy',
    label: 'Skala i perspektywa',
    desc: 'Szeroko pokazuję przestrzeń, ciaśniej buduję emocję człowieka w terenie. To one decydują, czy widz patrzy na krajobraz, czy czuje historię.',
  },
  {
    title: 'Dźwięk',
    label: 'Atmosfera',
    desc: 'Wiatr, kroki, oddech i cisza robią połowę klimatu. Dźwięk prowadzi widza przez materiał równie mocno jak obraz.',
  },
  {
    title: 'Montaż',
    label: 'Finalny klimat',
    desc: 'Tu z surowych ujęć powstaje opowieść: tempo, napięcie i oddech filmu. Montaż nie udaje przygody — porządkuje to, co naprawdę wydarzyło się w trasie.',
  },
  {
    title: 'Podejście do tworzenia',
    label: 'Autentyczność',
    desc: 'Nie gonię za checklistą kadrów. Najpierw przeżywam drogę, później wybieram ujęcia, które najuczciwiej oddają miejsce i emocje.',
  },
]

const workflowSteps = [
  {
    title: 'Wyprawa i nagranie',
    desc: 'Plan to punkt startowy, ale najważniejsze są warunki i momenty, które pojawiają się po drodze.',
  },
  {
    title: 'Selekcja materiału',
    desc: 'Wybieram ujęcia, które niosą historię: światło, ruch, emocję i naturalny rytm miejsca.',
  },
  {
    title: 'Montaż i klimat filmu',
    desc: 'Składam całość tak, by widz czuł drogę od pierwszego kroku do ostatniego kadru.',
  },
]

const blogPosts = [
  { title: 'Jak wygląda tworzenie filmu górskiego od środka', category: 'Behind the scenes' },
  { title: 'Sprzęt, który zabieram w góry na nagrania', category: 'Sprzęt' },
  { title: 'Od wejścia na szczyt do gotowego montażu', category: 'Proces' },
]

const mobileNavLinks = [
  { href: '#map', label: 'Mapa' },
  { href: '#films', label: 'Filmy' },
  { href: '#expeditions', label: 'Wyprawy' },
  { href: '#gallery', label: 'Galeria' },
  { href: '#about', label: 'O mnie' },
  { href: '#contact', label: 'Kontakt' },
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
  const [activeCollectionSlug, setActiveCollectionSlug] = React.useState(null)
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(null)
  const activeCollection = React.useMemo(
    () => contentData.galleriesBySlug[activeCollectionSlug] ?? null,
    [activeCollectionSlug]
  )
  const activeCollectionPhotos = React.useMemo(
    () => (activeCollection ? activeCollection.photos.map((photo) => ({ ...photo, group: activeCollection.title })) : []),
    [activeCollection]
  )
  const activePhoto = activePhotoIndex === null ? null : activeCollectionPhotos[activePhotoIndex]
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
  const touchStartX = React.useRef(0)
  const touchStartY = React.useRef(0)


  const showPreviousPhoto = React.useCallback(() => {
    setActivePhotoIndex((current) => (current - 1 + activeCollectionPhotos.length) % activeCollectionPhotos.length)
  }, [activeCollectionPhotos.length])

  const showNextPhoto = React.useCallback(() => {
    setActivePhotoIndex((current) => (current + 1) % activeCollectionPhotos.length)
  }, [activeCollectionPhotos.length])

  const handleLightboxTouchStart = (event) => {
    const touch = event.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleLightboxTouchEnd = (event) => {
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current

    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return

    if (deltaX < 0) showNextPhoto()
    if (deltaX > 0) showPreviousPhoto()
  }


  React.useEffect(() => {
    setActivePhotoIndex(null)
  }, [activeCollectionSlug])
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
    if (!isMobileMenuOpen && activePhotoIndex === null) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setActivePhotoIndex(null)
      }
      if (activePhotoIndex !== null && event.key === 'ArrowLeft') {
        showPreviousPhoto()
      }
      if (activePhotoIndex !== null && event.key === 'ArrowRight') {
        showNextPhoto()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activePhotoIndex, isMobileMenuOpen, showNextPhoto, showPreviousPhoto])

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

  const openCollectionFromExpedition = () => {
    if (!activeExpeditionCollection) {
      window.location.hash = '#gallery'
      return
    }

    setActiveCollectionSlug(activeExpeditionCollection.slug)
    window.location.hash = '#gallery'
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
              <div className="heroBadge">Cinek Zielu</div>
              <div className="heroCaption">
                <h2>Marcin Zieliński</h2>
                <p>Góry, podróże i filmowe kadry z miejsc, do których wracam myślami.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="section sectionDarker reveal"><div className="container"><SectionHeader label="MAPA WYPRAW" title="Interaktywna mapa wypraw" text="Hierarchia: Świat → kontynent → kraj/region → Tatry/szczyty." /><MapAtlas atlasPath={atlasPath} setAtlasPath={setAtlasPath} activeNode={activeNode} atlasLookups={atlasLookups} /></div></section>

      <section id="films" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
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
                <div className="featuredExpeditionLocation"><MapPin size={13} /> {expedition.featuredDirectionLocation}</div>
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
            label="Wyprawy"
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
                  <button className="smallButton" type="button" onClick={openCollectionFromExpedition}>
                    Otwórz pełną kolekcję
                  </button>
                </div>
                {hasExpeditionGallery ? (
                  <div className="expeditionGalleryGrid">
                    {expeditionGalleryPhotos.map((photo, index) => (
                      <figure
                        className={`expeditionPhotoCard ${photo.format === 'portrait' ? 'portrait' : ''}`}
                        key={`${activeExpeditionCollection.slug}-${photo.title}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Otwórz podgląd zdjęcia: ${photo.title}`}
                        onClick={() => {
                          setActiveCollectionSlug(activeExpeditionCollection.slug)
                          setActivePhotoIndex(index)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setActiveCollectionSlug(activeExpeditionCollection.slug)
                            setActivePhotoIndex(index)
                          }
                        }}
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
                    <p className="expeditionLocation">{expedition.cardLocation}</p>
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

      <section id="gallery" className="section reveal">
        <div className="container">
          <SectionHeader
            label="Galeria"
            title="Zdjęcia z miejsc, które najmocniej zapamiętałem"
            text="Jasna strona tych samych wypraw: więcej światła, detali i momentów, które trudno oddać samym filmem."
          />
          {!activeCollection && (
            <div className="collectionGrid">
              {contentData.galleries.map((collection) => (
                <article className="collectionCard" key={collection.slug}>
                  <div className="collectionCoverWrap">
                    <img src={collection.cover} alt={collection.title} className="collectionCover" />
                  </div>
                  <div className="collectionBody">
                    <div className="collectionTop">
                      <h3>{collection.title}</h3>
                      <span>{collection.photos.length} zdjęć</span>
                    </div>
                    <p>{collection.description}</p>
                    <div className="collectionTags">
                      {collection.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <button className="smallButton" type="button" onClick={() => setActiveCollectionSlug(collection.slug)}>
                      Otwórz kolekcję
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeCollection && (
            <div className="galleryCollectionView">
              <div className="galleryCollectionTop">
                <div>
                  <p className="galleryBreadcrumb">Galeria / {activeCollection.title}</p>
                  <h3>{activeCollection.title}</h3>
                </div>
                <button className="smallButton" type="button" onClick={() => setActiveCollectionSlug(null)}>
                  Wróć do galerii
                </button>
              </div>

              <div className="galleryGrid">
                {activeCollection.photos.map((photo, index) => (
                  <figure
                    className={`photoCard ${photo.format === 'portrait' ? 'portrait' : ''} ${
                      index === 0 && activeCollection.title === 'Szwajcaria' ? 'featured' : ''
                    }`}
                    key={`${activeCollection.slug}-${photo.title}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Otwórz podgląd zdjęcia: ${photo.title}`}
                    onClick={() => setActivePhotoIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setActivePhotoIndex(index)
                      }
                    }}
                  >
                    <img src={photo.src} alt={photo.title} />
                    <figcaption>{photo.title}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {activePhoto && (
        <div className="lightboxOverlay" onClick={() => setActivePhotoIndex(null)}>
          <div
            className="lightboxContent"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button className="lightboxClose" type="button" aria-label="Zamknij podgląd" onClick={() => setActivePhotoIndex(null)}>
              <X size={20} />
            </button>
            <div className="lightboxTopBar" aria-hidden="true">
              <span className="lightboxBrand">Cinek Zielu / Galeria</span>
              <span className="lightboxCounter">
                {activePhotoIndex + 1} / {activeCollectionPhotos.length}
              </span>
            </div>
            <button
              className="lightboxArrow lightboxArrowLeft"
              type="button"
              aria-label="Poprzednie zdjęcie"
              onClick={showPreviousPhoto}
            >
              <ChevronLeft size={24} />
            </button>
            <img
              key={activePhoto.src}
              className="lightboxImage"
              src={activePhoto.src}
              alt={activePhoto.title}
            />
            <button
              className="lightboxArrow lightboxArrowRight"
              type="button"
              aria-label="Następne zdjęcie"
              onClick={showNextPhoto}
            >
              <ChevronRight size={24} />
            </button>
            <div className="lightboxCaption">
              <span>{activePhoto.group}</span>
              <p>{activePhoto.title}</p>
            </div>
          </div>
        </div>
      )}

      <section id="places" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            label="Miejsca"
            title="Każde miejsce ma trochę inny kolor, tempo i klimat"
            text="Baza zostaje ciemna i filmowa, ale konkretne miejsca mogą mieć własny akcent: Tatry chłodniejsze, Szwajcaria bardziej zielona, Maroko cieplejsze."
          />
          <div className="placeGrid">
            {places.map((place) => (
              <article className="placeCard" key={place.title}>
                <div className={`placeVisual ${place.className}`}>
                  <div>
                    <span>{place.meta}</span>
                    <h3>{place.title}</h3>
                  </div>
                </div>
                <p>{place.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section reveal">
        <div className="container aboutProfile">
          <div className="aboutLead">
            <div className="cardType">Kim jestem</div>
            <h2>Najpierw idę w teren. Potem buduję z tego historię.</h2>
            <p className="aboutIntro">
              Cinek Zielu to moja osobista marka twórcy outdoorowego — oparta na realnej drodze, nie na pozowaniu pod przygodę.
            </p>
            <div className="aboutPillars">
              <span>Góry</span>
              <span>Podróże</span>
              <span>Film</span>
              <span>Fotografia</span>
            </div>
          </div>
          <div className="aboutEditorial">
            <p>
              Jestem Marcin Zieliński i działam jako <strong>Cinek Zielu</strong>. Najbliżej mi do gór: tam wszystko jest
              prostsze, surowsze i bardziej prawdziwe. Właśnie w takim klimacie najczęściej tworzę.
            </p>
            <p>
              Podróże traktuję jak drogę, nie checklistę. Interesuje mnie tempo miejsca, światło, ludzie po trasie i momenty,
              które dzieją się między planem a celem.
            </p>
            <p>
              Film i zdjęcia są dla mnie sposobem, żeby zatrzymać klimat wyprawy — nie tylko sam szczyt, ale też napięcie,
              zmęczenie i ciszę. Dlatego ta strona to nie zbiór wyjazdów, tylko historie z miejsc, które naprawdę coś zostawiły.
            </p>
            <div className="aboutWhatICreate">
              <p className="storyLabel">Na tej stronie znajdziesz</p>
              <ul>
                <li>wyprawy</li>
                <li>filmy</li>
                <li>zdjęcia</li>
                <li>historie z miejsc</li>
              </ul>
            </div>
            <p className="aboutCta">
              Jeśli chcesz zobaczyć więcej albo pogadać o współpracy, przejdź do kontaktu.
            </p>
          </div>
          <aside className="aboutVisualCard" aria-label="Portret twórcy">
            <img src={img('hero.jpg')} alt="Cinek Zielu w górskim krajobrazie" />
            <div>
              <p className="storyLabel">Manifest twórcy</p>
              <p>
                Tworzę materiały outdoorowe w filmowym stylu, ale punktem wyjścia zawsze jest prawdziwe doświadczenie miejsca.
              </p>
            </div>
          </aside>
        </div>
      </section>


      <section id="gear" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            label="Sprzęt i kulisy"
            title="Sprzęt i kulisy tworzenia"
            text="Czym pracuję to tylko część historii. Najważniejsze jest to, jak sprzęt pomaga oddać klimat miejsca, drogę i emocje, które dzieją się między kadrami."
          />
          <div className="gearGrid">
            {creativeGear.map((item) => (
              <article className="gearCard" key={item.title}>
                <span className="gearLabel">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
          <div className="workflowBox" aria-label="Jak wygląda proces tworzenia">
            <p className="storyLabel">Workflow</p>
            <h3>Jak wygląda proces</h3>
            <div className="workflowSteps">
              {workflowSteps.map((step, index) => (
                <article className="workflowStep" key={step.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            label="Formaty"
            title="Różne formy jednej opowieści"
            text="Nie każdy materiał musi działać tak samo. Czasem historia potrzebuje dłuższego filmu, czasem krótkiego cinematic edit, a czasem jednego mocnego Reelsa."
          />
          <div className="formatGrid">
            {formats.map((item, index) => (
              <div className="formatCard" key={item.title}>
                <div className="number">0{index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section sectionDarker reveal">
        <div className="container contactHub">
          <div className="contactIntro">
            <div className="cardType">Współpraca i kontakt</div>
            <h2>Jeśli chcesz porozmawiać o projekcie, wyprawie albo filmie — zapraszam.</h2>
            <p>
              Najłatwiej odezwać się przez social media — tam jestem na bieżąco i tam najszybciej odpowiadam w sprawie wspólnych projektów.
            </p>
            <div className="contactIntroNote">Najlepiej napisać na Instagramie. YouTube i TikTok to miejsce na pełniejsze portfolio materiałów.</div>
          </div>

          <div className="contactSocials">
            <a className="socialCard" href={socials.instagram} target="_blank" rel="noreferrer">
              <span>Instagram</span>
              <strong>Kulisy wypraw i codzienne kadry</strong>
            </a>
            <a className="socialCard" href={socials.youtube} target="_blank" rel="noreferrer">
              <span>YouTube</span>
              <strong>Dłuższe filmy i cinematic opowieści</strong>
            </a>
            <a className="socialCard" href={socials.tiktok} target="_blank" rel="noreferrer">
              <span>TikTok</span>
              <strong>Krótkie formy, tempo i momenty z trasy</strong>
            </a>
          </div>

          <div className="contactCollab">
            <h3>Projekty, które tworzę</h3>
            <ul>
              <li>Wyprawy i dokumentacja terenowa</li>
              <li>Filmy, short form i outdoor storytelling</li>
              <li>Zdjęcia i wizualne historie z miejsc</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            label="Aktualności"
            title="Notatki z drogi, kulisy i przyszłe projekty"
            text="Ta sekcja może działać spokojniej niż social media — jako miejsce na zapowiedzi większych filmów, opisy wypraw, kulisy montażu i rzeczy, które nie mieszczą się w krótkim poście."
          />
          <div className="postGrid">
            {blogPosts.map((post) => (
              <article className="postCard" key={post.title}>
                <div className="cardType">{post.category}</div>
                <h3>{post.title}</h3>
                <p>
                  Miejsce na przyszłe wpisy: krótkie podsumowania wyjazdów, notatki po filmach, sprzęt, plany i kulisy tworzenia.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footerSignature">
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
            <a className="footerAnchor" href="#contact">Kontakt i współpraca</a>
            <p className="footerCopyright">© {new Date().getFullYear()} Cinek Zielu</p>
          </div>
        </div>
      </footer>
    </main>
  )
}


function SectionHeader({ label, title, text }) {
  return (
    <header className="sectionHeader">
      <div className="cardType">{label}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  )
}

function InfoCard({ title, text }) {
  return (
    <article className="infoCard">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

createRoot(document.getElementById('root')).render(<App />)
