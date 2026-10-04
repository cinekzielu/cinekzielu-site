import React from 'react'
import { CollectionShell } from './CollectionShell'

export function NotFound() {
  return <CollectionShell className="cz-galleries">
    <div className="cz-gallery-intro"><h1>Nie znaleziono strony</h1><span className="cz-gallery-count">404</span></div>
    <p className="cz-expedition-index-intro">Ten adres nie prowadzi do istniejącej strony.</p>
    <nav className="cz-gallery-context" aria-label="Wróć do przeglądania">
      <a href="/">Strona główna ↗</a><a href="/wyprawy">Wyprawy ↗</a><a href="/galerie">Galerie ↗</a><a href="/mapa">Mapa ↗</a>
    </nav>
  </CollectionShell>
}
