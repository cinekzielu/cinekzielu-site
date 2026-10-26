import React from 'react'
import { BrowseReturn } from './BrowseReturn'
import '../galleryStyles.css'
import { SiteHeader } from './SiteHeader'

export function CollectionShell({ children, section, detail = false, className = '', preserveFragment = false }) {
  return <div className={`cz-collection ${className}`}>
    <a className="cz-skip-link" href="#tresc" onClick={preserveFragment ? event => { event.preventDefault(); const main = document.getElementById('tresc'); main?.focus({preventScroll:true}); main?.scrollIntoView() } : undefined}>Przejdź do treści</a>
    <div className="cz-gallery-wrap">
      <SiteHeader section={section} detail={detail} />
      <main id="tresc" tabIndex={preserveFragment ? -1 : undefined}><BrowseReturn />{children}</main>
      <footer className="cz-gallery-footer"><a href="/o-mnie">Marcin Zieliński</a><nav aria-label="Stopka"><a href="/trasy">Trasy</a><a href="/o-mnie#kontakt">Kontakt</a><a href="https://www.youtube.com/@cinek_zielu" target="_blank" rel="noreferrer">YouTube ↗</a></nav></footer>
    </div>
  </div>
}
