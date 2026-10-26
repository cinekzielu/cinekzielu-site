import React, {useEffect,useRef,useState} from 'react'
import {savedByKey,SAVED_STORAGE_KEY} from '../data/savedItems'
import {SETS_KEY} from '../data/savedSets'
import {BACKUP_MAX_BYTES,SAVED_CHANGED_EVENT,commitSavedBackup,decodeSavedBackup,encodeSavedBackup,mergeSavedBackup,readSavedSnapshot,snapshotSignature} from '../data/savedBackup'
import '../savedBackup.css'

export function SavedBackup() {
  const [expanded,setExpanded]=useState(false),[current,setCurrent]=useState(null),[incoming,setIncoming]=useState(null)
  const [error,setError]=useState(''),[notice,setNotice]=useState(''),[reading,setReading]=useState(false)
  const input=useRef(null),revision=useRef(0)
  const refresh=()=>{try{setCurrent(readSavedSnapshot(localStorage))}catch{setCurrent(null);setError('Pamięć przeglądarki jest niedostępna. Nie można teraz odczytać ani przywrócić kopii.')}}
  useEffect(()=>{
    refresh()
    const sync=event=>{if(event.type===SAVED_CHANGED_EVENT||event.key===null||event.key===SAVED_STORAGE_KEY||event.key===SETS_KEY)refresh()}
    window.addEventListener('storage',sync);window.addEventListener(SAVED_CHANGED_EVENT,sync)
    return()=>{revision.current++;window.removeEventListener('storage',sync);window.removeEventListener(SAVED_CHANGED_EVENT,sync)}
  },[])
  const plan=incoming&&current?mergeSavedBackup(current,incoming):null
  const cancel=()=>{revision.current++;setIncoming(null);setReading(false);setError('');setNotice('');if(input.current)input.current.value=''}
  const read=async event=>{
    const file=event.target.files?.[0],version=++revision.current
    setIncoming(null);setError('');setNotice('')
    if(!file)return
    setReading(true)
    try {
      if(file.size>BACKUP_MAX_BYTES)throw Error('Plik jest za duży. Maksymalny rozmiar to 1 MB.')
      const decoded=decodeSavedBackup(await file.text())
      if(version!==revision.current)return
      setCurrent(readSavedSnapshot(localStorage));setIncoming(decoded)
    }catch(problem){if(version===revision.current)setError(problem.message || 'Nie udało się odczytać kopii.')}
    finally{if(version===revision.current)setReading(false)}
  }
  const download=()=>{
    try {
      const snapshot=readSavedSnapshot(localStorage);setCurrent(snapshot)
      const blob=new Blob([encodeSavedBackup(snapshot)],{type:'application/json;charset=utf-8'})
      const url=URL.createObjectURL(blob),link=document.createElement('a')
      link.href=url;link.download=`cinek-zielu-zapisane-${new Date().toISOString().slice(0,10)}.json`
      document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
      setError('');setNotice('Kopia została przygotowana do pobrania. Zawiera zakładki i zestawy, bez plików zdjęć i filmów.')
    }catch{setError('Nie udało się przygotować kopii. Sprawdź dostęp do pamięci przeglądarki.')}
  }
  const restore=()=>{
    if(!incoming||!current||plan?.error)return
    try {
      const result=commitSavedBackup(localStorage,incoming,snapshotSignature(current))
      if(result.changed){setCurrent(result.current);setNotice('Zapisane zmieniły się w międzyczasie. Sprawdź odświeżony podgląd i ponownie wybierz „Połącz z moimi zapisami”.');return}
      if(result.error){setError(result.error);if(result.refresh)window.dispatchEvent(new Event(SAVED_CHANGED_EVENT));return}
      setCurrent(result.snapshot);setIncoming(null);if(input.current)input.current.value=''
      setError('');setNotice(`Połączono kopię. Nowe zakładki: ${result.addedSaved}, nowe zestawy: ${result.addedSets}, uzupełnione zestawy: ${result.updatedSets}.`)
      window.dispatchEvent(new Event(SAVED_CHANGED_EVENT))
    }catch{setError('Nie udało się odczytać pamięci przeglądarki. Import nie został rozpoczęty.')}
  }
  return <section className="cz-saved-backup" aria-label="Kopia zapasowa Zapisanych">
    <button className="cz-backup-toggle" aria-expanded={expanded} onClick={()=>{if(!expanded)refresh();setExpanded(!expanded)}}>Kopia zapasowa {expanded?'−':'+'}</button>
    {expanded&&<div className="cz-backup-content">
      <p>Pobierz zakładki i zestawy do pliku. Możesz je później wczytać tutaj lub na innym urządzeniu. Plik zawiera też nazwy Twoich zestawów; nie zawiera zdjęć ani filmów.</p>
      <div className="cz-backup-actions"><button disabled={!current} onClick={download}>Pobierz kopię</button><label>Wczytaj kopię<input ref={input} type="file" accept=".json,application/json" disabled={!current} onChange={read}/></label></div>
      {reading&&<p role="status">Odczytuję plik…</p>}
      {incoming&&plan&&<div className="cz-backup-preview">
        <h3>Podgląd kopii</h3><p>Zakładki: {incoming.saved.length} · zestawy: {incoming.sets.length}</p>
        {incoming.missing>0&&<p>Niedostępne materiały pominięto: {incoming.missing}.</p>}
        <p>Obecne materiały i ich kolejność pozostaną. Nowe dopiszemy na końcu. Dla tego samego zestawu zachowamy obecną nazwę; identycznych kopii nie dodamy ponownie.</p>
        {incoming.saved.length>0&&<details><summary>Zakładki z pliku · {incoming.saved.length}</summary><ul>{incoming.saved.map(key=><li key={key}>{savedByKey.get(key)?.accessibleTitle||savedByKey.get(key)?.title}</li>)}</ul></details>}
        {incoming.sets.map(set=><details key={set.id}><summary>{set.name} · {set.items.length} materiałów</summary><ol>{set.items.map(key=><li key={key}>{savedByKey.get(key)?.accessibleTitle||savedByKey.get(key)?.title}</li>)}</ol></details>)}
        {plan.error?<p role="alert">{plan.error}</p>:<p>Nowe zakładki: {plan.addedSaved} · nowe zestawy: {plan.addedSets} · uzupełnione zestawy: {plan.updatedSets} · zestawy już obecne: {plan.skippedSets}</p>}
        <div className="cz-backup-actions"><button disabled={!!plan.error||!(plan.addedSaved||plan.addedSets||plan.updatedSets)} onClick={restore}>Połącz z moimi zapisami</button><button onClick={cancel}>Anuluj import</button></div>
        {!plan.error&&!(plan.addedSaved||plan.addedSets||plan.updatedSets)&&<p role="status">Wszystkie dostępne materiały z tej kopii są już zapisane.</p>}
      </div>}
      {error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
      <p className="cz-backup-note">Plik jest odczytywany na tym urządzeniu i nie jest wysyłany na serwer.</p>
    </div>}
  </section>
}
