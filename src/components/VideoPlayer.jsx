import React, { useEffect, useRef, useState } from 'react'
import { ExternalLink, RotateCcw } from 'lucide-react'
import { filmRegionLabel } from '../data/filmCatalog'
import { formatVideoTime, loadYouTubeAPI } from '../data/videoPlayer'

export function VideoPlayer({ video, onRestart }) {
  const mount = useRef(null)
  const [status, setStatus] = useState('loading')
  const [errorCode, setErrorCode] = useState(null)
  const { film, start, href } = video
  useEffect(() => {
    let cancelled = false, player
    const holder = document.createElement('div')
    mount.current.appendChild(holder)
    loadYouTubeAPI().then(YT => {
      if (cancelled) return
      player = new YT.Player(holder, {
        host:'https://www.youtube-nocookie.com', videoId:film.youtubeId, width:'100%', height:'100%',
        playerVars:{ autoplay:1, playsinline:1, rel:0, start, origin:window.location.origin, hl:'pl' },
        events:{
          onReady:event => {
            if (cancelled) return
            const frame = event.target.getIframe()
            frame.title=`Odtwarzacz YouTube: ${film.title}`
            frame.referrerPolicy='strict-origin-when-cross-origin'
            setStatus('ready')
          },
          onError:event => { if (!cancelled) { setErrorCode(event.data); setStatus('error') } },
        },
      })
    }).catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled=true; player?.destroy(); holder.remove() }
  }, [film.youtubeId, film.title, start])
  return <>
    <div className="cz-video-frame" data-player-status={status} data-player-error={errorCode}>
      <div className="cz-video-mount" ref={mount} hidden={status === 'error'} />
      {status === 'loading' && <p className="cz-video-status" role="status">Wczytywanie filmu…</p>}
      {status === 'error' && <div className="cz-video-error" role="status"><p>{[101,150].includes(errorCode) ? 'YouTube nie pozwala odtworzyć tego filmu na stronie.' : 'Nie udało się odtworzyć filmu tutaj.'}</p><a href={href} target="_blank" rel="noreferrer">Obejrzyj na YouTube <ExternalLink size={15} aria-hidden="true" /></a></div>}
    </div>
    <div className="cz-video-details"><p>{filmRegionLabel(film.region)} · {film.format} · {film.duration}{start > 0 && <span>Od {formatVideoTime(start)}</span>}</p>
      <div className="cz-video-actions">
        {start > 0 && <button type="button" onClick={onRestart}><RotateCcw size={14} aria-hidden="true" />Od początku</button>}
        {film.expeditionId && <><a href={`/wyprawy/${film.expeditionId}`}>Wyprawa ↗</a><a href={`/galerie/${film.expeditionId}`}>Galeria ↗</a></>}
        <a href={href} target="_blank" rel="noreferrer">Na YouTube <ExternalLink size={13} aria-hidden="true" /></a>
      </div>
    </div>
  </>
}
