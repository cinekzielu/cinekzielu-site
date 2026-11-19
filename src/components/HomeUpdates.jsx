import React from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { homeUpdates } from '../data/homeUpdates'
import { ResponsivePhoto } from './ResponsivePhoto'
import { FilmLink } from './SiteTools'
import '../homeUpdates.css'

const dateFormat = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export function HomeUpdates() {
  return <section id="ostatnio-dodane" className="section cz-home-updates" aria-labelledby="home-updates-title">
    <div className="container cz-home-updates-layout">
      <header className="cz-home-updates-heading">
        <p className="cz-home-updates-eyebrow">Na stronie</p>
        <h2 id="home-updates-title">Ostatnio dodane</h2>
        <p>Nowe materiały i uzupełnienia według daty publikacji.</p>
      </header>
      <ol className="cz-home-updates-list">
        {homeUpdates.map(update => {
          const Link = update.kind === 'film' ? FilmLink : 'a'
          return <li key={update.id}>
            <Link href={update.href} className="cz-home-update" aria-labelledby={`${update.id}-title`} aria-describedby={`${update.id}-meta ${update.id}-description`}>
              <div className="cz-home-update-image">
                {update.photo
                  ? <ResponsivePhoto photo={update.photo} sizes="(max-width:600px) 88px, 112px" loading="lazy" alt="" style={{ objectPosition: update.photoPosition }} />
                  : <img src={update.thumbnail} width="1280" height="720" loading="lazy" decoding="async" alt="" />}
                {update.kind === 'film' && <span className="cz-home-update-play" aria-hidden="true"><Play size={18} /></span>}
              </div>
              <div className="cz-home-update-copy">
                <div className="cz-home-update-meta" id={`${update.id}-meta`}><span>{update.label}</span><time dateTime={update.publishedAt}>{dateFormat.format(new Date(`${update.publishedAt}T12:00:00Z`))}</time></div>
                <h3 id={`${update.id}-title`}>{update.title}</h3>
                <p id={`${update.id}-description`}>{update.description}</p>
                <span className="cz-home-update-action">{update.action}<ArrowUpRight size={14} aria-hidden="true" /></span>
              </div>
            </Link>
          </li>
        })}
      </ol>
    </div>
  </section>
}
