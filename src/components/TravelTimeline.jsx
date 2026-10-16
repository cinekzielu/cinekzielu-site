import React from 'react'
import { ResponsivePhoto } from './ResponsivePhoto'
import { expeditionHref, sortExpeditionsNewest, filmCount } from '../data/expeditionPages'
import { galleryHref, galleryLinkLabel, galleryItemCount, expeditionCount } from '../data/galleryNavigation'
import '../travelTimeline.css'
import { SaveButton } from './SavedItems'

export function TravelTimeline({ expeditions }) {
  const sorted = sortExpeditionsNewest(expeditions)
  const years = [...new Set(sorted.map(trip => trip.year))]
  if (!years.length) return null
  return <div className="cz-travel-timeline">
    <nav className="cz-timeline-years" aria-label="Przejdź do roku">
      <span>Oś podróży</span>
      {years.map(year => <a key={year} href={`#podroze-${year}`}>{year}<span aria-hidden="true"> ↓</span></a>)}
    </nav>
    {years.map(year => {
      const trips = sorted.filter(trip => trip.year === year)
      return <section className="cz-timeline-year" key={year} id={`podroze-${year}`} aria-labelledby={`rok-${year}`}>
        <header className="cz-timeline-year-heading"><h2 id={`rok-${year}`}>{year}</h2><span>{expeditionCount(trips.length)}</span></header>
        <ol className="cz-timeline-entries">
          {trips.map(trip => <li className="cz-timeline-entry" key={trip.id}>
            <div className="cz-timeline-date"><time dateTime={trip.date === String(trip.year) ? String(trip.year) : trip.sortDate}>{trip.date}</time><span>{trip.kind}</span></div>
            <article className="cz-timeline-card">
              <a className="cz-timeline-cover" href={expeditionHref(trip)} aria-label={`Wyprawa: ${trip.title}`} tabIndex={-1}>
                <ResponsivePhoto photo={trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage)} sizes="(max-width:700px) calc(100vw - 72px), (max-width:1100px) 28vw, 340px" loading="lazy" style={{objectPosition:trip.gallery.coverPosition}} />
              </a>
              <div className="cz-timeline-body"><p>{trip.region}</p><h3><a href={expeditionHref(trip)}>{trip.title}<span aria-hidden="true"> ↗</span></a></h3>
                <span className="cz-timeline-count">{galleryItemCount(trip.gallery)}{trip.gallery.films.length > 0 && ` · ${filmCount(trip.gallery.films)}`}</span>
                <nav className="cz-timeline-links" aria-label={`Materiały: ${trip.title}`}>
                  <a href={galleryHref(trip.gallery)}>{galleryLinkLabel(trip.gallery)}</a>
                  {trip.gallery.films.length > 0 && <a href={`${expeditionHref(trip)}#filmy`}>Filmy</a>}
                  <SaveButton itemKey={`trip:${trip.id}`} />
                </nav>
              </div>
            </article>
          </li>)}
        </ol>
      </section>
    })}
  </div>
}
