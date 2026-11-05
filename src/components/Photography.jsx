import React from 'react'
import { usePageLocation } from '../PageLocation'
import { CollectionShell } from './CollectionShell'
import { PhotoGrid } from './PhotoGrid'
import { portfolioPhotos, photographyCollections, photographyCollectionHref, homePhotographyCollections } from '../data/portfolioData'
import { ResponsivePhoto } from './ResponsivePhoto'
import { photoCount } from '../data/galleryNavigation'
import { PhotographyShareControl } from './PhotographyShareControl'
import '../authorStyles.css'
import '../photographyStyles.css'

export function PhotographyCollections({ home = false, activeId = null }) {
  const collections = home ? homePhotographyCollections : photographyCollections
  return <nav className={`cz-photo-collections${home ? ' cz-photo-collections-home' : ''}${activeId ? ' cz-photo-collections-compact' : ''}`} aria-label="Kolekcje fotograficzne">
    {collections.filter(collection => collection.photos.length).map(collection => <a key={collection.id} href={photographyCollectionHref(collection)} className="cz-photo-collection" aria-current={activeId === collection.id ? 'page' : undefined}>
      {!activeId && <div className="cz-photo-collection-image"><ResponsivePhoto photo={collection.photos[0]} full style={{ objectPosition: collection.coverPosition }} sizes={home ? '(max-width:700px) calc(100vw - 40px), 60vw' : '(max-width:600px) 72vw, 48vw'} loading="lazy" /></div>}
      <div className="cz-photo-collection-caption"><h2>{collection.title}</h2><span>{photoCount(collection.photos.length)}</span><span aria-hidden="true">↗</span></div>
    </a>)}
  </nav>
}

export function PhotographyPreview() {
  return <section id="gallery-preview" className="section sectionDarker reveal cz-photography-preview">
    <div className="container">
      <div className="cz-photography-preview-heading"><div><p>Fotografia</p><h2>Wybrane fotografie</h2></div><a href="/fotografia">Zobacz portfolio ↗</a></div>
      <PhotographyCollections home />
      <div className="cz-photography-preview-footer"><span>Góry, podróże i motorsport.</span><a href="/galerie">Galerie z wypraw ↗</a></div>
    </div>
  </section>
}

export function PhotographyPage() {
  const location = usePageLocation()
  const active = photographyCollections.find(collection => collection.id === new URLSearchParams(location.search).get('kolekcja'))
  const photos = active?.photos || portfolioPhotos
  return <CollectionShell section="fotografia" className="cz-galleries cz-photography">
    <div className="cz-gallery-intro"><h1>Fotografia</h1><span className="cz-gallery-count">{photoCount(portfolioPhotos.length)}</span></div>
    <div className="cz-photography-lead"><p>Góry, podróże i motorsport. Mój wybór fotografii.</p><a href="/galerie">Galerie z wypraw ↗</a></div>
    <aside className="cz-wall-entry" aria-labelledby="photo-wall-entry-title">
      <div><span>Studio fotografii</span><h2 id="photo-wall-entry-title">Fotografie na Twojej ścianie.</h2><p>Wybierz moje fotografie, dopasuj ramki i ułóż własną kompozycję na wirtualnej ścianie.</p></div>
      <a href="/fotografia/sciana">Ułóż swoją ścianę <span aria-hidden="true">↗</span></a>
    </aside>
    <PhotographyCollections activeId={active?.id} />
    <section id="kolekcja" className="cz-photography-selection" aria-labelledby="photography-selection-title">
      <div className="cz-photography-selection-heading"><h2 id="photography-selection-title">{active?.title || 'Wybrane fotografie'}</h2><span role="status">{photoCount(photos.length)}</span>{active && <a href="/fotografia">Wszystkie fotografie ↗</a>}</div>
      {active && <PhotographyShareControl key={active.id} collection={active} />}
      {active && <p className="cz-photography-description">{active.description}</p>}
      <PhotoGrid key={active?.id || 'all'} shareable featured selectable gallery={{ title: active?.title || 'Fotografia', photos }} />
      {active && <nav className="cz-photography-source-links" aria-label="Pełne galerie kolekcji"><span>Pełne galerie</span>{[...new Map(photos.map(photo => [photo.sourceHref, photo.sourceLabel])).entries()].map(([href, label]) => <a key={href} href={href}>{label} ↗</a>)}</nav>}
    </section>
    <div className="cz-author-next"><div><span>Cinek Zielu</span><h2>Za aparatem</h2></div><a href="/o-mnie">Marcin Zieliński ↗</a></div>
  </CollectionShell>
}
