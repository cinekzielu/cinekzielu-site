import { portfolioPhotos, photographyCollections } from './portfolioData.js'
import { photoViewId } from './photoView.js'
import { author } from './authorData.js'

export const WALL_PATH = '/fotografia/sciana'
export const STORAGE_KEY = 'cz-photo-wall-v1'
export const WALL_WIDTH = 300
export const WALL_HEIGHT = 200

// Only the author's existing portfolio is available in saved and shared walls.
// The asset filename remains stable when the portfolio is reordered.
export const wallPhotos = portfolioPhotos.map(photo => ({
  ...photo,
  id: photoViewId(photo),
  title: photo.alt,
  collectionIds: photographyCollections.filter(collection => collection.photos.some(item => item.full === photo.full)).map(collection => collection.id),
}))
export const wallPhotoById = new Map(wallPhotos.map(photo => [photo.id, photo]))

export const WALL_COLORS = [
  { id: 'linen', label: 'Ciepła biel', color: '#e5e0d7' },
  { id: 'grey', label: 'Szarość', color: '#b8b7b4' },
  { id: 'graphite', label: 'Grafit', color: '#454749' },
]
export const FRAME_COLORS = [
  { id: 'black', label: 'Czarna', color: '#242321' },
  { id: 'white', label: 'Biała', color: '#f3f0e9' },
  { id: 'wood', label: 'Drewno', color: '#a67e52' },
]
// These are composition preferences, not a claim of available print products.
export const PRINT_FORMATS = [
  { id: '40x30', label: '40 × 30 cm', width: 40, height: 30 },
  { id: '60x40', label: '60 × 40 cm', width: 60, height: 40 },
  { id: '70x50', label: '70 × 50 cm', width: 70, height: 50 },
  { id: '30x40', label: '30 × 40 cm', width: 30, height: 40 },
  { id: '40x60', label: '40 × 60 cm', width: 40, height: 60 },
  { id: '50x70', label: '50 × 70 cm', width: 50, height: 70 },
]
export const LAYOUTS = [
  { id: 'solo', label: 'Jeden kadr', count: 1 },
  { id: 'duet', label: 'Duet', count: 2 },
  { id: 'triptych', label: 'Tryptyk', count: 3 },
  { id: 'gallery5', label: 'Galeria · 5', count: 5 },
]

const formatsById = new Map(PRINT_FORMATS.map(format => [format.id, format]))
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value))
const hasId = (items, id) => typeof id === 'string' && items.some(item => item.id === id)
const finite = value => typeof value === 'number' && Number.isFinite(value)
const rounded = value => Math.round(value * 1000) / 1000

export function frameDimensions(frame, mat = true) {
  const format = formatsById.get(frame?.format)
  if (!format) throw new TypeError('Unknown photograph format')
  const allowance = mat ? 8 : 2 // 1 cm frame + optional 3 cm mount on each side.
  return { width: format.width + allowance, height: format.height + allowance }
}

export function clampFrame(frame, mat = true) {
  const { width, height } = frameDimensions(frame, mat)
  const minX = width / WALL_WIDTH * 50
  const minY = height / WALL_HEIGHT * 50
  return {
    photoId: frame.photoId,
    format: frame.format,
    x: Math.max(minX, Math.min(100 - minX, rounded(frame.x))),
    y: Math.max(minY, Math.min(100 - minY, rounded(frame.y))),
  }
}

export function normalizeWallConfig(input) {
  if (!isRecord(input) || input.version !== 1 || !hasId(WALL_COLORS, input.wall) || !hasId(FRAME_COLORS, input.frame)
    || typeof input.mat !== 'boolean' || !Array.isArray(input.frames) || input.frames.length < 1 || input.frames.length > 6) return null
  const frames = []
  for (const frame of input.frames) {
    if (!isRecord(frame) || !wallPhotoById.has(frame.photoId) || !formatsById.has(frame.format) || !finite(frame.x) || !finite(frame.y)) return null
    frames.push(clampFrame(frame, input.mat))
  }
  return { version: 1, wall: input.wall, frame: input.frame, mat: input.mat, frames }
}

const defaultPhotos = ['alpy-2026-01', 'alpy-2026-02', 'alpy-2026-25', 'szwajcaria-03', 'alpy-2026-38'].map(id => wallPhotoById.get(id)).filter(Boolean)
const layoutFrames = {
  solo: [{ x: 50, y: 42, format: '70x50' }],
  duet: [{ x: 35, y: 42, format: '60x40' }, { x: 65, y: 42, format: '60x40' }],
  triptych: [{ x: 24, y: 42, format: '60x40' }, { x: 50, y: 42, format: '60x40' }, { x: 76, y: 42, format: '60x40' }],
  gallery5: [
    { x: 29, y: 31, format: '40x30' }, { x: 50, y: 31, format: '40x30' }, { x: 71, y: 31, format: '40x30' },
    { x: 38, y: 57, format: '60x40' }, { x: 64, y: 57, format: '60x40' },
  ],
}

export function createLayout(layoutId = 'triptych', previousConfig) {
  const previous = normalizeWallConfig(previousConfig)
  const layout = Object.hasOwn(layoutFrames, layoutId) ? layoutFrames[layoutId] : layoutFrames.triptych
  const used = new Set(previous?.frames.map(frame => frame.photoId))
  const extras = [...defaultPhotos, ...wallPhotos].filter((photo, index, photos) => !used.has(photo.id) && photos.findIndex(item => item.id === photo.id) === index)
  const photos = [...(previous?.frames.map(frame => wallPhotoById.get(frame.photoId)) || []), ...extras]
  return normalizeWallConfig({
    version: 1, wall: previous?.wall || 'linen', frame: previous?.frame || 'black', mat: previous?.mat ?? true,
    frames: layout.map((frame, index) => ({ photoId: photos[index % photos.length].id, ...frame })),
  })
}

export function serializeWallConfig(config) {
  const normalized = normalizeWallConfig(config)
  if (!normalized) throw new TypeError('Invalid photograph wall')
  return JSON.stringify(normalized)
}

export function parseWallConfig(text) {
  if (typeof text !== 'string' || text.length > 6000) return null
  try { return normalizeWallConfig(JSON.parse(text)) } catch { return null }
}

export function wallSharePath(config) {
  const params = new URLSearchParams({ uklad: serializeWallConfig(config) })
  return `${WALL_PATH}?${params}`
}

export function buildWallInquiry(config, absoluteURL) {
  const normalized = normalizeWallConfig(config)
  if (!normalized) throw new TypeError('Invalid photograph wall')
  const base = new URL(absoluteURL)
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password) throw new TypeError('Invalid wall URL')
  const url = new URL(wallSharePath(normalized), base).href
  const colorLabel = items => items.find(item => item.id === normalized[items === WALL_COLORS ? 'wall' : 'frame']).label
  const subject = 'Zapytanie o fotografie — mój zestaw | Cinek Zielu'
  const photos = normalized.frames.map((frame, index) => `${index + 1}. ${wallPhotoById.get(frame.photoId).title}\n   ${wallPhotoById.get(frame.photoId).sourceLabel}; ${frame.photoId}\n   Preferowany format fotografii: ${formatsById.get(frame.format).label}`)
  const body = `Cześć,\n\nChcę zapytać o możliwość wykonania odbitek tych fotografii:\n\n${photos.join('\n\n')}\n\nRamki w podglądzie: ${colorLabel(FRAME_COLORS)}.\nPasse-partout w podglądzie: ${normalized.mat ? 'tak' : 'nie'}.\nŚciana w podglądzie: ${colorLabel(WALL_COLORS)}.\n\nMój układ:\n${url}\n\nProszę o informację o możliwych formatach, sposobie wykonania i wycenie.\n`
  return { subject, body, href: `mailto:${author.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` }
}
