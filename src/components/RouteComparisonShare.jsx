import React from 'react'

export function RouteComparisonShare({ result, href, inputRef, onClose }) {
  // A delayed clipboard result must never describe a different comparison.
  if (!result || result.href !== href) return null
  return <div className="cz-route-share"><p role="status">{result.copied ? 'Link skopiowany. Możesz też skopiować go z pola poniżej.' : 'Skopiuj link z pola poniżej.'}</p><label>Link do porównania<input ref={inputRef} readOnly value={result.url} onFocus={event => event.target.select()} /></label><button type="button" onClick={onClose}>Zamknij</button></div>
}
