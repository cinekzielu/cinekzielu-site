import React from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { ResponsivePhoto } from './ResponsivePhoto'
import { FilmLink } from './SiteTools'
import { alpsStoryGallery, latestAlpsChapter } from '../data/alpsStory'
import '../alpsHomeFeature.css'

const photo = alpsStoryGallery.photos.find(item => item.src.endsWith('/alpy-2026-25-small.webp'))

export function AlpsHomeFeature() {
  return <section id="across-the-alps" className="section sectionDarker reveal cz-alps-feature" aria-labelledby="alps-feature-title">
    <div className="container">
      <div className="cz-alps-feature-card">
        <a className="cz-alps-feature-photo" href="/wyprawy/alpy-2026" tabIndex={-1} aria-hidden="true">
          <ResponsivePhoto photo={photo} full sizes="(max-width:700px) calc(100vw - 40px), (max-width:1300px) 52vw, 650px" loading="lazy" alt="" />
        </a>
        <div className="cz-alps-feature-copy">
          <p className="cz-alps-feature-eyebrow">Alpy · Sierpień 2026</p>
          <h2 id="alps-feature-title">Across the Alps</h2>
          <p className="cz-alps-feature-lead">Filmy, fotografie i trasy z wyjazdu w Alpy.</p>
          <div className="cz-alps-feature-actions">
            <a className="button primary" href="/wyprawy/alpy-2026">Zobacz wyprawę <ArrowUpRight size={17} aria-hidden="true" /></a>
            {latestAlpsChapter && <FilmLink className="cz-alps-feature-trailer" href={latestAlpsChapter.episode.youtubeUrl}>
              <Play size={16} aria-hidden="true" /> Odcinek {Number(latestAlpsChapter.number)}: {latestAlpsChapter.title} · {latestAlpsChapter.episode.duration}
            </FilmLink>}
          </div>
        </div>
      </div>
    </div>
  </section>
}
