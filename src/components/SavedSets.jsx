import {SavedBackup} from './SavedBackup'
import React, {useEffect, useRef, useState} from 'react'
import {PhotoSlideshowButton} from './PhotoSlideshow'
import {CollectionShell} from './CollectionShell'
import {ResponsivePhoto} from './ResponsivePhoto'
import {FilmLink} from './SiteTools'
import {useSaved} from './SavedItems'
import {useSavedSets} from './useSavedSets'
import {savedByKey, savedCatalog, savedComparisonHref} from '../data/savedItems'
import {MAX_SETS, MAX_SET_ITEMS, decodeSharedSet, setName, sharedSetPath} from '../data/savedSets'
import {normalizeFilmSearch} from '../data/filmCatalog'
import '../savedSets.css'

const materialCount = n => `${n} ${n === 1 ? 'materiał' : n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? 'materiały' : 'materiałów'}`
const types = {route:'Trasa', trip:'Wyprawa', film:'Film', photo:'Fotografia'}
export function SavedNavigation({sets=false}) {
  return <nav className="cz-set-nav" aria-label="Widok zapisanych"><a href="/zapisane" aria-current={!sets ? 'page' : undefined}>Wszystkie zapisane</a><a href="/zapisane?widok=zestawy" aria-current={sets ? 'page' : undefined}>Moje zestawy</a></nav>
}
function SetItems({set, remove, move}) {
  const [compare,setCompare] = useState([])
  const [view,setView] = useState(null)
  const photoOnly = set.items.length > 0 && set.items.every(key => savedByKey.get(key)?.type === 'photo')
  const grid = photoOnly && view !== 'list'
  const chosen = compare.filter(key => set.items.includes(key))
  const href = savedComparisonHref(chosen)
  const routes = set.items.filter(key => savedByKey.get(key)?.type === 'route')
  const moveItem = (event,key,delta) => { const group=event.currentTarget.parentElement; move(key,delta); requestAnimationFrame(()=>group.querySelector('button:not(:disabled)')?.focus({preventScroll:true})) }
  const photos = set.items.map(key => savedByKey.get(key)).filter(item => item?.type === 'photo').map(item => ({...item.photo, sourceHref:item.href}))
  return <>
    {photos.length > 0 && <PhotoSlideshowButton photos={photos} title={set.name} tripHref={null} />}
    {routes.length > 1 && <div className="cz-saved-compare"><p>Wybierz dwie trasy. <span aria-live="polite">{chosen.length} / 2</span></p>{href ? <a href={href}>Porównaj trasy ↗</a> : <button disabled>Porównaj trasy</button>}</div>}
    {photoOnly && <div className="cz-set-view" role="group" aria-label="Widok fotografii w zestawie"><button aria-pressed={grid} onClick={()=>setView('grid')}>Siatka zdjęć</button><button aria-pressed={!grid} onClick={()=>setView('list')}>Lista</button></div>}
    <div className={`cz-set-items${grid ? ' is-photo-grid' : ''}`}>{set.items.map((key, index) => {
      const item = savedByKey.get(key)
      if (!item) return null
      const Link = item.type === 'film' ? FilmLink : 'a'
      return <article className="cz-set-item" key={key}>
        <Link href={item.href} className="cz-set-item-link" aria-label={item.accessibleTitle || item.title}>
          <div className="cz-set-thumb">{item.photo ? <ResponsivePhoto photo={item.photo} loading="lazy" sizes={grid ? "(max-width:600px) 90vw, (max-width:1000px) 45vw, 600px" : "110px"} /> : item.profiles ? <svg viewBox="0 0 200 54" preserveAspectRatio="none" aria-hidden="true">{item.profiles.map((points,i) => <polyline key={i} points={points}/>)}</svg> : <span aria-hidden="true">▷</span>}</div>
          <div><small>{types[item.type]}{item.type !== 'photo' && ` · ${item.detail}`}</small><h3>{item.title} ↗</h3></div>
        </Link>
        <div className="cz-set-item-actions">{move && <div className="cz-set-order" role="group" aria-label={`Kolejność: ${item.accessibleTitle || item.title}`}><span>{index + 1} / {set.items.length}</span><button disabled={index === 0} aria-label={`Przesuń wcześniej: ${item.accessibleTitle || item.title}`} onClick={event=>moveItem(event,key,-1)}>↑</button><button disabled={index === set.items.length-1} aria-label={`Przesuń później: ${item.accessibleTitle || item.title}`} onClick={event=>moveItem(event,key,1)}>↓</button></div>}{item.type === 'route' && routes.length > 1 && <label><input type="checkbox" aria-label={`Porównaj: ${item.title}`} checked={chosen.includes(key)} disabled={chosen.length === 2 && !chosen.includes(key)} onChange={()=>setCompare(chosen.includes(key) ? chosen.filter(k=>k!==key) : [...chosen,key])}/>Porównaj</label>}{remove && <button onClick={()=>remove(key)} aria-label={`Usuń z zestawu: ${item.accessibleTitle || item.title}`}>Usuń</button>}</div>
      </article>
    })}</div>
  </>
}
function ShareSet({set}) {
  const [link,setLink] = useState(''), [status,setStatus] = useState('')
  const field = useRef(null), revision = useRef(0)
  const path = sharedSetPath(set)
  useEffect(()=>{revision.current++;setLink('');setStatus('')},[path])
  useEffect(()=>{if(link){field.current?.focus();field.current?.select()}},[link])
  useEffect(()=>()=>{revision.current++},[])
  const share = async()=>{
    const rev=++revision.current, url=new URL(path,window.location.origin).href
    setLink(url);setStatus('Zaznaczony link możesz skopiować ręcznie.')
    try {await navigator.clipboard.writeText(url);if(rev===revision.current)setStatus('Link skopiowany.')} catch { /* Manual copy remains available. */ }
  }
  return <div className="cz-set-share"><button className="cz-set-primary" disabled={!path} onClick={share}>Udostępnij zestaw ↗</button>{link && <div className="cz-set-link"><label>Link do zestawu<input ref={field} readOnly value={link} onFocus={e=>e.target.select()} onClick={e=>e.currentTarget.select()}/></label><p role="status">{status}</p><p>Link zawiera nazwę i aktualną listę. Późniejsze zmiany nie zmienią wysłanej kopii. Każdy z linkiem może ją otworzyć.</p>{/^localhost$|^127\./.test(window.location.hostname) && <p>Podgląd lokalny: ten link działa tylko na tym komputerze. Po publikacji będzie można udostępniać linki z cinekzielu.pl.</p>}<button onClick={()=>{revision.current++;setLink('')}}>Schowaj link</button></div>}</div>
}
function MaterialPicker({set, add}) {
  const {keys} = useSaved()
  const [query,setQuery] = useState(''), [type,setType] = useState('all'), [expanded,setExpanded] = useState(false)
  const [notice,setNotice] = useState('')
  const terms=normalizeFilmSearch(query).trim().split(/\s+/).filter(Boolean)
  const pool=terms.length ? savedCatalog : keys.map(key=>savedByKey.get(key)).filter(Boolean)
  const results=pool.filter(item=>(type==='all'||item.type===type) && terms.every(term=>normalizeFilmSearch(`${item.accessibleTitle || item.title} ${item.detail}`).includes(term)))
  const [limit,setLimit] = useState(8)
  return <section className="cz-set-picker"><button className="cz-set-picker-toggle" aria-expanded={expanded} aria-controls="set-picker" onClick={()=>setExpanded(!expanded)}>Dodaj materiały {expanded ? '−' : '+'}</button>{expanded && <div id="set-picker"><p>Wybierz ze swoich zapisanych lub wyszukaj w całej stronie.</p><div className="cz-set-search"><label>Szukaj materiałów<input type="search" placeholder="Np. Baranie, Alpy, Maroko…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(8)}}/></label><label>Rodzaj<select value={type} onChange={e=>{setType(e.target.value);setLimit(8)}}><option value="all">Wszystkie</option>{Object.entries(types).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label></div><p className="cz-set-muted" role="status">{query.trim() ? `Wyniki: ${results.length}` : `Z Twoich zapisanych: ${results.length}`}</p>{!results.length && <p>{query.trim() ? 'Brak wyników. Spróbuj innej nazwy lub rodzaju.' : 'Wpisz nazwę, żeby znaleźć materiały na stronie.'}</p>}<ul className="cz-set-results">{results.slice(0,limit).map(item=><li key={item.key}><span>{item.photo && <ResponsivePhoto photo={item.photo} sizes="56px" loading="lazy"/>}<span><small>{types[item.type]}{item.type !== 'photo' && ` · ${item.detail}`}</small><strong>{item.accessibleTitle || item.title}</strong></span></span><button disabled={set.items.includes(item.key)||set.items.length>=MAX_SET_ITEMS} aria-label={`${set.items.includes(item.key)?'Dodano':'Dodaj'}: ${item.accessibleTitle || item.title}`} onClick={()=>{add(item.key);setNotice(`Dodano: ${item.accessibleTitle || item.title}`)}}>{set.items.includes(item.key)?'Dodano ✓':'+ Dodaj'}</button></li>)}</ul>{results.length>limit&&<button onClick={()=>setLimit(limit+12)}>Pokaż więcej wyników</button>}<p role="status" className="cz-set-muted">{notice}</p>{set.items.length>=MAX_SET_ITEMS&&<p>W zestawie można umieścić do {MAX_SET_ITEMS} materiałów.</p>}</div>}</section>
}
function SetEditor({set,dispatch,back}) {
  const [name,setTitle] = useState(set.name), [renaming,setRenaming] = useState(false), [deleting,setDeleting] = useState(false), [removed,setRemoved] = useState(null)
  const [message,setMessage] = useState(''), [ordering,setOrdering] = useState(false)
  useEffect(()=>setTitle(set.name),[set.name])
  return <>
    <button className="cz-set-back" onClick={back}>← Wszystkie zestawy</button>
    <header className="cz-set-heading"><div><p className="cz-set-kicker">Mój zestaw · {set.items.length} / {MAX_SET_ITEMS}</p><h2>{set.name}</h2></div><ShareSet set={set}/></header>
    <div className="cz-set-tools">{set.items.length > 1 && <button aria-pressed={ordering} onClick={()=>setOrdering(!ordering)}>{ordering ? 'Zakończ układanie' : 'Zmień kolejność'}</button>}<button onClick={()=>setRenaming(!renaming)} aria-expanded={renaming}>Zmień nazwę</button><button onClick={()=>setDeleting(!deleting)} aria-expanded={deleting}>Usuń zestaw</button></div>
    {renaming && <form className="cz-set-form" onSubmit={e=>{e.preventDefault();if(!setName(name))return;dispatch({type:'rename',id:set.id,name});setRenaming(false);setMessage('Nazwa zmieniona.')}}><label>Nazwa zestawu<input maxLength={64} required value={name} onChange={e=>setTitle(e.target.value)}/></label><button type="submit" disabled={!setName(name)}>Zapisz nazwę</button></form>}
    {deleting && <div className="cz-set-delete"><p>Usunąć „{set.name}”? Twoje pojedyncze zakładki pozostaną w Zapisanych.</p><button onClick={()=>{dispatch({type:'delete',id:set.id});back()}}>Tak, usuń zestaw</button><button onClick={()=>setDeleting(false)}>Anuluj</button></div>}
    <p className="cz-set-muted" role="status">{message}</p>
    <MaterialPicker set={set} add={key=>dispatch({type:'add',id:set.id,key})}/>
    {removed && !set.items.includes(removed) && <div className="cz-saved-undo"><span role="status">Usunięto materiał z zestawu.</span><button disabled={set.items.length>=MAX_SET_ITEMS} onClick={()=>{dispatch({type:'add',id:set.id,key:removed});setRemoved(null)}}>Cofnij</button></div>}
    {ordering && <p className="cz-set-muted">Strzałkami ułóż materiały. Pokaz odtwarza tylko fotografie, w tej samej kolejności. Nowy link zachowa aktualny układ.</p>}
    {!set.items.length ? <div className="cz-set-empty"><h3>Dodaj pierwszy materiał</h3><p>Trasy, wyprawy, filmy i fotografie możesz połączyć w jeden zestaw.</p></div> : <SetItems set={set} move={ordering ? (key,delta)=>{const rows=dispatch({type:'move',id:set.id,key,delta});const index=rows.find(row=>row.id===set.id)?.items.indexOf(key);setMessage(`Zmieniono kolejność. Pozycja ${index+1} z ${set.items.length}.`)} : undefined} remove={key=>{dispatch({type:'remove',id:set.id,key});setRemoved(key)}}/>}
  </>
}
export function SavedSetsPage() {
  const store=useSavedSets()
  const [active,setActive] = useState(''), [shared,setShared] = useState(null), [name,setTitle] = useState(''), [creating,setCreating] = useState(false), [notice,setNotice] = useState('')
  const titleRef=useRef(null)
  useEffect(()=>{
    const sync=()=>{const params=new URLSearchParams(location.hash.slice(1));setShared(params.has('zestaw')?decodeSharedSet(params.get('zestaw')):null);setActive(new URLSearchParams(location.search).get('zestaw') || '')}
    sync();window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync)
    return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync)}
  },[])
  const open=id=>{history.pushState({},'',`/zapisane?widok=zestawy${id?`&zestaw=${encodeURIComponent(id)}`:''}`);setActive(id);setShared(null);setNotice('');requestAnimationFrame(()=>titleRef.current?.focus())}
  const create=(title,items=[])=>{
    const id=crypto.randomUUID(),rows=store.dispatch({type:'create',id,name:title,items})
    if(rows.some(row=>row.id===id)){setCreating(false);setTitle('');open(id);return true}
    setNotice('Nie udało się dodać zestawu. Sprawdź nazwę lub limit 20 zestawów.');return false
  }
  const selected=store.sets.find(set=>set.id===active)
  return <CollectionShell section="zapisane" className="cz-saved-page cz-sets-page" preserveFragment>
    <div className="cz-gallery-intro"><h1 ref={titleRef} tabIndex={-1}>{shared ? 'Udostępniony zestaw' : 'Zapisane'}</h1></div><SavedNavigation sets/>
    {!shared && <><p className="cz-saved-intro">Zbierz materiały na kolejny wyjazd albo wróć do ulubionych miejsc.</p><p className="cz-saved-local">Zestawy zostają w tej przeglądarce. Bez konta i automatycznej synchronizacji. Wyczyszczenie danych witryny usuwa je.</p></>}
    {!store.persistent && <p className="cz-saved-storage" role="status">Pamięć przeglądarki jest niedostępna. Zmiany działają tylko do opuszczenia strony. Możesz zachować zestaw, kopiując link.</p>}
    {!shared && <SavedBackup/>}
    {notice&&<p role="status">{notice}</p>}
    {!store.ready ? <p role="status">Wczytuję zestawy…</p> : shared ? shared.error ? <div className="cz-set-empty"><h2>Nieprawidłowy link</h2><p role="alert">{shared.error}</p><a href="/zapisane?widok=zestawy">Przejdź do swoich zestawów ↗</a></div> : <>
      <header className="cz-set-heading"><div><p className="cz-set-kicker">Kopia udostępniona linkiem · {materialCount(shared.set.items.length)}</p><h2>{shared.set.name}</h2></div><button className="cz-set-primary" disabled={store.sets.length>=MAX_SETS || !shared.set.items.length} onClick={()=>create(shared.set.name,shared.set.items)}>Zapisz kopię u siebie</button></header>
      <p className="cz-set-muted">Możesz przeglądać materiały i porównywać trasy. Zapisanie kopii pozwoli Ci ją edytować; nie zmieni zestawu nadawcy.</p>
      {store.sets.length>=MAX_SETS&&<p>Masz już 20 zestawów. Usuń jeden ze swoich, aby zapisać kopię.</p>}
      {shared.missing>0&&<p role="status">Niedostępne materiały pominięto: {shared.missing}.</p>}
      <SetItems key={JSON.stringify(shared.set)} set={shared.set}/>
    </> : selected ? <SetEditor key={selected.id} set={selected} dispatch={store.dispatch} back={()=>open('')}/> : <>
      {active&&<p role="status">Ten zestaw nie jest zapisany w tej przeglądarce. Do wysłania go użyj przycisku „Udostępnij zestaw”.</p>}
      <div className="cz-set-index-heading"><h2>Moje zestawy <small>{store.sets.length} / {MAX_SETS}</small></h2><button className="cz-set-primary" disabled={store.sets.length>=MAX_SETS} onClick={()=>setCreating(!creating)} aria-expanded={creating}>+ Nowy zestaw</button></div>
      {creating&&<form className="cz-set-form" onSubmit={e=>{e.preventDefault();create(name)}}><label>Nazwa nowego zestawu<input autoFocus required maxLength={64} placeholder="Np. Tatry na weekend" value={name} onChange={e=>setTitle(e.target.value)}/></label><button type="submit" disabled={!setName(name)}>Utwórz zestaw</button></form>}
      {!store.sets.length&&<div className="cz-set-empty"><h3>Własna lista na wyjazd</h3><p>Nadaj nazwę, dodaj materiały i podziel się nimi jednym linkiem.</p></div>}
      <div className="cz-set-grid">{store.sets.map(set=>{
        const cover=set.items.map(key=>savedByKey.get(key)).find(item=>item?.photo)
        return <button key={set.id} className="cz-set-tile" onClick={()=>open(set.id)}>{cover ? <ResponsivePhoto photo={cover.photo} sizes="(max-width:600px) 90vw, 400px" loading="lazy"/> : <div className="cz-set-tile-placeholder" aria-hidden="true">↗</div>}<span><strong>{set.name}</strong><small>{materialCount(set.items.length)}{Object.entries(types).filter(([type])=>set.items.some(key=>savedByKey.get(key)?.type===type)).map(([type,label])=>` · ${label}: ${set.items.filter(key=>savedByKey.get(key)?.type===type).length}`)}</small></span></button>
      })}</div>
    </>}
  </CollectionShell>
}
