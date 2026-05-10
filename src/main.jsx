import React from 'react'
import { createRoot } from 'react-dom/client'
import { Camera, Menu, Play, X } from 'lucide-react'
import './styles.css'
import { travelAtlasData } from './data/travelData'
import { MapAtlas } from './components/MapAtlas'

const socials = {
  youtube: 'https://www.youtube.com/@cinek_zielu',
  instagram: 'https://www.instagram.com/cinek_zielu/',
  tiktok: 'https://www.tiktok.com/@cinek_zielu',
}

const img = (name) => `/images/${name}`

const featuredFilms = [
  {
    title: 'Łomnica 2634 m',
    type: 'Tatry / YouTube vlog',
    desc: 'Wejście na jeden z najbardziej charakterystycznych szczytów Tatr. Górski klimat, trasa, widoki i osobisty zapis wyprawy.',
    link: 'https://www.youtube.com/watch?v=zb8zqv8gpZk&t=5s',
    image: img('lomnica-thumb.png'),
  },
  {
    title: 'Maroko cz. 1',
    type: 'Podróż / Maroko',
    desc: 'Pierwsza część podróży po Maroku — inny klimat, droga, pustynne światło i wejście w zupełnie nową przestrzeń poza Europą.',
    link: 'https://youtu.be/McawfrouM_0',
    image: img('maroko-thumb.png'),
  },
  {
    title: 'Kościelec — Winter Ascent',
    type: 'Cinematic short film',
    desc: 'Bardziej filmowa, atmosferyczna forma z zimowego wejścia. Mocny przykład kierunku cinematic outdoor.',
    link: 'https://youtu.be/QRSSYlhRGMM',
    image: img('koscielec-thumb.jpg'),
  },
]

const galleryGroups = [
  {
    title: 'Tatry',
    desc: 'Szczyty, zimowe wejścia, surowe warunki i górskie historie bliżej domu.',
    accent: 'Kamień / śnieg / stal',
    photos: [
      { title: 'Łomnica 2634 m', src: img('lomnica-thumb.png'), format: 'wide' },
      { title: 'Kościelec — winter ascent', src: img('koscielec-thumb.jpg'), format: 'wide' },
      { title: 'Tatrzańskie warstwy', src: img('tatry-mountains.jpg'), format: 'wide' },
    ],
  },
  {
    title: 'Maroko',
    desc: 'Podróż, pustynia, światło i klimat pierwszej większej przygody poza Europą.',
    accent: 'Piasek / słońce / droga',
    photos: [{ title: 'Maroko cz. 1', src: img('maroko-thumb.png'), format: 'wide' }],
  },
  {
    title: 'Szwajcaria',
    desc: 'Alpejskie krajobrazy, jeziora, mgła, zwierzęta i spokojniejszy filmowy klimat.',
    accent: 'Zieleń / mgła / jeziora',
    photos: [
      { title: 'Krowy w alpejskiej dolinie', src: img('swiss-cows.jpg'), format: 'wide' },
      { title: 'Jezioro i chmury', src: img('swiss-lake.jpg'), format: 'portrait' },
      { title: 'Zielone zbocza', src: img('swiss-village.jpg'), format: 'portrait' },
      { title: 'Kościół wśród gór', src: img('swiss-church.jpg'), format: 'portrait' },
      { title: 'Alpejski szczyt', src: img('alpine-peak.jpg'), format: 'wide' },
      { title: 'Mgła i owce', src: img('fog-sheep.jpg'), format: 'wide' },
      { title: 'Szlak nad jeziorem', src: img('swiss-trail.jpg'), format: 'wide' },
      { title: 'Koziorożec', src: img('ibex-portrait.jpg'), format: 'portrait' },
      { title: 'Koziorożce', src: img('ibex-double.jpg'), format: 'portrait' },
      { title: 'Portret koziorożca', src: img('ibex-close.jpg'), format: 'portrait' },
      { title: 'Alpejski portret', src: img('ibex-strong.jpg'), format: 'portrait' },
    ],
  },
]

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

const blogPosts = [
  { title: 'Jak wygląda tworzenie filmu górskiego od środka', category: 'Behind the scenes' },
  { title: 'Sprzęt, który zabieram w góry na nagrania', category: 'Sprzęt' },
  { title: 'Od wejścia na szczyt do gotowego montażu', category: 'Proces' },
]

const mobileNavLinks = [
  { href: '#films', label: 'Filmy' },
  { href: '#map', label: 'Mapa' },
  { href: '#gallery', label: 'Galeria' },
  { href: '#about', label: 'O mnie' },
  { href: '#contact', label: 'Kontakt' },
]

const mobileMenuVariant = 'A'

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(null)
  const galleryPhotos = React.useMemo(
    () => galleryGroups.flatMap((group) => group.photos.map((photo) => ({ ...photo, group: group.title }))),
    []
  )
  const activePhoto = activePhotoIndex === null ? null : galleryPhotos[activePhotoIndex]
  const [atlasPath, setAtlasPath] = React.useState(['world'])

  const atlasLookups = React.useMemo(() => ({
    continents: Object.fromEntries(travelAtlasData.continents.map((item) => [item.id, item])),
    countries: Object.fromEntries(travelAtlasData.countries.map((item) => [item.id, item])),
    specialRegions: Object.fromEntries(travelAtlasData.specialRegions.map((item) => [item.id, item])),
    places: Object.fromEntries(travelAtlasData.places.map((item) => [item.id, item])),
    summits: Object.fromEntries(travelAtlasData.summits.map((item) => [item.id, item])),
    films: Object.fromEntries(travelAtlasData.films.map((item) => [item.id, item])),
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
    setActivePhotoIndex((current) => (current - 1 + galleryPhotos.length) % galleryPhotos.length)
  }, [galleryPhotos.length])

  const showNextPhoto = React.useCallback(() => {
    setActivePhotoIndex((current) => (current + 1) % galleryPhotos.length)
  }, [galleryPhotos.length])

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
            <h1 className="heroTitle">Moje wyprawy, filmy i historie z miejsc, do których ciągle wracam myślami.</h1>
            <p>
              Chodzę po górach, podróżuję, nagrywam i robię zdjęcia. Czasem wychodzi z tego vlog,
              czasem krótki film, czasem po prostu kilka ujęć, do których sam lubię wracać.
            </p>
            <div className="buttons">
              <a className="button primary" href="#films">
                <Play size={16} /> Zobacz filmy
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
                <p>Góry, podróże, filmy i zdjęcia z przygód, które zostają w głowie na dłużej.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="films" className="section sectionDark reveal">
        <div className="container">
          <SectionHeader
            label="Wybrane filmy"
            title="Trzy wejścia w mój klimat"
            text="Tatry, Maroko i zimowy Kościelec — trzy różne kierunki, ale ten sam rdzeń: droga, miejsce i historia, którą chciałem zapisać."
          />
          <div className="filmGrid">
            {featuredFilms.map((film) => (
              <article className="filmCard" key={film.title}>
                <div className="filmImageWrap">
                  <img src={film.image} alt={film.title} />
                </div>
                <div className="cardType">{film.type}</div>
                <h3>{film.title}</h3>
                <p>{film.desc}</p>
                <a className="smallButton" href={film.link} target="_blank" rel="noreferrer">
                  Obejrzyj film
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="map" className="section sectionDarker reveal"><div className="container"><SectionHeader label="Mapa wypraw" title="Cinematic expedition atlas" text="Hierarchia: Świat → kontynent → kraj → region specjalny / miejsce." /><MapAtlas atlasPath={atlasPath} setAtlasPath={setAtlasPath} activeNode={activeNode} atlasLookups={atlasLookups} /></div></section>

      <section id="gallery" className="section reveal">
        <div className="container">
          <SectionHeader
            label="Galeria"
            title="Zdjęcia z miejsc, które najmocniej zapamiętałem"
            text="Galeria działa jako naturalny kontrast do ciemnej, filmowej strony — więcej światła, zieleni, zwierząt, gór i prawdziwych momentów z wyjazdów."
          />
          <div className="galleryGroups">
            {galleryGroups.map((group) => (
              <div key={group.title} className="galleryGroup">
                <div className="galleryIntro">
                  <div>
                    <div className="cardType">{group.accent}</div>
                    <h3>{group.title}</h3>
                  </div>
                  <p>{group.desc}</p>
                </div>
                <div className="galleryGrid">
                  {group.photos.map((photo, index) => (
                    <figure
                      className={`photoCard ${photo.format === 'portrait' ? 'portrait' : ''} ${
                        index === 0 && group.title === 'Szwajcaria' ? 'featured' : ''
                      }`}
                      key={photo.title}
                      role="button"
                      tabIndex={0}
                      aria-label={`Otwórz podgląd zdjęcia: ${photo.title}`}
                      onClick={() => {
                        const selectedPhotoIndex = galleryPhotos.findIndex((item) => item.src === photo.src)
                        setActivePhotoIndex(selectedPhotoIndex)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          const selectedPhotoIndex = galleryPhotos.findIndex((item) => item.src === photo.src)
                          setActivePhotoIndex(selectedPhotoIndex)
                        }
                      }}
                    >
                      <img src={photo.src} alt={photo.title} />
                      <figcaption>{photo.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
            <button
              className="lightboxArrow lightboxArrowLeft"
              type="button"
              aria-label="Poprzednie zdjęcie"
              onClick={showPreviousPhoto}
            >
              ‹
            </button>
            <img className="lightboxImage" src={activePhoto.src} alt={activePhoto.title} />
            <button
              className="lightboxArrow lightboxArrowRight"
              type="button"
              aria-label="Następne zdjęcie"
              onClick={showNextPhoto}
            >
              ›
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
        <div className="container aboutGrid">
          <div>
            <div className="cardType">O mnie</div>
            <h2>Najpierw jest droga. Dopiero później film, zdjęcia i cała reszta.</h2>
          </div>
          <div className="aboutText">
            <p>
              Nazywam się Marcin Zieliński, a w internecie działam jako <strong>Cinek Zielu</strong>.
              Najczęściej zabieram kamerę i aparat tam, gdzie sam chciałbym wrócić — w góry, na szlaki
              i w miejsca, które mają swój klimat.
            </p>
            <p>
              Nie zawsze chodzi o idealny plan albo wielką produkcję. Czasem wystarczy dobry dzień w górach,
              trochę zmęczenia, dziwna sytuacja po drodze albo widok, który zostaje w głowie dłużej niż zakładałem.
            </p>
            <p>
              Z takich momentów powstają moje vlogi, krótkie filmy, zdjęcia i materiały z podróży. Ta strona ma
              zebrać je w jednym miejscu — bez przesadnego nadęcia, bardziej jako zapis przygód, które naprawdę były moje.
            </p>
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

      <section id="social" className="section reveal">
        <div className="container socialBox">
          <div>
            <div className="cardType">Social media</div>
            <h2>Zobacz moje filmy, krótkie formy i bieżące projekty.</h2>
            <p>
              YouTube, Instagram i TikTok to naturalne przedłużenie strony — tam dzieje się większość nowych filmów,
              zdjęć, rolek i kulis.
            </p>
          </div>
          <div className="socialLinks">
            <a href={socials.youtube} target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href={socials.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={socials.tiktok} target="_blank" rel="noreferrer">
              <Camera size={18} /> TikTok
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="section sectionDarker reveal">
        <div className="container contactBox">
          <div>
            <div className="cardType">Kontakt / współpraca</div>
            <h2>Masz pomysł na film, wyjazd albo współpracę outdoorową?</h2>
            <p>
              Jestem otwarty na projekty związane z górami, podróżami, sprzętem, outdoorowym stylem życia i tworzeniem
              materiałów w naturalnym, filmowym klimacie. Najprościej złapać mnie przez Instagram albo YouTube.
            </p>
            <div className="buttons">
              <a className="button primary" href={socials.instagram} target="_blank" rel="noreferrer">
                Napisz na Instagramie
              </a>
              <a className="button" href={socials.youtube} target="_blank" rel="noreferrer">
                Zobacz YouTube
              </a>
            </div>
          </div>
          <div className="contactDetails">
            <InfoCard title="Zakres" text="filmy • zdjęcia • reels • vlogi • outdoor" />
            <InfoCard title="Klimat" text="góry, podróże, przygoda, naturalny storytelling" />
            <InfoCard title="Kontakt" text="Instagram / YouTube / TikTok" />
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

      <footer>
        <div className="container footerInner">
          <span>Cinek Zielu — portfolio osobiste</span>
          <span>Filmowy, outdoorowy, nowoczesny kierunek wizualny</span>
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
