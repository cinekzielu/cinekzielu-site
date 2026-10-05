import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, MapPin, Camera, Mountain, Play, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { searchKinds, searchSite } from '../data/siteSearch'
import { resolveFilmLink } from '../data/videoPlayer'
import { VideoPlayer } from './VideoPlayer'
import '../siteTools.css'

const Tools = createContext(null)
const resultIcons = { place:MapPin, gallery:Camera, expedition:Mountain, film:Play }

export function SearchTrigger({ onOpen }) {
  const tools = useContext(Tools)
  return <button type="button" className="cz-search-trigger" aria-label="Szukaj na całej stronie" aria-haspopup="dialog" onClick={event => { onOpen?.(); tools.openSearch(event.currentTarget) }}><Search size={18} aria-hidden="true" /><span>Szukaj</span></button>
}

// Real links keep open-in-new-tab and no-JS behavior. Normal clicks open our player.
export function FilmLink({ href, children, onClick, ...props }) {
  const tools = useContext(Tools)
  return <a {...props} href={href} aria-haspopup={resolveFilmLink(href) ? 'dialog' : undefined} onClick={event => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    if (tools?.play(href, event.currentTarget)) event.preventDefault()
  }}>{children}</a>
}

function SearchResults({ query, filter, setFilter, play }) {
  const [expanded, setExpanded] = useState({})
  useEffect(() => setExpanded({}), [query,filter])
  const results = searchSite(query)
  const groups = searchKinds.slice(1).map(kind => ({...kind, items:results.filter(result => result.kind === kind.id)}))
  const total = filter === 'all' ? results.length : groups.find(group => group.id === filter)?.items.length || 0
  if (!query.trim()) return <div className="cz-search-start"><p>Miejsca, fotografie i filmy z jednej podróży.</p><p className="cz-search-example">Wpisz nazwę miejsca, na przykład Świnica albo Maroko.</p></div>
  return <>
    <div className="cz-search-filters" role="group" aria-label="Rodzaj wyników">{searchKinds.map(kind => <button key={kind.id} type="button" aria-pressed={filter === kind.id} onClick={() => setFilter(kind.id)}>{kind.label}<span>{kind.id === 'all' ? results.length : groups.find(group => group.id === kind.id).items.length}</span></button>)}</div>
    <p className="cz-search-count" role="status" aria-live="polite">{total ? `Wyniki: ${total}` : 'Brak wyników. Spróbuj innej nazwy lub zmień rodzaj wyników.'}</p>
    <div className={`cz-search-results${filter !== 'all' ? ' is-single-kind' : ''}`}>
      {groups.filter(group => group.items.length && (filter === 'all' || group.id === filter)).map(group => <section key={group.id} aria-label={`Wyniki: ${group.label}`}>
        <h3>{group.label}<span>{group.items.length}</span></h3>
        <ul>{group.items.slice(0,expanded[group.id] || (filter === 'all' ? 3 : 10)).map(item => {
          const Icon = resultIcons[item.kind]
          return <li key={item.id}><a className="cz-search-result" href={item.href} aria-haspopup={item.kind === 'film' ? 'dialog' : undefined} onClick={event => {
            if (item.kind !== 'film' || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
            if (play(item.href,event.currentTarget)) event.preventDefault()
          }}>
            <span className={`cz-search-thumb is-${item.kind}`}><Icon size={18} aria-hidden="true" />{item.image && <img src={item.image} alt="" loading="lazy" onError={event => { event.currentTarget.style.display='none' }} />}</span>
            <span className="cz-search-result-text"><strong>{item.title}</strong><small>{item.chapter ? `Oglądaj od ${item.chapter.time} · ${item.subtitle}` : item.subtitle}</small></span>
            {item.kind === 'film' ? <Play size={14} aria-hidden="true" /> : <ArrowUpRight size={14} aria-hidden="true" />}
          </a></li>
        })}</ul>
        {group.items.length > (expanded[group.id] || (filter === 'all' ? 3 : 10)) && <button type="button" className="cz-search-more" onClick={() => setExpanded(current => ({...current, [group.id]:group.items.length}))}>Pokaż pozostałe ({group.items.length-(expanded[group.id] || (filter === 'all' ? 3 : 10))}) ↓</button>}
      </section>)}
    </div>
  </>
}

export function SiteToolsProvider({ children }) {
  const [overlay, setOverlay] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const dialog = useRef(null), searchInput = useRef(null), closeButton = useRef(null), trigger = useRef(null)
  const overlayRef = useRef(overlay)
  overlayRef.current=overlay
  const remember = element => { if (!overlayRef.current) trigger.current=element || document.activeElement }
  const openSearch = element => { remember(element); setOverlay({type:'search'}) }
  const play = (href,element) => {
    const video = resolveFilmLink(href)
    if (!video) return false
    remember(element)
    setOverlay(current => ({type:'film',...video,fromSearch:current?.type === 'search' || Boolean(current?.fromSearch)}))
    return true
  }
  const close = () => setOverlay(null)
  const isOpen = Boolean(overlay)
  useEffect(() => {
    const shortcut = event => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        if (document.querySelector('dialog[open]') && !dialog.current?.open) return
        event.preventDefault()
        const button = document.querySelector('.cz-search-trigger')
        if (button) button.click()
        else openSearch(document.activeElement)
      }
    }
    window.addEventListener('keydown',shortcut)
    return () => window.removeEventListener('keydown',shortcut)
  }, [])
  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current
    const oldBody = document.body.style.overflow, oldRoot = document.documentElement.style.overflow
    document.body.style.overflow='hidden'; document.documentElement.style.overflow='hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow=oldBody; document.documentElement.style.overflow=oldRoot
      if (trigger.current?.isConnected) trigger.current.focus({preventScroll:true})
    }
  }, [isOpen])
  useEffect(() => {
    if (!overlay) return
    const frame = requestAnimationFrame(() => {
      if (dialog.current) dialog.current.scrollTop=0
      ;(overlay.type === 'search' ? searchInput.current : closeButton.current)?.focus({preventScroll:true})
    })
    return () => cancelAnimationFrame(frame)
  }, [overlay?.type])
  return <Tools.Provider value={{openSearch,play}}>{children}{isOpen && createPortal(
    <dialog ref={dialog} className={`cz-site-dialog is-${overlay.type}`} aria-labelledby="site-tools-title" onKeyDown={event => {if (event.key === 'Escape') {event.preventDefault(); close()}}} onCancel={event => {event.preventDefault(); close()}} onClose={close} onClick={event => {
      if (event.target !== event.currentTarget) return
      const r=event.currentTarget.getBoundingClientRect()
      if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) close()
    }}>
      <div className="cz-site-dialog-heading"><div><p>{overlay.type === 'search' ? 'CINEK ZIELU' : 'FILMY Z DROGI'}</p><h2 id="site-tools-title">{overlay.type === 'search' ? 'Szukaj na stronie' : overlay.film.title}</h2></div><button ref={closeButton} type="button" className="cz-site-dialog-close" onClick={close} aria-label={overlay.type === 'search' ? 'Zamknij wyszukiwarkę' : 'Zamknij odtwarzacz'}><X size={20} aria-hidden="true" /></button></div>
      {overlay.type === 'search' ? <>
        <div className="cz-global-search-input"><Search size={21} aria-hidden="true" /><input ref={searchInput} type="search" aria-label="Miejsce, wyprawa lub film" placeholder="Miejsce, wyprawa albo film…" autoComplete="off" value={query} maxLength={100} onChange={event => {setQuery(event.target.value); setFilter('all')}} />{query && <button type="button" aria-label="Wyczyść wyszukiwanie" onClick={() => {setQuery(''); setFilter('all'); searchInput.current?.focus()}}><X size={17} /></button>}</div>
        {!query.trim() && <div className="cz-search-suggestions" aria-label="Przykładowe wyszukiwania">{['Świnica','Maroko','Szwajcaria','Toubkal'].map(text => <button key={text} type="button" onClick={() => {setQuery(text); searchInput.current?.focus()}}>{text} ↗</button>)}</div>}
        <SearchResults query={query} filter={filter} setFilter={setFilter} play={play} />
        <div className="cz-search-help"><span>Esc — zamknij</span><span>Ctrl / ⌘ + K — szukaj</span></div>
      </> : <>
        {overlay.fromSearch && <button className="cz-video-back" type="button" onClick={() => setOverlay({type:'search'})}><ArrowLeft size={14} aria-hidden="true" /> Wróć do wyników</button>}
        <VideoPlayer key={`${overlay.film.youtubeId}/${overlay.start}`} video={overlay} onRestart={() => {setOverlay(current => ({...current,start:0,href:current.film.youtubeUrl})); closeButton.current?.focus({preventScroll:true})}} />
      </>}
    </dialog>,document.body
  )}</Tools.Provider>
}
