// Match chapters to the current slideshow, never to global gallery positions.
export function slideshowChapters(photos, chapters = []) {
  return chapters.map(chapter=>({...chapter,indices:photos.flatMap((photo,index)=>chapter.photos.includes(photo.full)?[index]:[])})).filter(chapter=>chapter.indices.length)
}
