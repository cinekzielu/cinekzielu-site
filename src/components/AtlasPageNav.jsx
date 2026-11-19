import React from 'react'
import '../atlasPageNav.css'

const pages = [
  { href: '/mapa', label: 'Atlas miejsc' },
  { href: '/trasy', label: 'Trasy GPX' },
]

export function AtlasPageNav({ current }) {
  return <nav className="cz-atlas-page-nav" aria-label="Mapa i trasy">
    {pages.map(({ href, label }) => href === current
      ? <span key={href} aria-current="page">{label}</span>
      : <a key={href} href={href}>{label} <span aria-hidden="true">→</span></a>)}
  </nav>
}
