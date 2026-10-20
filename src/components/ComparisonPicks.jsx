import React, { useState } from 'react'
import { comparisonPicks, comparisonPickHref } from '../data/comparisonPicks'

export function ComparisonPicks({ state, onSelect }) {
  const [open, setOpen] = useState(false)
  return <section className="cz-comparison-picks" aria-labelledby="comparison-picks-title">
    <div className="cz-comparison-picks-heading"><h2 id="comparison-picks-title">Gotowe porównania</h2><a href="#porownanie">Wybierz własną parę ↓</a></div>
    <button type="button" className="cz-comparison-picks-toggle" aria-expanded={open} aria-controls="comparison-picks-list" onClick={() => setOpen(value => !value)}>{open ? 'Zwiń propozycje −' : 'Pokaż 3 porównania +'}</button>
    <div id="comparison-picks-list" className={`cz-comparison-picks-grid${open ? ' is-open' : ''}`}>{comparisonPicks.map(pick => <a key={pick.id} href={comparisonPickHref(pick, state)} onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault(); onSelect(pick)
    }}><h3>{pick.title}</h3><p>{pick.description}</p><div className="cz-comparison-pick-labels"><span>A · {pick.labels[0]}</span><span>B · {pick.labels[1]}</span></div><span className="cz-comparison-pick-action">Porównaj ↗</span></a>)}</div>
    <p className="cz-comparison-picks-note">Porównanie zapisów GPS — dystans i profil nie określają trudności ani aktualnych warunków.</p>
  </section>
}
