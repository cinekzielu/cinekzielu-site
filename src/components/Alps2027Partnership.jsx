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
        <p>Latem 2027 wracamy w Alpy. Tym razem celujemy w Matterhorn i Mont Blanc. Biorę kamerę i aparat, żeby pokazać, jak wygląda taki wyjazd od pakowania po zejście z gór.</p>
        <a className="cz-alps-partner-email" href={contact}>Napisz w sprawie współpracy <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <figure>
        <ResponsivePhoto photo={cover} full sizes="(max-width:760px) 100vw, 55vw" fetchPriority="high" />
        <figcaption>Across the Alps · fotografia z wyprawy 2026</figcaption>
      </figure>
    </header>

    <section className="cz-alps-partner-section" aria-labelledby="partnership-gear">
      <h2 id="partnership-gear">Jaki sprzęt przyda się na wyjeździe?</h2>
      <div className="cz-alps-partner-formats">
        <div><h3>W góry</h3><p>Buty, raki, odzież i plecaki na długie podejścia.</p></div>
        <div><h3>Na biwak</h3><p>Lekki namiot, śpiwór, mata albo sprzęt do gotowania.</p></div>
        <div><h3>Do nagrywania</h3><p>Mocowania do kamery, mikrofon i zasilanie na kilka dni w terenie.</p></div>
      </div>
      <p>Jeśli macie coś, co pasuje do tego wyjazdu, chętnie pogadam. W grę wchodzi też wypożyczenie sprzętu na czas wyprawy albo wsparcie jej kosztów.</p>
    </section>

    <section className="cz-alps-partner-section" aria-labelledby="partnership-formats">
      <h2 id="partnership-formats">Jak mogę pokazać Wasz sprzęt?</h2>
      <p>Mogę pokazać go w filmie na YouTube, zrobić zdjęcia w terenie albo nagrać krótką rolkę. Na przykład pokazać, jak pakujemy plecaki na kilka dni i co faktycznie wyciągamy z nich na podejściu. Przed wyjazdem dogadamy, co chcecie dostać i gdzie materiał się pojawi.</p>
    </section>

    <section className="cz-alps-partner-section cz-alps-partner-previous" aria-labelledby="partnership-previous">
      <div>
        <h2 id="partnership-previous">Tak wyglądał poprzedni wyjazd</h2>
        <p>W 2026 weszliśmy na pięć alpejskich szczytów, od Triglavu po Zugspitze. W pierwszym odcinku widać, jak dojeżdżamy, biwakujemy i ruszamy na Triglav.</p>
      </div>
      <div className="cz-alps-partner-links">
        <FilmLink href={alpsEpisodes.triglav.youtubeUrl}>Obejrzyj odcinek z Triglavu ↗</FilmLink>
        <a href="/wyprawy/alpy-2026">Zobacz wyprawę i fotografie ↗</a>
      </div>
    </section>

    <section className="cz-alps-partner-section cz-alps-partner-contact" aria-labelledby="partnership-contact">
      <h2 id="partnership-contact">Pogadajmy o wyjeździe</h2>
      <p>{author.name} · Cinek Zielu</p>
      <a href={contact}>{author.email} ↗</a>
    </section>
  </CollectionShell>
}
