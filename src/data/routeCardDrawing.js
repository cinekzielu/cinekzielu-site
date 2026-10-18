import { mercator } from './terrainMap.js'

export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350
const gold = '#d9b678', cream = '#f2eadc', muted = '#b7ac98'
const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })

export function cardGeometry(track) {
  const segments = []
  track.points.forEach(([lat, lng, elevation, section, distance], i) => {
    if (!i || section !== track.points[i - 1][3]) segments.push([])
    segments.at(-1).push({ ...mercator({ lat, lng }), elevation, distance })
  })
  const points = segments.flat()
  const bounds = key => [Math.min(...points.map(p => p[key])), Math.max(...points.map(p => p[key]))]
  const [left, right] = bounds('x'), [top, bottom] = bounds('y'), [low, high] = bounds('elevation')
  const scale = Math.min(800 / Math.max(right - left, 1e-9), 430 / Math.max(bottom - top, 1e-9))
  return { segments, low, high,
    map: p => [540 + (p.x - (left + right) / 2) * scale, 570 + (p.y - (top + bottom) / 2) * scale],
    profile: p => [100 + p.distance / Math.max(track.distance, 1) * 880, 1100 - (p.elevation - low) / Math.max(high - low, 1) * 145],
  }
}

export function drawRouteCard(canvas, route, row, track, peak) {
  canvas.width = CARD_WIDTH; canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')
  const text = (value, x, y, size = 24, color = cream, heading = false) => {
    ctx.fillStyle = color; ctx.font = `${size}px ${heading ? '"Cinek Zielu Abstract",' : ''} Arial, sans-serif`
    ctx.letterSpacing = heading ? `${size * .01}px` : '0px'
    ctx.fillText(value, x, y)
  }
  const line = (x, y, x2, y2, color = '#393329') => {
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke()
  }
  ctx.fillStyle = '#15130f'; ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
  text('CINEK ZIELU', 64, 78, 25, gold)
  ctx.textAlign = 'right'; text('ZAPIS TRASY', 1016, 78, 19, muted); ctx.textAlign = 'left'
  line(64, 105, 1016, 105)
  // Fit long Polish route names without cropping or changing the chosen font.
  let lines, size = 64
  do {
    ctx.font = `${size}px "Cinek Zielu Abstract", Arial, sans-serif`; ctx.letterSpacing = `${size * .01}px`
    lines = ['']
    for (const word of route.title.split(/\s+/)) {
      const candidate = `${lines.at(-1)} ${word}`.trim()
      if (ctx.measureText(candidate).width > 952 && lines.at(-1)) lines.push(word)
      else lines[lines.length - 1] = candidate
    }
    if (lines.length <= 2) break
    size -= 2
  } while (size > 30)
  lines.forEach((value, i) => text(value, 64, 180 + i * (size + 10), size, cream, true))
  text(`${row.region} · ${route.dates}`, 64, 298, 24, muted)
  ctx.fillStyle = '#1b1914'; ctx.fillRect(64, 330, 952, 490)
  for (let x = 100; x < 1016; x += 80) line(x, 330, x, 820, '#24221b')
  for (let y = 360; y < 820; y += 80) line(64, y, 1016, y, '#24221b')
  const geometry = cardGeometry(track)
  const stroke = (project, width) => {
    ctx.strokeStyle = gold; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round'
    geometry.segments.forEach(segment => {
      ctx.beginPath(); segment.forEach((p, i) => { const [x, y] = project(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }); ctx.stroke()
    })
  }
  stroke(geometry.map, 4)
  const start = geometry.map(geometry.segments[0][0])
  ctx.beginPath(); ctx.arc(...start, 7, 0, Math.PI * 2); ctx.fillStyle = cream; ctx.fill()
  text('PRZEBIEG GPS', 84, 363, 17, muted)
  ctx.textAlign = 'right'; text('N ↑', 992, 363, 20, gold); ctx.textAlign = 'left'
  text('Schemat trasy · jasny punkt: początek zapisu', 84, 800, 17, muted)
  const metrics = [
    [`${number(row.distance / 1000, 1)} km`, 'Dystans zapisu'],
    [`≈ ${number(row.ascentEstimate)} m`, 'Suma podejść · GPS'],
    [peak ? `${number(peak.altitude)} m` : '—', 'Najwyższy szczyt'],
  ]
  metrics.forEach(([value, label], i) => { text(value, 64 + i * 324, 883, 36); text(label, 64 + i * 324, 918, 19, muted) })
  for (const [fraction, value] of [[0, geometry.high], [1, geometry.low]]) {
    const y = 955 + fraction * 145; line(100, y, 980, y)
    text(`${number(value)} m`, 100, y - 10, 17, muted)
  }
  stroke(geometry.profile, 3)
  text('0 km', 100, 1135, 18, muted); ctx.textAlign = 'right'
  text(`${number(track.distance / 1000, 1)} km`, 980, 1135, 18, muted); ctx.textAlign = 'left'
  text('Profil wysokości z GPS · przerwy w zapisie pozostają rozdzielone', 64, 1180, 19, muted)
  if (peak) text(`Szczyt: ${peak.name} · wysokość niezależna od pomiaru GPS`, 64, 1214, 19, muted)
  line(64, 1244, 1016, 1244)
  text('cinekzielu.pl/trasy', 64, 1295, 25, gold)
  ctx.textAlign = 'right'; text('Dane z zapisu · nie opis trudności', 1016, 1295, 18, muted)
  ctx.textAlign = 'left'
}
