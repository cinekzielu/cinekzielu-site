import React from 'react'
import { galleryData } from '../data/galleryData'
import { ResponsivePhoto } from './ResponsivePhoto'
import { FilmLink } from './SiteTools'
import '../baranieSeasons.css'

const summer = galleryData.find(item => item.id === 'baranie-rogi-lodowy-szczyt-2026')
const winter = galleryData.find(item => item.id === 'baranie-rogi-zima-2025')
export function BaranieSeasons() {
  return <section id="dwa-sezony" className="cz-baranie-seasons" aria-labelledby="baranie-seasons-title">
    <header><p className="cz-expedition-eyebrow">Tatry Wysokie</p><h2 id="baranie-seasons-title">Baranie Rogi · dwa sezony</h2><p>Dwa wejścia, osobne wyprawy i filmy.</p></header>
    <div className="cz-baranie-seasons-grid">{[
      {gallery:summer, label:'Lato 2026', date:'Lipiec 2026', dateTime:'2026-07', kind:'Fotografie · SONY', text:'Baranie Rogi pierwszego dnia. Następnego dnia Lodowy Szczyt przez Lodową Kopę. Galeria obejmuje oba dni.', href:`/galerie/${summer.id}`, action:'Galeria z dwóch dni'},
      {gallery:winter, label:'Zima 2025', date:'30 listopada 2025', dateTime:'2025-11-30', kind:'Kadry z nagrań · DJI', text:'Zimowe wejście na Baranie Rogi. Film oraz wybrane kadry z podejścia, grani i zejścia.', href:`/wyprawy/${winter.id}#kadry`, action:'Kadry z wyprawy'},
    ].map(item => <article key={item.gallery.id} className="cz-baranie-season-card">
      <a href={item.href} className="cz-baranie-season-image" aria-label={`${item.label} — ${item.action}`}><ResponsivePhoto photo={item.gallery.photos.find(photo=>photo.src===item.gallery.coverImage)} sizes="(max-width:700px) calc(100vw - 28px), 48vw" loading="lazy" /><span>{item.kind}</span></a>
      <div className="cz-baranie-season-body"><div><h3>{item.label}</h3><time dateTime={item.dateTime}>{item.date}</time></div><p>{item.text}</p><nav aria-label={`Materiały: ${item.label}`}><FilmLink href={item.gallery.films[0].url}>▷ Film: Baranie Rogi</FilmLink><a href={item.href}>{item.action} ↗</a><a href={`/wyprawy/${item.gallery.id}`}>Wyprawa ↗</a></nav></div>
    </article>)}</div>
    <a className="cz-baranie-map-link" href="/mapa?atlas=baranie-rogi">Baranie Rogi na mapie ↗</a>
  </section>
}
