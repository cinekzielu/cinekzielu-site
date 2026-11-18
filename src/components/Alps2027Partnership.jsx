import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CollectionShell } from './CollectionShell'
import { FilmLink } from './SiteTools'
import { ResponsivePhoto } from './ResponsivePhoto'
import { alpsStoryGallery } from '../data/alpsStory'
import { alpsEpisodes } from '../data/alpsEpisodes'
import { author } from '../data/authorData'
import '../alps2027Partnership.css'

const cover = alpsStoryGallery.photos.find(photo => photo.src.endsWith('/alpy-2026-25-small.webp'))
const contact = `mailto:${author.email}?subject=${encodeURIComponent('Współpraca — Alpy 2027 | Cinek Zielu')}`

export function Alps2027Partnership() {
  return <CollectionShell section="wyprawy" detail className="cz-galleries cz-alps-partner">
    <header className="cz-alps-partner-hero">
      <div>
        <a className="cz-alps-partner-back" href="/kierunki/alpy">← Wyprawy w Alpy</a>
        <h1>Alpy 2027</h1>
        <p className="cz-alps-partner-lead">Szukam partnera wyprawy</p>
        <p>Nazywam się Marcin Zieliński. Latem 2027 planuję z ekipą wrócić w Alpy z kamerą i aparatem. Nasze główne cele to Matterhorn i Mont Blanc, a z przygotowań i drogi chcę przywieźć filmy i fotografie.</p>
        <a className="cz-alps-partner-email" href={contact}>Porozmawiajmy o współpracy <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <figure>
        <ResponsivePhoto photo={cover} full sizes="(max-width:760px) 100vw, 55vw" fetchPriority="high" />
        <figcaption>Across the Alps · fotografia z wyprawy 2026</figcaption>
      </figure>
    </header>

    <section className="cz-alps-partner-section" aria-labelledby="partnership-formats">
      <h2 id="partnership-formats">Co możemy stworzyć razem</h2>
      <div className="cz-alps-partner-formats">
        <div><h3>Film z wyprawy</h3><p>Pokazanie sprzętu lub marki w naturalnym kontekście przygotowań i wyjazdu.</p></div>
        <div><h3>Fotografie w terenie</h3><p>Zdjęcia z wyprawy i sprzętu w użyciu, z zakresem wykorzystania ustalonym przed wyjazdem.</p></div>
        <div><h3>Krótkie materiały</h3><p>Pionowe ujęcia z przygotowań i wyjazdu do publikacji w mediach społecznościowych.</p></div>
      </div>
      <p>Jestem otwarty na partnerstwo sprzętowe lub finansowe. Zakres materiałów, terminy i sposób publikacji ustalimy wspólnie.</p>
    </section>

    <section className="cz-alps-partner-section cz-alps-partner-previous" aria-labelledby="partnership-previous">
      <div>
        <h2 id="partnership-previous">Zobacz, co przywieźliśmy w 2026</h2>
        <p>Across the Alps to historia wyprawy od Triglavu po Zugspitze. Trasa objęła pięć szczytów, prawie 120 km i ponad 11 000 m podejść.</p>
      </div>
      <div className="cz-alps-partner-links">
        <FilmLink href={alpsEpisodes.triglav.youtubeUrl}>Obejrzyj odcinek z Triglavu ↗</FilmLink>
        <a href="/wyprawy/alpy-2026">Zobacz wyprawę i fotografie ↗</a>
      </div>
    </section>

    <section className="cz-alps-partner-section cz-alps-partner-contact" aria-labelledby="partnership-contact">
      <h2 id="partnership-contact">Kontakt w sprawie Alp 2027</h2>
      <p>{author.name} · Cinek Zielu</p>
      <a href={contact}>{author.email} ↗</a>
    </section>
  </CollectionShell>
}
