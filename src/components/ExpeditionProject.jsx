import React from 'react'
import { atlasHref } from '../data/atlasContent'
import { findFilm } from '../data/filmCatalog'
import { FilmLink } from './SiteTools'
import '../expeditionProject.css'

export function ExpeditionProjectOverview({ project }) {
  return <>
    <dl className="cz-project-stats" aria-label="Podsumowanie całej wyprawy">
      {project.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}{stat.unit && <span>{stat.unit}</span>}</dd></div>)}
    </dl>
    <section id="szczyty" className="cz-project-summits" aria-labelledby="project-summits-title">
      <div className="cz-expedition-section-heading"><h2 id="project-summits-title">Pięć szczytów</h2><span>Sierpień 2026 · wyprawa zrealizowana</span></div>
      <ul className="cz-project-summit-list">
        {project.summits.map((summit, index) => <li key={summit.id}>
          <span className="cz-project-summit-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{summit.name}</h3><span className="cz-project-summit-status">Zdobyty</span>
          <a href={`#material-${summit.id}`} aria-label={`Seria filmowa: ${summit.name}`}>Seria filmowa ↓</a>
        </li>)}
      </ul>
      <div className="cz-project-atlas"><div><h3>Alpy w atlasie</h3><p>Fotografie i projekt wyprawy w widoku Alp z 2026 roku.</p></div><a href={atlasHref(project.atlas.id, project.atlas.year)}>Otwórz atlas · 2026 ↗</a></div>
    </section>
  </>
}

export function ExpeditionProjectFilms({ project }) {
  return <section id="filmy" className="cz-project-films" aria-labelledby="project-films-title">
    <div className="cz-expedition-section-heading"><h2 id="project-films-title">Seria z wyprawy</h2><span>YouTube · w przygotowaniu</span></div>
    <p className="cz-project-intro">Trailer, pięć odcinków i materiał dodatkowy. Montaż trwa — linki do nowych filmów pojawią się po publikacji.</p>
    <ul className="cz-project-film-plan">{project.films.map(item => {
      const candidate = item.filmId ? findFilm(item.filmId) : null
      const film = candidate?.status === 'published' && candidate.expeditionId === project.id ? candidate : null
      return <li id={`material-${item.id}`} key={item.id}>
        <div><span className="cz-expedition-film-label">{item.label}</span><h3>{item.title}</h3></div>
        {film ? <FilmLink href={film.youtubeUrl} aria-label={`Obejrzyj: ${item.title}`}>Obejrzyj ↗</FilmLink> : <span className="cz-project-film-status">W przygotowaniu</span>}
      </li>
    })}</ul>
  </section>
}
