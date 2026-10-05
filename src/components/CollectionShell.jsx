import React, { useEffect, useId, useRef, useState } from 'react'
import '../galleryStyles.css'
import { SearchTrigger } from './SiteTools'

const sections = [ { id: 'fotografia', label: 'Fotografia' }, { id: 'wyprawy', label: 'Wyprawy' }, { id: 'filmy', label: 'Filmy' }, { id: 'mapa', label: 'Mapa' }, { id: 'galerie', label: 'Galerie' }, { id: 'o-mnie', label: 'O mnie' } ]

export function CollectionShell({ children, section, detail = false, className = '' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menu = useRef(null)
  const toggle = useRef(null)
  useEffect(() => {
    if (!menuOpen) return
    menu.current?.querySelector('a')?.focus()
    const escape = event => {
      if (event.key === 'Escape') { setMenuOpen(false); toggle.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width:901px)')
    const resize = () => { if (desktop.matches) setMenuOpen(false) }
    window.addEventListener('keydown', escape)
    desktop.addEventListener('change', resize)
    return () => { window.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize) }
  }, [menuOpen])
  return <div className={`cz-collection ${className}`}>
    <a className="cz-skip-link" href="#tresc">Przejdź do treści</a>
    <div className="cz-gallery-wrap">
      <header className="cz-gallery-nav">
        <a href="/" className="cz-gallery-brand" aria-label="Cinek Zielu — strona główna">CINEK ZIELU</a>
        <SearchTrigger onOpen={() => setMenuOpen(false)} />
        <button className="cz-collection-menu-toggle" ref={toggle} type="button" aria-controls={menuId} aria-expanded={menuOpen} aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} onClick={() => setMenuOpen(open => !open)}>{menuOpen ? 'Zamknij ×' : 'Menu ☰'}</button>
        <nav id={menuId} ref={menu} className={`cz-collection-nav${menuOpen ? ' is-open' : ''}`} aria-label="Nawigacja strony">
          {sections.map(item => <a key={item.id} href={`/${item.id}`} aria-current={item.id === section && !detail ? 'page' : undefined} className={item.id === section ? 'is-active' : ''}>{item.id === section && detail ? '← ' : ''}{item.label}</a>)}
        </nav>
      </header>
      <main id="tresc">{children}</main>
      <footer className="cz-gallery-footer"><a href="/o-mnie">Marcin Zieliński</a><nav aria-label="Stopka"><a href="/o-mnie#kontakt">Kontakt</a><a href="https://www.youtube.com/@cinek_zielu" target="_blank" rel="noreferrer">YouTube ↗</a></nav></footer>
    </div>
  </div>
}
