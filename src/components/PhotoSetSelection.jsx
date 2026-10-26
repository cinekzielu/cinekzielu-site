import React, {useEffect,useRef,useState} from 'react'
import {PhotoSelectionDock} from './PhotoSelectionDock'
import {useSavedSets} from './useSavedSets'
import {MAX_SETS, MAX_SET_ITEMS, setName, sharedSetPath} from '../data/savedSets'
import '../photoSelection.css'

export function PhotoSetSelection({active, selected, title, onStart, onCancel, onClear}) {
  const store = useSavedSets()
  const [picker,setPicker] = useState(false)
  const dialog=useRef(null),dockTrigger=useRef(null),dockExit=useRef(null)
  useEffect(()=>{
    if(!picker)return
    const element=dialog.current,body=document.body.style.overflow,root=document.documentElement.style.overflow
    document.body.style.overflow=document.documentElement.style.overflow='hidden';element.showModal()
    return()=>{element.close();document.body.style.overflow=body;document.documentElement.style.overflow=root;(dockTrigger.current?.disabled?dockExit.current:dockTrigger.current)?.focus({preventScroll:true})}
  },[picker])
  const [target,setTarget] = useState(''), [name,setTitle] = useState(title)
  const [notice,setNotice] = useState(''), [saved,setSaved] = useState(null)
  const existing = store.sets.find(set => set.id === target)
  const additions = selected.filter(key => !existing?.items.includes(key))
  const overflow = (existing?.items.length || 0) + additions.length > MAX_SET_ITEMS
  const save = event => {
    event.preventDefault()
    const id = target || crypto.randomUUID()
    const rows = store.dispatch(target ? {type:'addMany',id,keys:selected} : {type:'create',id,name,items:selected})
    const result = rows.find(set => set.id === id)
    if (!result || !selected.every(key => result.items.includes(key))) {
      setNotice('Nie zmieniono zestawu. Sprawdź, czy nadal istnieje i ma miejsce na cały wybór.');return
    }
    setSaved(result);setNotice('Wybrane fotografie są w zestawie.');onClear();setPicker(false)
  }
  const fields = () => <>
      <form onSubmit={save}><label>Zestaw<select value={target} onChange={event=>{setTarget(event.target.value);setNotice('')}}><option value="">Nowy zestaw</option>{store.sets.map(set=><option key={set.id} value={set.id}>{set.name} · {set.items.length}/{MAX_SET_ITEMS}</option>)}</select></label>
        {!target && <label>Nazwa nowego zestawu<input maxLength={64} value={name} required onChange={event=>setTitle(event.target.value)}/></label>}
        <button type="submit" disabled={!store.ready || !selected.length || overflow || (target ? !existing : !setName(name) || store.sets.length >= MAX_SETS)}>Dodaj wybrane zdjęcia</button>
      </form>
      {existing && selected.length > 0 && <p>Nowe zdjęcia: {additions.length}. Już w zestawie: {selected.length-additions.length}.</p>}
      {overflow && <p role="status">Za dużo zdjęć dla tego zestawu. Wybierz inny lub odznacz część zdjęć — limit to {MAX_SET_ITEMS} materiałów.</p>}
      {!target && store.sets.length >= MAX_SETS && <p>Masz już {MAX_SETS} zestawów. Wybierz istniejący.</p>}
  </>
  return <section className="cz-photo-selection" aria-label="Wybieranie fotografii do zestawu">
    {!active ? <button onClick={onStart}>Wybierz zdjęcia do zestawu</button> : <>
      <div className="cz-photo-selection-bar"><strong aria-live="polite">Wybrane: {selected.length} / {MAX_SET_ITEMS}</strong><button disabled={!selected.length} onClick={onClear}>Odznacz wszystkie</button><button onClick={onCancel}>Zakończ wybieranie</button></div>
      <p>Kliknij fotografie poniżej. Zostaną dodane w kolejności z galerii. Zmiana galerii lub etapu czyści niezapisany wybór.</p>
      {selected.length === MAX_SET_ITEMS && <p role="status">Wybrano maksymalnie {MAX_SET_ITEMS} zdjęć. Odznacz jedno, aby wybrać inne.</p>}
      {fields()}
    </>}
    {active && <PhotoSelectionDock><strong aria-live="polite">Wybrane: {selected.length} / {MAX_SET_ITEMS}</strong><button ref={dockTrigger} disabled={!selected.length} onClick={()=>setPicker(true)}>Dodaj do zestawu</button><button ref={dockExit} onClick={onCancel}>Zakończ</button>{saved && !selected.length && <a href={store.persistent ? `/zapisane?widok=zestawy&zestaw=${encodeURIComponent(saved.id)}` : sharedSetPath(saved)}>Otwórz zestaw ↗</a>}{notice && <span role="status">{notice}</span>}</PhotoSelectionDock>}
    {picker && <dialog ref={dialog} className="cz-photo-set-dialog" aria-label="Dodaj wybrane zdjęcia do zestawu" onCancel={event=>{event.preventDefault();setPicker(false)}}><header><h2>Dodaj do zestawu</h2><button onClick={()=>setPicker(false)} autoFocus>Zamknij ×</button></header><p>Wybrane zdjęcia: {selected.length}. Wybór pozostanie zaznaczony po zamknięciu tego okna.</p>{fields()}{notice && <p role="status">{notice}</p>}{!store.persistent && <p role="alert">Pamięć przeglądarki jest niedostępna. Zmiany nie zostaną trwale zapisane.</p>}</dialog>}
    {notice && !active && <p role="status">{notice}</p>}
    {saved && <a href={store.persistent ? `/zapisane?widok=zestawy&zestaw=${encodeURIComponent(saved.id)}` : sharedSetPath(saved)}>Otwórz zestaw „{saved.name}” ↗</a>}
    {!store.persistent && <p role="alert">Pamięć przeglądarki jest niedostępna. Wybór pozostaje tylko na tej stronie; nie został trwale zapisany.</p>}
  </section>
}
