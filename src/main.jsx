import React from 'react'
import { createRoot } from 'react-dom/client'
import { Camera, Menu, Play, X } from 'lucide-react'
import './styles.css'

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

const travelMap = [
  {
    place: 'Tatry',
    country: 'Polska / Słowacja',
    type: 'zimowe wejścia, szczyty, vlogi i bardziej surowy górski klimat',
    coords: '49.2°N, 20.0°E',
    accent: 'Kamień / śnieg',
    children: ['Łomnica', 'Kościelec', 'Gerlach', 'Durny Szczyt', 'Świnica'],
  },
  {
    place: 'Szwajcaria',
    country: 'Alpy',
    type: 'jeziora, zielone doliny, cinematic short films, zdjęcia i spokojniejsze formy',
    coords: '46.8°N, 8.2°E',
    accent: 'Zieleń / mgła',
    children: ['Interlaken', 'Zermatt', 'Stoos', 'Augstmatthorn', 'Fronalpstock'],
  },
  {
    place: 'Maroko',
    country: 'Afryka Północna',
    type: 'podróż, pustynia, Atlas, trekking i pierwszy większy wyjazd poza Europę',
    coords: '31.6°N, 7.9°W',
    accent: 'Piasek / słońce',
    children: ['Marrakesz', 'Sahara', 'Atlas', 'Toubkal', 'Agafay'],
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

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMobileMenuOpen])

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

      <section id="map" className="section sectionDarker reveal">
        <div className="container">
          <SectionHeader
            label="Mapa wypraw"
            title="Od mapy świata do konkretnego szczytu"
            text="Docelowo ta sekcja może działać jak interaktywna mapa podróży: najpierw świat, potem Europa, później konkretne regiony, szczyty, filmy i galerie."
          />
          <div className="mapLayout">
            <div className="mapPanel">
              <div className="mapTop">
                <div>
                  <div className="cardType">Travel layers</div>
                  <div className="mapFutureNote">Docelowo interaktywna mapa wypraw i filmów</div>
                  <h3>Świat → Europa → Region → Film</h3>
                </div>
                <div className="chips">
                  <span>Świat</span>
                  <span>Europa</span>
                  <span>Tatry</span>
                </div>
              </div>
              <div className="mapCanvas" aria-label="Symboliczna mapa podróży">
                <svg viewBox="0 0 900 500">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="route" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="rgba(200,132,78,0.55)" />
                      <stop offset="50%" stopColor="rgba(166,176,132,0.55)" />
                      <stop offset="100%" stopColor="rgba(232,216,184,0.55)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M90 270 C160 190 260 180 345 225 C420 265 480 230 548 180 C640 112 762 150 820 245 C760 238 710 270 650 296 C560 335 450 310 365 300 C250 286 170 330 90 270Z"
                    fill="rgba(120,104,82,0.22)"
                    stroke="rgba(214,198,168,0.22)"
                    strokeWidth="2"
                  />
                  <path
                    d="M285 185 C322 142 386 138 435 168 C482 197 507 246 488 292 C452 271 398 264 357 284 C323 259 285 231 285 185Z"
                    fill="rgba(120,104,82,0.30)"
                    stroke="rgba(214,198,168,0.24)"
                    strokeWidth="2"
                  />
                  <path
                    d="M485 250 C548 214 608 228 640 282 C603 318 542 330 492 304 C468 288 466 264 485 250Z"
                    fill="rgba(120,104,82,0.24)"
                    stroke="rgba(214,198,168,0.22)"
                    strokeWidth="2"
                  />
                  <g filter="url(#glow)">
                    <circle cx="455" cy="205" r="7" fill="#e8d8b8" />
                    <circle cx="455" cy="205" r="18" fill="none" stroke="rgba(232,216,184,0.45)" />
                    <text x="475" y="210" fill="#e8d8b8" fontSize="18">
                      Tatry
                    </text>
                    <circle cx="430" cy="240" r="7" fill="#a6b084" />
                    <circle cx="430" cy="240" r="18" fill="none" stroke="rgba(166,176,132,0.42)" />
                    <text x="450" y="245" fill="#a6b084" fontSize="18">
                      Szwajcaria
                    </text>
                    <circle cx="365" cy="305" r="7" fill="#c8844e" />
                    <circle cx="365" cy="305" r="18" fill="none" stroke="rgba(200,132,78,0.42)" />
                    <text x="385" y="310" fill="#c8844e" fontSize="18">
                      Maroko
                    </text>
                  </g>
                  <path
                    d="M365 305 C390 270 410 250 430 240 C440 225 448 215 455 205"
                    fill="none"
                    stroke="url(#route)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                  <text x="64" y="438" fill="rgba(214,198,168,0.42)" fontSize="14">
                    Docelowo: kliknięcie w punkt otwiera listę filmów, zdjęć i konkretnych miejsc.
                  </text>
                </svg>
              </div>
            </div>

            <div className="mapCards">
              {travelMap.map((item) => (
                <div className="mapCard" key={item.place}>
                  <div className="mapCardTop">
                    <div>
                      <h3>{item.place}</h3>
                      <span>{item.country}</span>
                    </div>
                    <small>{item.coords}</small>
                  </div>
                  <p>{item.type}</p>
                  <div className="cardType">{item.accent}</div>
                  <div className="tagWrap">
                    {item.children.map((child) => (
                      <span key={child}>{child}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
    <div className="sectionHeader">
      <div>
        <div className="cardType">{label}</div>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  )
}

function InfoCard({ title, text }) {
  return (
    <div className="infoCard">
      <div className="cardType">{title}</div>
      <p>{text}</p>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
