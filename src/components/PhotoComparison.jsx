import React, {useEffect, useRef, useState} from 'react'
import '../photoComparison.css'

export function PhotoComparison({photos, title, trigger, onClose}) {
  const dialog = useRef(null)
  const [active,setActive] = useState(0)
  const [failed,setFailed] = useState({})
  useEffect(()=>{
    const element=dialog.current, body=document.body.style.overflow, root=document.documentElement.style.overflow
    document.body.style.overflow=document.documentElement.style.overflow='hidden'
    element.showModal()
    return ()=>{element.close();document.body.style.overflow=body;document.documentElement.style.overflow=root;trigger.current?.focus({preventScroll:true})}
  },[])
  return <dialog ref={dialog} className="cz-photo-compare" aria-label={`Porównanie zdjęć — ${title}`} onCancel={event=>{event.preventDefault();onClose()}} onKeyDown={event=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();setActive(event.key==='ArrowLeft'?0:1)}
  }}>
    <header><div><strong>Porównanie zdjęć</strong><span>{title}</span></div><button autoFocus onClick={onClose}>Zamknij porównanie ×</button></header>
    <div className="cz-photo-compare-switch" role="group" aria-label="Wyświetlane zdjęcie"><button aria-pressed={active===0} onClick={()=>setActive(0)}>A · zdjęcie {photos[0].number}</button><button aria-pressed={active===1} onClick={()=>setActive(1)}>B · zdjęcie {photos[1].number}</button></div>
    <div className="cz-photo-compare-pair">{photos.map((photo,i)=><figure key={photo.full} className={active===i?'is-active':''}>
      {failed[photo.full] ? <p role="status">Nie udało się wczytać zdjęcia. <button onClick={()=>setFailed(previous=>({...previous,[photo.full]:false}))}>Spróbuj ponownie</button></p> : <img src={photo.full} alt={photo.alt} width={photo.width} height={photo.height} onError={()=>setFailed(previous=>({...previous,[photo.full]:true}))}/>}
      <figcaption>{i===0?'A':'B'} · zdjęcie {photo.number}<span>{photo.alt}</span></figcaption>
    </figure>)}</div>
    <p className="cz-photo-compare-hint">Pełne kadry, bez przycinania. <span>Przełączaj A/B przyciskami lub strzałkami.</span></p>
  </dialog>
}
