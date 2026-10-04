import React from 'react'
import '../galleryStyles.css'

const sections = [ { id: 'mapa', label: 'Mapa' }, { id: 'wyprawy', label: 'Wyprawy' }, { id: 'filmy', label: 'Filmy' }, { id: 'galerie', label: 'Galerie' } ]

export function CollectionShell({ children, section, detail = false, className = '' }) {
  return <div className={`cz-collection ${className}`}>
    <a className="cz-skip-link" href="#tresc">Przejdź do treści</a>
    <div className="cz-gallery-wrap">
      <header className="cz-gallery-nav">
        <a href="/" className="cz-gallery-brand" aria-label="Cinek Zielu — strona główna">CINEK ZIELU</a>
        <nav className="cz-collection-nav" aria-label="Nawigacja strony">
          {sections.map(item => <a key={item.id} href={`/${item.id}`} aria-current={item.id === section && !detail ? 'page' : undefined} className={item.id === section ? 'is-active' : ''}>{item.id === section && detail ? '← ' : ''}{item.label}</a>)}
        </nav>
      </header>
      <main id="tresc">{children}</main>
      <footer className="cz-gallery-footer"><span>Marcin Zieliński</span><a href="https://www.youtube.com/@cinek_zielu" target="_blank" rel="noreferrer">YouTube ↗</a></footer>
    </div>
  </div>
}
