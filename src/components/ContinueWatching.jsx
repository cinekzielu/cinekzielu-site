import React, { useEffect, useState } from 'react'
import { filmCatalog } from '../data/filmCatalog'
import { formatVideoTime } from '../data/videoPlayer'
import { watchProgressEvent, watchProgressKey, watchStore } from '../data/watchProgress'
import { FilmLink } from './SiteTools'

export function ContinueWatching() {
  const [items, setItems] = useState([])
  const [persistent, setPersistent] = useState(true)
  useEffect(() => {
    const sync = () => { setItems(watchStore.read()); setPersistent(watchStore.isPersistent()) }
    const storage = event => { if (event.key === watchProgressKey || event.key === null) sync() }
    sync(); window.addEventListener(watchProgressEvent, sync); window.addEventListener('storage', storage)
    return () => { window.removeEventListener(watchProgressEvent, sync); window.removeEventListener('storage', storage) }
  }, [])
  return <section className="cz-continue" aria-labelledby="continue-title">
    <div className="cz-continue-heading"><h2 id="continue-title">Oglądaj dalej</h2>{items.length > 0 && <button type="button" onClick={() => watchStore.clear()}>Wyczyść historię</button>}</div>
    <p>{persistent ? 'Filmy oglądane tutaj zapamiętują moment w tej przeglądarce. Bez konta i synchronizacji z YouTube.' : 'Pamięć przeglądarki jest niedostępna. Postęp zostanie tylko do zamknięcia lub odświeżenia strony.'}</p>
    {items.length ? <div className="cz-continue-list">{items.map(item => {
      const film = filmCatalog.find(film => film.youtubeId === item.id)
      return <article key={item.id} className="cz-continue-card">
        <FilmLink href={`${film.youtubeUrl}&t=${item.position}s`} className="cz-continue-link" aria-label={`Wznów ${film.title} od ${formatVideoTime(item.position)}`}>
          <img src={film.thumbnail} alt="" width="160" height="90" loading="lazy" />
          <div><h3>{film.title}</h3><span>Wznów od {formatVideoTime(item.position)} <span aria-hidden="true">↗</span></span><progress value={item.position} max={item.duration} aria-label={`Postęp filmu ${film.title}`} /></div>
        </FilmLink>
        <button type="button" className="cz-continue-remove" aria-label={`Usuń z oglądaj dalej: ${film.title}`} onClick={() => watchStore.remove(item.id)}>Usuń</button>
      </article>
    })}</div> : <p className="cz-continue-empty">Rozpocznij dowolny film poniżej — wrócisz tutaj do przerwanego oglądania.</p>}
  </section>
}
