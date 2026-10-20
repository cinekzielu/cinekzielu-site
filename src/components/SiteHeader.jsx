import React, { useEffect, useId, useRef, useState } from 'react'
import '../galleryStyles.css'
import { SearchTrigger } from './SiteTools'
import { SavedHeaderLink } from './SavedItems'
import { usePageLocation } from '../PageLocation'
import '../siteHeader.css'
import brandLogo from '../assets/brand/cinek-zielu-logo-biale.svg'

const sections = [ { id: 'fotografia', label: 'Fotografia' }, { id: 'wyprawy', label: 'Wyprawy' }, { id: 'szczyty', label: 'Moje szczyty' }, { id: 'filmy', label: 'Filmy' }, { id: 'mapa', label: 'Mapa' }, { id: 'galerie', label: 'Galerie' }, { id: 'o-mnie', label: 'O mnie' } ]
const groups = {
  wyprawy: [
    { href: '/kierunki', label: 'Kierunki', description: 'Kraje, pasma i ich materiały' },
    { href: '/wyprawy', label: 'Wszystkie wyprawy', description: 'Fotografie, filmy i opisy' },
    { href: '/wyprawy?widok=os', label: 'Oś podróży', description: 'Wyjazdy w kolejności czasu' },
    { href: '/kierunki/tatry', label: 'Tatry', description: 'Letnie i zimowe wejścia' },
    { href: '/kierunki/alpy', label: 'Alpy', description: 'Wyprawy, fotografie i trasy' },
    { href: '/sezony', label: 'Sezony', description: 'Podsumowania kolejnych lat' },
  ],
  mapa: [
    { href: '/mapa', label: 'Atlas miejsc', description: 'Kraje, pasma i szczyty' },
    { href: '/trasy', label: 'Atlas tras', description: 'Ślady GPX i porównanie tras' },
  ],
}

export function SiteHeader({ section, detail = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menu = useRef(null)
  const toggle = useRef(null)
  const { pathname, search } = usePageLocation()
  const activeSection = pathname === '/trasy' ? 'mapa' : pathname.startsWith('/sezony') ? 'wyprawy' : section
  const activePath = pathname === '/wyprawy' && new URLSearchParams(search).get('widok') === 'os' ? '/wyprawy?widok=os' : pathname
  const closeGroups = () => menu.current?.querySelectorAll('details[open]').forEach(group => { group.open = false })
  const closeMenu = () => { closeGroups(); setMenuOpen(false) }
  useEffect(() => {
    const outside = event => { if (!menu.current?.contains(event.target)) closeGroups() }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    menu.current?.querySelector('a, summary')?.focus()
    const escape = event => {
      if (event.key === 'Escape') { setMenuOpen(false); toggle.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width:901px)')
    const resize = () => { if (desktop.matches) { closeGroups(); setMenuOpen(false) } }
    window.addEventListener('keydown', escape)
    desktop.addEventListener('change', resize)
    return () => { window.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize) }
  }, [menuOpen])
  return <header className="cz-gallery-nav cz-site-header">
        <a href="/" className="cz-gallery-brand" aria-label="Cinek Zielu — strona główna"><img className="cz-brand-logo" src={brandLogo} width="1481" height="486" alt="" /></a>
        <SearchTrigger onOpen={closeMenu} />
        <SavedHeaderLink active={section === 'zapisane'} />
        <button className="cz-collection-menu-toggle" ref={toggle} type="button" aria-controls={menuId} aria-expanded={menuOpen} aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} onClick={() => { closeGroups(); setMenuOpen(open => !open) }}>{menuOpen ? 'Zamknij ×' : 'Menu ☰'}</button>
        <nav id={menuId} ref={menu} className={`cz-collection-nav${menuOpen ? ' is-open' : ''}`} aria-label="Nawigacja strony">
          {sections.map(item => groups[item.id] ? <details key={item.id} className={`cz-nav-group${item.id === activeSection ? ' is-active' : ''}`}
            onToggle={event => { const current = event.currentTarget; if (current.open) menu.current?.querySelectorAll('details[open]').forEach(group => { if (group !== current) group.open = false }) }}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false }}
            onKeyDown={event => { if (event.key === 'Escape' && event.currentTarget.open) { event.stopPropagation(); event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}>
            <summary>{item.label}<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></summary>
            <div className="cz-nav-submenu">{groups[item.id].map(link => <a key={link.href} href={link.href} aria-current={activePath === link.href ? 'page' : undefined} onClick={closeMenu}><span>{link.label}</span><small>{link.description}</small></a>)}</div>
          </details> : <a key={item.id} href={`/${item.id}`} aria-current={item.id === activeSection && !detail ? 'page' : undefined} onClick={closeMenu} className={item.id === activeSection ? 'is-active' : ''}>{item.label}</a>)}
        </nav>
      </header>
}
