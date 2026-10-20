import React, { useId, useLayoutEffect, useRef } from 'react'
import './HeroLogo.css'

const SESSION_KEY = 'cz.hero-logo.v2'
let playedInMemory = false
const clamp = value => Math.max(0, Math.min(1, value))
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t) }
const glide = value => 1 - Math.pow(1 - clamp(value), 2.2)

export function HeroLogo() {
  const root = useRef(null)
  const id = useId().replace(/:/g, '')
  const clipId = `cz-hero-window-${id}`
  const titleId = `cz-hero-title-${id}`

  useLayoutEffect(() => {
    const svg = root.current
    const symbol = svg.querySelector('.cz-symbol')
    const reveal = svg.querySelector('.cz-text-reveal')
    const flight = svg.querySelector('.cz-flight')
    const movement = svg.querySelector('.cz-flight-move')
    const mass = svg.querySelector('.cz-flight-mass')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let start = 0
    let elapsed = 0
    let running = false
    let complete = false
    const remember = () => {
      playedInMemory = true
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* Memory fallback. */ }
    }
    const finish = () => {
      cancelAnimationFrame(frame)
      running = false
      complete = true
      remember()
      symbol.style.opacity = '1'
      reveal.setAttribute('d', 'M0 -8 H3200 V454 H0 Z')
      flight.style.opacity = '0'
      mass.style.opacity = '0'
      movement.setAttribute('transform', 'translate(0 0) scale(1)')
      svg.dataset.intro = 'complete'
      document.documentElement.removeAttribute('data-cz-logo-pending')
    }
    let played = playedInMemory
    try { played ||= sessionStorage.getItem(SESSION_KEY) === '1' } catch { /* Storage may be disabled. */ }
    if (played || reduce.matches) { finish(); return }

    function draw(now) {
      const time = now - start
      const scale = 1 + .82 * (1 - smooth((time - 780) / 1050))
      const tx = 1390 * (1 - glide(time / 1780))
      const ty = 438 * (1 - scale)
      movement.setAttribute('transform', `translate(${tx} ${ty}) scale(${scale})`)
      const peakX = tx + 319 * scale
      const peakY = ty + 214 * scale
      const slope = 223 / 224
      const separation = 8 * (1 - smooth((time - 1400) / 300))
      const topX = (peakY > -8 ? peakX : peakX + (-8 - peakY) * slope) + separation
      const bottomX = peakX + (454 - peakY) * slope + separation
      const corner = peakY > -8 && peakY < 454 ? ` L${peakX + separation} ${peakY}` : ''
      reveal.setAttribute('d', `M${topX} -8 H3200 V454 H${bottomX}${corner} Z`)
      symbol.style.opacity = String(smooth((time - 1310) / 360))
      mass.style.opacity = String(1 - smooth((time - 1740) / 310))
      if (time < 2150) frame = requestAnimationFrame(draw)
      else finish()
    }
    // Prepare the first frame without consuming the session in a background tab.
    symbol.style.opacity = '0'
    reveal.setAttribute('d', 'M3200 -8 H3200 V454 H3200 Z')
    flight.style.opacity = '0'
    svg.dataset.intro = 'waiting'
    document.documentElement.removeAttribute('data-cz-logo-pending')
    const isOnScreen = () => {
      const rect = svg.getBoundingClientRect()
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0
    }
    const resume = () => {
      if (complete || running || document.hidden || !isOnScreen()) return
      if (reduce.matches) { finish(); return }
      running = true
      start = performance.now() - elapsed
      flight.style.opacity = '1'
      svg.dataset.intro = 'playing'
      draw(performance.now())
    }
    const onVisibility = () => {
      if (document.hidden && running) {
        elapsed = Math.min(2150, performance.now() - start)
        cancelAnimationFrame(frame)
        running = false
        svg.dataset.intro = 'paused'
      } else resume()
    }
    const onReduce = () => { if (reduce.matches) finish() }
    const observer = new IntersectionObserver(resume, { threshold: 0.2 })
    observer.observe(svg)
    reduce.addEventListener('change', onReduce)
    document.addEventListener('visibilitychange', onVisibility)
    resume()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      reduce.removeEventListener('change', onReduce)
      document.removeEventListener('visibilitychange', onVisibility)
    }

  }, [])

  return (
<svg ref={root} className="cz-hero-logo" viewBox="0 0 1481 486" role="img" aria-labelledby={titleId}>
        <title id={titleId}>Cinek Zielu</title>
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path className="cz-text-reveal" d="M0 -8 H3200 V454 H0 Z"/>
          </clipPath>
        </defs>
        <g className="cz-original" fill="currentColor" transform="translate(24 24)">
          <path className="cz-symbol" d="M436 0 L532 96 H244 C162 96 98 153 98 224 C98 251 108 278 127 297 L276 148 H560 L358 350 H454 L542 438 H173 L358 253 L319 214 L242 291 L220 269 L93 396 C35 350 0 288 0 224 C0 99 112 0 244 0 Z"/>
          <g clipPath={`url(#${clipId})`}>
          <g className="cz-wordmark" transform="translate(624 0)">
            <path transform="translate(0 0)" d="M144 0 L188 44 H100 C69 44 46 67 46 100 C46 133 69 156 100 156 H188 L144 200 H100 C44.772 200 0 155.228 0 100 C0 44.772 44.772 0 100 0 Z"/>
            <path transform="translate(209 0)" d="M0 0 H48 V200 H0 Z"/>
            <path transform="translate(278 0)" d="M0 0 H48 L122 112 V0 H170 V200 H122 L48 88 V200 H0 Z"/>
            <path transform="translate(469 0)" d="M0 0 H101 L145 44 H48 V80 H92 L132 120 H48 V156 H101 L145 200 H0 Z"/>
            <path transform="translate(633 0)" d="M0 0 H48 V72 L120 0 H176 L90 86 L176 200 H120 L61 119 L48 132 V200 H0 Z"/>
            <path transform="translate(0 238)" d="M44 0 H188 L82 156 H144 L188 200 H0 L106 44 H0 Z"/>
            <path transform="translate(209 238)" d="M0 0 H48 V200 H0 Z"/>
            <path transform="translate(278 238)" d="M0 0 H126 L170 44 H48 V80 H117 L157 120 H48 V156 H126 L170 200 H0 Z"/>
            <path transform="translate(469 238)" d="M0 0 H48 V156 H101 L145 200 H0 Z"/>
            <path transform="translate(633 238)" d="M0 0 H48 V121 C48 144 61 156 88 156 C115 156 128 144 128 121 V0 H176 V124 C176 176 144 200 88 200 C32 200 0 176 0 124 Z"/>
          </g>
          </g>
        </g>
        <g className="cz-flight" transform="translate(24 24)" aria-hidden="true">
          <g className="cz-flight-move">
            <path className="cz-flight-mass" d="M51 438 L220 269 L242 291 L319 214 L542 438 Z"/>
          </g>
        </g>
      </svg>
  )
}
