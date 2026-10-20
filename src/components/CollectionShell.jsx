import React from 'react'
import { BrowseReturn } from './BrowseReturn'
import '../galleryStyles.css'
import { SiteHeader } from './SiteHeader'

export function CollectionShell({ children, section, detail = false, className = '' }) {
  return <div className={`cz-collection ${className}`}>
    <a className="cz-skip-link" href="#tresc">Przejdź do treści</a>
    <div className="cz-gallery-wrap">
      <SiteHeader section={section} detail={detail} />
      <main id="tresc"><BrowseReturn />{children}</main>
      <footer className="cz-gallery-footer"><a href="/o-mnie">Marcin Zieliński</a><nav aria-label="Stopka"><a href="/trasy">Trasy</a><a href="/o-mnie#kontakt">Kontakt</a><a href="https://www.youtube.com/@cinek_zielu" target="_blank" rel="noreferrer">YouTube ↗</a></nav></footer>
    </div>
  </div>
}
