import React, { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Copy, Move, Plus, Save, Trash2 } from 'lucide-react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { photographyCollections } from '../data/portfolioData'
import { SITE_ORIGIN } from '../data/siteMetadata'
import {
  STORAGE_KEY, WALL_WIDTH, WALL_HEIGHT, wallPhotos, wallPhotoById,
  WALL_COLORS, FRAME_COLORS, PRINT_FORMATS, LAYOUTS, frameDimensions,
  clampFrame, createLayout, normalizeWallConfig, serializeWallConfig,
  parseWallConfig, wallSharePath, buildWallInquiry,
} from '../data/photoWall'
import '../photoWall.css'

const defaultConfig = () => createLayout('triptych')

function ChoiceGroup({ label, choices, value, onChange }) {
  return <fieldset className="cz-wall-fieldset"><legend>{label}</legend>
    <div className="cz-wall-swatches">{choices.map(choice => <button type="button" key={choice.id}
      aria-pressed={value === choice.id} onClick={() => onChange(choice.id)}>
      <span style={{ background: choice.color }} aria-hidden="true" />{choice.label}
    </button>)}</div>
  </fieldset>
}

export function PhotoWall() {
  const [config, setConfig] = useState(defaultConfig)
  const [selected, setSelected] = useState(0)
  const [layout, setLayout] = useState('triptych')
  const [collection, setCollection] = useState('all')
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(null)
  const [shareLink, setShareLink] = useState('')
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [origin, setOrigin] = useState('')
  const scene = useRef(null)
  const drag = useRef(null)
  const frameButtons = useRef([])
  const active = config.frames[selected] || config.frames[0]
  const photo = wallPhotoById.get(active.photoId)
  const wall = WALL_COLORS.find(item => item.id === config.wall)
  const frameColor = FRAME_COLORS.find(item => item.id === config.frame)
  const photos = collection === 'all' ? wallPhotos : wallPhotos.filter(item => item.collectionIds.includes(collection))

  useEffect(() => {
    setOrigin(window.location.origin)
    let previousSearch = window.location.search
    const loadLink = event => {
      // Hash links (including the mobile preview shortcut) must retain edits.
      if (event && window.location.search === previousSearch) return
      previousSearch = window.location.search
      const params = new URLSearchParams(window.location.search)
      if (!params.has('uklad')) {
        setConfig(defaultConfig()); setSelected(0); setLayout('triptych'); setShareLink(''); setInquiryOpen(false)
        return
      }
      const shared = parseWallConfig(params.get('uklad'))
      if (shared) {
        setConfig(shared); setSelected(0); setLayout(''); setShareLink(''); setInquiryOpen(false)
        setMessage('Wczytano kompozycję z linku. Możesz ją teraz zmienić.')
      } else {
        setConfig(defaultConfig()); setSelected(0); setLayout('triptych'); setShareLink(''); setInquiryOpen(false)
        setMessage('Ten link zawiera nieprawidłowy układ. Pokazuję kompozycję początkową.')
      }
    }
    loadLink()
    try { setSaved(parseWallConfig(window.localStorage.getItem(STORAGE_KEY))) } catch { /* Saving remains optional. */ }
    window.addEventListener('popstate', loadLink)
    return () => window.removeEventListener('popstate', loadLink)
  }, [])

  const change = updater => {
    setConfig(current => normalizeWallConfig(typeof updater === 'function' ? updater(current) : updater) || current)
    setMessage(''); setShareLink(''); setInquiryOpen(false)
  }
  const updateFrame = (index, update) => {
    change(current => ({ ...current, frames: current.frames.map((item, i) => i === index ? clampFrame({ ...item, ...update }, current.mat) : item) }))
    setLayout('')
  }
  const move = (dx, dy, index = selected) => {
    change(current => ({ ...current, frames: current.frames.map((item, i) => i === index ? clampFrame({ ...item, x: item.x + dx, y: item.y + dy }, current.mat) : item) }))
    setLayout('')
  }
  const removeFrame = (index = selected) => {
    if (config.frames.length === 1) return
    const next = Math.min(index, config.frames.length - 2)
    change(current => ({ ...current, frames: current.frames.filter((_, i) => i !== index) }))
    setSelected(next); setLayout('')
    window.requestAnimationFrame(() => frameButtons.current[next]?.focus({ preventScroll: true }))
  }
  const addFrame = () => {
    if (config.frames.length >= 6) return
    const nextPhoto = wallPhotos.find(item => !config.frames.some(frame => frame.photoId === item.id)) || wallPhotos[0]
    const next = config.frames.length
    change(current => ({ ...current, frames: [...current.frames, clampFrame({ photoId: nextPhoto.id, format: '40x30', x: 50, y: 65 }, current.mat)] }))
    setSelected(next); setLayout('')
    window.requestAnimationFrame(() => frameButtons.current[next]?.focus({ preventScroll: true }))
  }
  const selectLayout = id => {
    change(current => createLayout(id, current)); setLayout(id); setSelected(0)
  }
  const onPointerDown = (event, index) => {
    if (!event.isPrimary || event.button !== 0) return
    const bounds = scene.current?.getBoundingClientRect()
    if (!bounds?.width || !bounds.height) return
    setSelected(index)
    drag.current = { pointerId: event.pointerId, index, startX: event.clientX, startY: event.clientY,
      x: config.frames[index].x, y: config.frames[index].y, width: bounds.width, height: bounds.height }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = event => {
    const movement = drag.current
    if (!movement || movement.pointerId !== event.pointerId) return
    const dx = event.clientX - movement.startX, dy = event.clientY - movement.startY
    if (Math.abs(dx) + Math.abs(dy) < 3) return
    updateFrame(movement.index, { x: movement.x + dx / movement.width * 100, y: movement.y + dy / movement.height * 100 })
  }
  const endDrag = () => { drag.current = null }
  const onFrameKey = (event, index) => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    if (directions[event.key]) {
      event.preventDefault()
      const [x, y] = directions[event.key], step = event.shiftKey ? 5 : 1
      move(x * step, y * step, index)
      const moved = clampFrame({ ...config.frames[index], x: config.frames[index].x + x * step, y: config.frames[index].y + y * step }, config.mat)
      setMessage(`Ramka ${index + 1}: ${Math.round(moved.x)}% szerokości, ${Math.round(moved.y)}% wysokości ściany.`)
    } else if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removeFrame(index) }
  }
  const save = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, serializeWallConfig(config)); setSaved(config)
      setMessage('Zapisano układ w tej przeglądarce. Wrócisz do niego przyciskiem „Wczytaj zapisany”.')
    } catch { setMessage('Nie udało się zapisać układu w tej przeglądarce. Zachowaj go, kopiując link.') }
  }
  const share = async () => {
    const url = window.location.origin + wallSharePath(config)
    setShareLink(url)
    try {
      await navigator.clipboard.writeText(url)
      setMessage('Link skopiowany. Odtworzy fotografie, ramki i ich układ.')
    } catch { setMessage('Zaznacz i skopiuj link z pola poniżej.') }
  }
  const inquiry = buildWallInquiry(config, origin || SITE_ORIGIN)

  return <CollectionShell section="fotografia" detail className="cz-galleries cz-wall-studio">
    <header className="cz-wall-intro">
      <div><a href="/fotografia" className="cz-wall-eyebrow">Fotografia / Studio</a>
        <h1>Z drogi.<br /><span>Na Twoją ścianę.</span></h1></div>
      <p>Wybierz moje fotografie i ułóż je po swojemu.<br />Sprawdź, które kadry dobrze wyglądają razem.</p>
    </header>
    <noscript><p>Do układania ramek włącz JavaScript. <a href="/fotografia">Zobacz portfolio fotografii.</a></p></noscript>
    <div className="cz-wall-workspace">
      <section id="kompozycja" className="cz-wall-preview" aria-labelledby="cz-wall-preview-title">
        <div className="cz-wall-preview-top"><h2 id="cz-wall-preview-title">Twoja kompozycja</h2><span>{config.frames.length} / 6 ramek</span></div>
        <div ref={scene} className={`cz-wall-scene is-${config.wall}`} style={{ '--wall-color': wall.color }}
          role="group" aria-label="Podgląd ściany z fotografiami" aria-describedby="cz-wall-help">
          <div className="cz-wall-light" aria-hidden="true" />
          {config.frames.map((item, index) => {
            const image = wallPhotoById.get(item.photoId), dimensions = frameDimensions(item, config.mat)
            return <button key={index} type="button" ref={element => { frameButtons.current[index] = element }}
              className={`cz-wall-art${selected === index ? ' is-selected' : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${dimensions.width / WALL_WIDTH * 100}%`,
                height: `${dimensions.height / WALL_HEIGHT * 100}%`, '--frame-color': frameColor.color,
                padding: `${100 / WALL_WIDTH}%`, '--mat-inset': config.mat ? `${300 / (dimensions.width - 2)}%` : '0' }}
              aria-label={`Ramka ${index + 1}: ${image.title}. ${item.format.replace('x', ' × ')} cm.`}
              aria-pressed={selected === index} onClick={() => setSelected(index)} onFocus={() => setSelected(index)}
              onKeyDown={event => onFrameKey(event, index)} onPointerDown={event => onPointerDown(event, index)}
              onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
              <span className="cz-wall-mat"><ResponsivePhoto photo={image} sizes="(max-width:600px) 38vw, 300px" draggable={false} /></span>
              <span className="cz-wall-art-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </button>
          })}
          <div className="cz-wall-room" aria-hidden="true"><div className="cz-wall-console"><i /><i /><i /></div><div className="cz-wall-vase" /><div className="cz-wall-books" /></div>
          <span className="cz-wall-signature" aria-hidden="true">CINEK ZIELU / FOTOGRAFIA</span>
        </div>
        <div className="cz-wall-preview-bottom"><p id="cz-wall-help"><Move size={14} aria-hidden="true" />Wybierz ramkę i przesuń ją. Klawiatura: strzałki.</p><span>Ściana poglądowa 300 × 200 cm</span></div>
        <div className="cz-wall-layouts" role="group" aria-label="Gotowe układy">
          {LAYOUTS.map(item => <button type="button" key={item.id} onClick={() => selectLayout(item.id)} aria-pressed={layout === item.id}>
            <span className={`cz-wall-layout-icon is-${item.id}`} aria-hidden="true">{Array.from({ length: item.count }, (_, i) => <i key={i} />)}</span>
            <span>{item.label}</span>
          </button>)}
        </div>
      </section>
      <aside className="cz-wall-controls" aria-label="Ustawienia kompozycji">
        <div className="cz-wall-control-heading"><span>01 — Oprawa</span><h2>Małe detale.<br /> Inny charakter.</h2></div>
        <ChoiceGroup label="Kolor ściany" choices={WALL_COLORS} value={config.wall} onChange={id => change(current => ({ ...current, wall: id }))} />
        <ChoiceGroup label="Kolor ram" choices={FRAME_COLORS} value={config.frame} onChange={id => change(current => ({ ...current, frame: id }))} />
        <label className="cz-wall-checkbox"><input type="checkbox" checked={config.mat} onChange={event => change(current => ({ ...current, mat: event.target.checked }))} />Białe passe-partout</label>
        <div className="cz-wall-active">
          <div className="cz-wall-active-heading"><h3>Ramka {String(selected + 1).padStart(2, '0')}</h3><span>z {config.frames.length}</span></div>
          <p className="cz-wall-photo-name">{photo.title}</p>
          <label className="cz-wall-select-label" htmlFor="cz-wall-format">Format fotografii <span>cm</span></label>
          <select id="cz-wall-format" value={active.format} onChange={event => updateFrame(selected, { format: event.target.value })}>
            {PRINT_FORMATS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <div className="cz-wall-position"><span>Przesuń ramkę</span><div role="group" aria-label="Przesuń wybraną ramkę">
            {[[ArrowLeft, -2, 0, 'W lewo'], [ArrowUp, 0, -2, 'W górę'], [ArrowDown, 0, 2, 'W dół'], [ArrowRight, 2, 0, 'W prawo']].map(([Icon, x, y, label]) => <button type="button" key={label} aria-label={label} onClick={() => move(x, y)}><Icon size={17} aria-hidden="true" /></button>)}
          </div></div>
          <div className="cz-wall-frame-actions"><button type="button" onClick={addFrame} disabled={config.frames.length >= 6}><Plus size={15} aria-hidden="true" />Dodaj ramkę</button><button type="button" onClick={() => removeFrame()} disabled={config.frames.length <= 1}><Trash2 size={15} aria-hidden="true" />Usuń</button></div>
        </div>
        <p className="cz-wall-note">Pełny kadr, bez przycinania. Format dotyczy fotografii; rama i passe-partout powiększają jej obrys.</p>
      </aside>
    </div>
    <section className="cz-wall-library" aria-labelledby="cz-wall-library-title">
      <div className="cz-wall-library-heading"><div><span className="cz-wall-eyebrow">02 — Fotografie</span><h2 id="cz-wall-library-title">Wybierz kadr do ramki {String(selected + 1).padStart(2, '0')}.</h2></div><a className="cz-wall-back-to-preview" href="#kompozycja">Zobacz kompozycję ↑</a><span>{photos.length} fotografii</span></div>
      <div className="cz-wall-filters" role="group" aria-label="Kolekcja fotografii">
        {[{ id: 'all', title: 'Wszystkie' }, ...photographyCollections].map(item => <button type="button" key={item.id} aria-pressed={collection === item.id} onClick={() => setCollection(item.id)}>{item.title}</button>)}
      </div>
      <div className="cz-wall-photo-strip">{photos.map(item => <button type="button" key={item.id} className="cz-wall-photo-choice"
        onClick={() => { updateFrame(selected, { photoId: item.id }); setMessage(`Fotografia w ramce ${selected + 1} została zmieniona.`) }}
        aria-label={`Wstaw do ramki ${selected + 1}: ${item.title}`} aria-pressed={active.photoId === item.id}>
        <ResponsivePhoto photo={item} sizes="180px" loading="lazy" /><span>{item.title}</span>
        {config.frames.some(frame => frame.photoId === item.id) && <small>Na ścianie</small>}
      </button>)}</div>
    </section>
    <section className="cz-wall-finish" aria-labelledby="cz-wall-finish-title">
      <div><span className="cz-wall-eyebrow">03 — Twój zestaw</span><h2 id="cz-wall-finish-title">Zachowaj ten widok.</h2><p>Zapisz kompozycję lub podziel się nią linkiem.</p></div>
      <div className="cz-wall-save-actions"><button type="button" onClick={save}><Save size={16} aria-hidden="true" />Zapisz układ</button>
        <button type="button" onClick={share}><Copy size={16} aria-hidden="true" />Kopiuj link</button>
        {saved && <button type="button" className="cz-wall-load" onClick={() => { change(saved); setSelected(0); setLayout(''); setMessage('Wczytano zapisany układ.') }}>Wczytaj zapisany</button>}
      </div>
      <p className="cz-wall-status" role="status" aria-live="polite">{message}</p>
      {shareLink && <label className="cz-wall-share-field">Link do tej kompozycji<input readOnly value={shareLink} onFocus={event => event.target.select()} /></label>}
      <div className="cz-wall-inquiry"><div><h3>Chcesz mieć te kadry u siebie?</h3><p>Przygotuj zapytanie o odbitki wybranych fotografii.<br />Dostępne formaty i szczegóły ustalimy w wiadomości.</p></div>
        <button type="button" className="cz-wall-primary" aria-expanded={inquiryOpen} aria-controls="cz-wall-inquiry-details" onClick={() => setInquiryOpen(value => !value)}>Zapytaj o ten zestaw <span aria-hidden="true">↗</span></button>
      </div>
      {inquiryOpen && <div id="cz-wall-inquiry-details" className="cz-wall-inquiry-details">
        <h3>Twoje zapytanie</h3><p>Sprawdź zestaw, a następnie otwórz wiadomość w swojej poczcie.</p>
        <ol>{config.frames.map((item, index) => <li key={index}><span>{wallPhotoById.get(item.photoId).title}</span><strong>{item.format.replace('x', ' × ')} cm</strong></li>)}</ol>
        <p>Ramy: {frameColor.label.toLowerCase()} · Passe-partout: {config.mat ? 'białe' : 'bez'}</p>
        <a href={inquiry.href} className="cz-wall-primary">Otwórz wiadomość e-mail ↗</a>
        <label className="cz-wall-share-field">Treść do skopiowania<textarea readOnly rows={7} value={inquiry.body} onFocus={event => event.target.select()} /></label>
      </div>}
      <p className="cz-wall-disclaimer">Wizualizacja jest poglądowa. Kolory i proporcje we wnętrzu mogą się różnić. Zapis układu pozostaje w tej przeglądarce.</p>
    </section>
  </CollectionShell>
}
