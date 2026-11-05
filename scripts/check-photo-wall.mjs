import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import {
  WALL_PATH, WALL_WIDTH, WALL_HEIGHT, wallPhotos, wallPhotoById, WALL_COLORS, FRAME_COLORS,
  PRINT_FORMATS, LAYOUTS, frameDimensions, clampFrame, createLayout, normalizeWallConfig,
  parseWallConfig, serializeWallConfig, wallSharePath, buildWallInquiry,
} from '../src/data/photoWall.js'
import { portfolioPhotos } from '../src/data/portfolioData.js'
import { author } from '../src/data/authorData.js'

assert.equal(wallPhotos.length, portfolioPhotos.length)
assert.equal(wallPhotoById.size, wallPhotos.length, 'IDs must survive reorder without collisions')
for (const photo of wallPhotos) {
  assert.equal(photo.title, photo.alt)
  assert(photo.width > 0 && photo.height > 0)
  assert.match(photo.sourceHref, /^\/galerie\//)
  for (const path of [photo.src, photo.full]) await access(fileURLToPath(new URL(`../public${path}`, import.meta.url)))
}

const withinWall = config => config.frames.forEach(frame => {
  const size = frameDimensions(frame, config.mat)
  assert(frame.x - size.width / WALL_WIDTH * 50 >= -1e-10)
  assert(frame.x + size.width / WALL_WIDTH * 50 <= 100 + 1e-10)
  assert(frame.y - size.height / WALL_HEIGHT * 50 >= -1e-10)
  assert(frame.y + size.height / WALL_HEIGHT * 50 <= 100 + 1e-10)
})
for (const layout of LAYOUTS) {
  const config = createLayout(layout.id)
  assert.equal(config.frames.length, layout.count)
  assert.equal(new Set(config.frames.map(frame => frame.photoId)).size, layout.count)
  withinWall(config)
  assert.deepEqual(parseWallConfig(serializeWallConfig(config)), config)
  const url = new URL(wallSharePath(config), 'https://www.cinekzielu.pl')
  assert.equal(url.pathname, WALL_PATH)
  assert.deepEqual(parseWallConfig(url.searchParams.get('uklad')), config)
}
const original = createLayout('triptych')
for (const id of ['missing', '__proto__', 'constructor', null]) assert.deepEqual(createLayout(id), original)
assert(original.frames.every(frame => wallPhotoById.get(frame.photoId).width > wallPhotoById.get(frame.photoId).height))
const changed = { ...original, wall: WALL_COLORS.at(-1).id, frame: FRAME_COLORS.at(-1).id, mat: false,
  frames: original.frames.map((frame, index) => ({ ...frame, photoId: wallPhotos.at(-(index + 1)).id })) }
const expanded = createLayout('gallery5', changed)
assert.deepEqual(expanded.frames.slice(0, 3).map(frame => frame.photoId), changed.frames.map(frame => frame.photoId))
assert.equal(expanded.wall, changed.wall)
assert.equal(expanded.frame, changed.frame)
assert.equal(expanded.mat, false)

for (const format of PRINT_FORMATS) for (const mat of [true, false]) {
  for (const [x, y] of [[-1e308, 1e308], [1e308, -1e308], [0, 0], [100, 100]]) {
    const frame = clampFrame({ ...original.frames[0], format: format.id, x, y }, mat)
    withinWall({ mat, frames: [frame] })
  }
  assert.equal(frameDimensions({ format: format.id }, mat).width, format.width + (mat ? 8 : 2))
}

for (const value of [null, [], 1, true, {}, { ...original, version: 2 }, { ...original, wall: '__proto__' },
  { ...original, frame: 'constructor' }, { ...original, mat: 'true' }, { ...original, frames: [] },
  { ...original, frames: Array(7).fill(original.frames[0]) },
  ...[NaN, Infinity, -Infinity, '20', null].map(x => ({ ...original, frames: [{ ...original.frames[0], x }] })),
  ...['javascript:alert(1)', 'https://example.com/photo.jpg', '__proto__', '<script>alert(1)</script>'].map(photoId => ({ ...original, frames: [{ ...original.frames[0], photoId }] })),
  { ...original, frames: [{ ...original.frames[0], format: 'constructor' }] },
]) assert.equal(normalizeWallConfig(value), null)
for (const text of [null, '', '[', 'null', '[]', 'x'.repeat(6001), '{"version":1,"frames":[]}']) assert.equal(parseWallConfig(text), null)
const polluted = JSON.parse(serializeWallConfig(original).replace('"version":1', '"version":1,"__proto__":{"polluted":true},"src":"https://foreign.example/image.jpg"'))
assert.deepEqual(normalizeWallConfig(polluted), original, 'Only explicitly copied fields survive URL parsing')
assert.equal({}.polluted, undefined)
assert.throws(() => serializeWallConfig({}), TypeError)
assert.throws(() => buildWallInquiry(original, 'javascript:alert(1)'), TypeError)
assert.throws(() => buildWallInquiry(original, 'https://user:pass@example.com'), TypeError)
const inquiry = buildWallInquiry(changed, 'https://www.cinekzielu.pl/somewhere?unused=1#fragment')
const mail = new URL(inquiry.href)
assert.equal(mail.protocol, 'mailto:')
assert.equal(mail.pathname, author.email)
assert.equal(mail.searchParams.get('subject'), inquiry.subject)
assert.equal(mail.searchParams.get('body'), inquiry.body)
for (const frame of changed.frames) {
  assert(inquiry.body.includes(frame.photoId))
  assert(inquiry.body.includes(wallPhotoById.get(frame.photoId).title))
  assert(inquiry.body.includes(PRINT_FORMATS.find(format => format.id === frame.format).label))
}
assert(inquiry.body.includes(new URL(wallSharePath(changed), 'https://www.cinekzielu.pl').href))
assert(!inquiry.body.includes('unused=1'))

console.log(`PASS: ${wallPhotos.length} genuine portfolio photos and assets, stable IDs, four presets, preserved selections, all format bounds, strict URL validation, roundtrips and complete contact inquiry.`)
