import React from 'react'
import { CollectionShell } from './CollectionShell'
import { PhotoGrid } from './PhotoGrid'
import { portfolioPhotos } from '../data/portfolioData'
import { photoCount } from '../data/galleryNavigation'
import '../authorStyles.css'

export function PhotographyPage() {
  return <CollectionShell section="fotografia" className="cz-galleries cz-photography">
    <div className="cz-gallery-intro"><h1>Fotografia</h1><span className="cz-gallery-count">{photoCount(portfolioPhotos.length)}</span></div>
    <div className="cz-photography-lead"><p>Wybrane kadry z gór i podróży.</p><a href="/galerie">Wszystkie galerie ↗</a></div>
    <PhotoGrid featured gallery={{ title: 'Fotografia', photos: portfolioPhotos }} />
    <div className="cz-author-next"><div><span>Cinek Zielu</span><h2>Za aparatem</h2></div><a href="/o-mnie">Marcin Zieliński ↗</a></div>
  </CollectionShell>
}
