import {SavedBackup} from './SavedBackup'
import React, { useEffect, useRef, useState } from 'react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { BookmarkIcon, useSaved } from './SavedItems'
import { savedByKey, savedComparisonHref } from '../data/savedItems'
import { SavedNavigation, SavedSetsPage } from './SavedSets'
import { FilmLink } from './SiteTools'

const groups = [
  { type: 'trip', title: 'Wyprawy', href: '/wyprawy' },
  { type: 'route', title: 'Trasy', href: '/trasy' },
  { type: 'film', title: 'Filmy', href: '/filmy' },
  { type: 'photo', title: 'Fotografie', href: '/fotografia' },
]
function SavedMaterialLink({item,children,...props}) {
  return item.type === 'film' ? <FilmLink href={item.href} {...props}>{children}</FilmLink> : <a href={item.href} {...props}>{children}</a>
}
export function SavedPage() {
  const [setsMode, setSetsMode] = useState(false)
  useEffect(()=>{
    const sync=()=>{const params=new URLSearchParams(location.search);setSetsMode(params.get('widok')==='zestawy'||params.has('zestaw')||new URLSearchParams(location.hash.slice(1)).has('zestaw'))}
    sync();window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync)
    return()=>{window.removeEventListener('popstate',sync);window.removeEventListener('hashchange',sync)}
  },[])
  const { keys, ready, persistent, toggle } = useSaved()
  const [filter, setFilter] = useState('all')
  const [compare, setCompare] = useState([])
  const [removed, setRemoved] = useState(null)
  const undo = useRef(null)
  const items = keys.map(key => savedByKey.get(key))
  const selected = compare.filter(key => keys.includes(key))
  const comparison = savedComparisonHref(selected)
  const remove = key => {
    toggle(key); setRemoved(key)
    setCompare(previous => previous.filter(item => item !== key))
    requestAnimationFrame(() => undo.current?.focus({ preventScroll: true }))
  }
  const choose = key => setCompare(previous => {
    const valid = previous.filter(item => keys.includes(item))
    return valid.includes(key) ? valid.filter(item => item !== key) : valid.length < 2 ? [...valid, key] : valid
  })
  if (setsMode) return <SavedSetsPage/>
  return <CollectionShell section="zapisane" className="cz-saved-page">
    <div className="cz-gallery-intro"><h1>Zapisane</h1><span className="cz-gallery-count">{ready ? `${keys.length} na liście` : '…'}</span></div>
    <SavedNavigation/>
    <SavedBackup/>
    <p className="cz-saved-intro">Wyprawy, trasy, filmy i fotografie, do których chcesz wrócić.</p>
    <p className="cz-saved-local">Tylko w tej przeglądarce, bez konta. Wyczyszczenie danych witryny usuwa listę.</p>
    {!persistent && <p className="cz-saved-storage" role="status">Pamięć przeglądarki jest niedostępna. Ta lista działa tylko do opuszczenia strony.</p>}
    {!ready ? <p className="cz-saved-loading" role="status">Wczytuję zapisane…</p> : <>
      <div className="cz-saved-tabs" role="group" aria-label="Rodzaj zapisanych">
        {[{ type: 'all', title: 'Wszystko' }, ...groups].map(group => <button key={group.type} type="button" aria-pressed={filter === group.type} onClick={() => setFilter(group.type)}>{group.title}<span>{group.type === 'all' ? keys.length : items.filter(item => item.type === group.type).length}</span></button>)}
      </div>
      {removed && !keys.includes(removed) && <div className="cz-saved-undo"><span role="status">Usunięto z zapisanych.</span><button type="button" ref={undo} onClick={() => { toggle(removed); setRemoved(null) }}>Cofnij</button></div>}
      {!keys.length ? <div className="cz-saved-empty">
        <BookmarkIcon />
        <h2>Tu znajdziesz swoje zapisane</h2>
        <p>Kliknij zakładkę przy wyprawie, trasie, filmie lub fotografii. W „Moich zestawach” połączysz je we własne listy.</p>
        <nav aria-label="Zacznij zapisywać">{groups.map(group => <a key={group.type} href={group.href}>{group.title} ↗</a>)}</nav>
      </div> : groups.filter(group => filter === 'all' || filter === group.type).map(group => {
        const matches = items.filter(item => item.type === group.type)
        if (!matches.length && filter === 'all') return null
        return <section key={group.type} className="cz-saved-section" aria-labelledby={`zapisane-${group.type}`}>
          <header><h2 id={`zapisane-${group.type}`}>{group.title} <span>{matches.length}</span></h2><a href={group.href}>Przeglądaj ↗</a></header>
          {group.type === 'route' && matches.length > 0 && <div className="cz-saved-compare">
            <p>{matches.length === 1 ? 'Zapisz jeszcze jedną trasę, żeby je porównać.' : 'Wybierz dwie trasy do porównania.'} <span aria-live="polite">{selected.length} / 2</span></p>
            {comparison ? <a href={comparison}>Porównaj trasy ↗</a> : <button type="button" disabled>Porównaj trasy</button>}
          </div>}
          {!matches.length && <p className="cz-saved-empty-type">Nie masz jeszcze nic w tej kategorii.</p>}
          <div className={`cz-saved-grid is-${group.type}`}>
            {matches.map(item => <article key={item.key} className="cz-saved-card">
              <SavedMaterialLink item={item} className="cz-saved-card-link" aria-label={item.accessibleTitle || item.title}>
                {item.photo ? <div className="cz-saved-image"><ResponsivePhoto photo={item.photo} sizes="(max-width:600px) calc(100vw - 28px), (max-width:1000px) 46vw, 420px" loading="lazy" style={{ objectPosition: item.position }} /></div> : <div className="cz-saved-profile" aria-hidden="true">{item.profiles ? <svg viewBox="0 0 200 54" preserveAspectRatio="none">{item.profiles.map((points, index) => <polyline key={index} points={points} />)}</svg> : <span className="cz-saved-film-icon">▷</span>}</div>}
                <div className="cz-saved-caption"><span>{item.detail}</span><h3>{item.title} <span aria-hidden="true">↗</span></h3>{item.type === 'route' && <p>{(item.distance / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} km <span>·</span> ok. {item.ascent.toLocaleString('pl-PL')} m podejść</p>}</div>
              </SavedMaterialLink>
              <div className="cz-saved-card-actions">
                {item.type === 'route' && <label><input type="checkbox" checked={selected.includes(item.key)} disabled={!selected.includes(item.key) && selected.length === 2} onChange={() => choose(item.key)} />Porównaj<span className="cz-sr-only">: {item.title}</span></label>}
                <button type="button" onClick={() => remove(item.key)} aria-label={`Usuń z zapisanych: ${item.accessibleTitle || item.title}`}><BookmarkIcon filled />Usuń</button>
              </div>
            </article>)}
          </div>
        </section>
      })}
    </>}
  </CollectionShell>
}
