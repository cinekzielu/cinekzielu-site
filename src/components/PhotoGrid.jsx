import React, { useEffect, useRef, useState } from 'react'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoSelectionDock } from './PhotoSelectionDock'
import { PhotoComparison } from './PhotoComparison'
import { PhotoViewer } from './PhotoViewer'
import { linkedPhotoIndex, photoViewUrl } from '../data/photoView'
import { SaveButton } from './SavedItems'
import { PhotoSetSelection } from './PhotoSetSelection'
import { MAX_SET_ITEMS } from '../data/savedSets'
import { savedPhotoKey } from '../data/savedItems'

function useColumns(featured) {
  const get = () => window.matchMedia('(max-width:600px)').matches ? 1 : featured || window.matchMedia('(max-width:900px)').matches ? 2 : 3
  const [columns, setColumns] = useState(featured ? 2 : 3)
  useEffect(() => {
    const queries = [window.matchMedia('(max-width:600px)'), window.matchMedia('(max-width:900px)')]
    const update = () => setColumns(get())
    update()
    queries.forEach(query => query.addEventListener('change', update))
    return () => queries.forEach(query => query.removeEventListener('change', update))
  }, [featured])
  return columns
}

export function PhotoGrid({ gallery, featured = false, previewLimit = null, eagerFirst = true, shareable = false, selectable = false }) {
  const isVideoFrames = gallery.mediaKind === 'video-frames'
  const columns = useColumns(featured)
  const [current, setCurrent] = useState(null)
  const [selecting, setSelecting] = useState(false)
  const [selection, setSelection] = useState([])
  const [comparing,setComparing] = useState(false), [pair,setPair] = useState([]), [comparison,setComparison] = useState(null)
  const comparisonTrigger = useRef(null)
  const openComparison = event => {comparisonTrigger.current=event.currentTarget;setComparison(pair.map(index=>({...gallery.photos[index],number:index+1})))}
  const endComparison = () => {setComparing(false);setPair([])}
  const choosePair = index => setPair(previous => previous.includes(index) ? previous.filter(value=>value!==index) : previous.length < 2 ? [...previous,index] : previous)
  const selected = gallery.photos.map(savedPhotoKey).filter(key => key && selection.includes(key))
  const toggle = key => setSelection(previous => previous.includes(key) ? previous.filter(item => item !== key) : previous.length < MAX_SET_ITEMS ? [...previous,key] : previous)
  const trigger = useRef(null)
  const updateLinkedUrl = photo => {
    if (!shareable || !new URLSearchParams(window.location.search).has('zdjecie')) return
    const url = new URL(window.location.href)
    if (photo) url.searchParams.set('zdjecie', new URL(photoViewUrl(url.href, photo)).searchParams.get('zdjecie'))
    else url.searchParams.delete('zdjecie')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }
  const close = () => { setCurrent(null); updateLinkedUrl(null) }
  const step = delta => {
    const next = (current + delta + gallery.photos.length) % gallery.photos.length
    updateLinkedUrl(gallery.photos[next]); setCurrent(next)
  }
  useEffect(() => {
    if (!shareable) return
    const sync = () => setCurrent(linkedPhotoIndex(gallery.photos, window.location.search))
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [shareable, gallery.photos])

  const visiblePhotos = previewLimit === null ? gallery.photos : gallery.photos.slice(0, previewLimit)
  const rows = featured ? [{ start: 0, items: visiblePhotos.slice(0, 1) }] : []
  for (let index = featured ? 1 : 0; index < visiblePhotos.length; index += columns) rows.push({ start: index, items: visiblePhotos.slice(index, index + columns) })
  return <>
    {selectable && !isVideoFrames && <PhotoSetSelection active={selecting} selected={selected} title={gallery.title} onStart={()=>{setSelecting(true);setComparing(false);setPair([])}} onCancel={()=>{setSelecting(false);setSelection([])}} onClear={()=>setSelection([])}/>}
    {selectable && !isVideoFrames && !selecting && <div className="cz-photo-compare-entry">{!comparing ? <button disabled={gallery.photos.length<2} onClick={()=>setComparing(true)}>Porównaj dwa zdjęcia</button> : <><span role="status">Wybierz dwa zdjęcia: {pair.length} / 2</span><button disabled={pair.length!==2} onClick={openComparison}>Otwórz porównanie</button><button onClick={endComparison}>Zakończ porównywanie</button></>}</div>}
    {comparing && <PhotoSelectionDock><strong aria-live="polite">Do porównania: {pair.length} / 2</strong><button disabled={pair.length!==2} onClick={openComparison}>Porównaj zdjęcia</button><button onClick={endComparison}>Zakończ</button></PhotoSelectionDock>}
    <section style={selecting || comparing ? {paddingBottom:110} : undefined} className={`cz-gallery-grid${featured ? ' cz-portfolio-grid' : ''}`} aria-label={featured ? 'Wybrane fotografie' : `${gallery.title} — ${isVideoFrames ? 'kadry z nagrań' : 'zdjęcia z wyprawy'}`}>
      {rows.map(row => <div className="cz-photo-row" key={row.start}>
        {row.items.map((item, column) => {
          const index = row.start + column
          const lead = featured && index === 0
          const rowRatio = row.items.reduce((sum, image) => sum + image.width / image.height, 0)
          const fraction = (item.width / item.height) / rowRatio
          const sizes = columns === 1 || lead ? '(max-width:600px) calc(100vw - 28px), (max-width:900px) calc(100vw - 40px), (max-width:1448px) calc(100vw - 88px), 1360px' : `(max-width:600px) calc(100vw - 28px), (max-width:900px) calc(${100 * fraction}vw - ${(40 + 12 * (row.items.length - 1)) * fraction}px), (max-width:1448px) calc(${100 * fraction}vw - ${(88 + 16 * (row.items.length - 1)) * fraction}px), ${(1360 - 16 * (row.items.length - 1)) * fraction}px`
          const key = savedPhotoKey(item)
          const checked = selected.includes(key)
          return <div className={`cz-photo-frame${(selecting && checked) || (comparing && pair.includes(index)) ? ' is-selected' : ''}`} key={item.src} style={{ '--ratio': item.width / item.height }}><button className="cz-photo" type="button" disabled={selecting && (!key || (!checked && selected.length >= MAX_SET_ITEMS)) || comparing && !pair.includes(index) && pair.length===2} aria-pressed={selecting ? checked : comparing ? pair.includes(index) : undefined} onClick={event => { if(selecting){toggle(key);return} if(comparing){choosePair(index);return} trigger.current = event.currentTarget; setCurrent(index) }} aria-label={`${selecting || comparing ? 'Wybierz' : 'Otwórz'} ${isVideoFrames ? 'kadr' : 'zdjęcie'} ${String(index + 1).padStart(2, '0')} z ${gallery.photos.length}`}>
            <ResponsivePhoto photo={item} full={featured} sizes={sizes} loading={eagerFirst && index === 0 ? 'eager' : 'lazy'} fetchPriority={eagerFirst && index === 0 ? 'high' : undefined} />
          </button>{selecting ? <span className="cz-photo-selection-mark" aria-hidden="true">{checked ? '✓' : '+'}</span> : comparing ? <span className="cz-photo-selection-mark" aria-hidden="true">{pair.includes(index) ? (pair.indexOf(index)===0?'A':'B') : '+'}</span> : <SaveButton itemKey={key} iconOnly />}</div>
        })}
      </div>)}
    </section>
    {comparison && <PhotoComparison photos={comparison} title={gallery.title} trigger={comparisonTrigger} onClose={()=>setComparison(null)}/>}
    {current !== null && <PhotoViewer gallery={gallery} current={current} onStep={step} onClose={close} shareable={shareable} trigger={trigger} />}
  </>
}
