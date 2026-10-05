import React from 'react'

export const photoWidthAt = (photo, maximum) => Math.round(photo.width * Math.min(1, maximum / Math.max(photo.width, photo.height)))

export function photoSources(photo, full = false) {
  const smallWidth = photoWidthAt(photo, 960)
  const sources = photo.mobileSrc ? [`${photo.mobileSrc} ${Math.min(480, smallWidth)}w`] : []
  sources.push(`${photo.src} ${smallWidth}w`)
  if (full) sources.push(`${photo.full} ${photoWidthAt(photo, 2000)}w`)
  return sources.join(', ')
}

export function ResponsivePhoto({ photo, full = false, sizes, ...props }) {
  return <img src={photo.src} srcSet={photoSources(photo, full)} sizes={sizes} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" {...props} />
}
