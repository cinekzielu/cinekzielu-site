import React from 'react'
import { atlasHelpTopics, atlasHelpViews } from '../data/atlasHelp'
import '../atlasHelp.css'

// Native disclosure works before hydration and does not write map/history state.
export function AtlasHelp() {
  return <details className="cz-atlas-help">
    <summary>Jak korzystać z atlasu</summary>
    <div className="cz-atlas-help-content">
      <div className="cz-atlas-help-topics">{atlasHelpTopics.map(topic => <section key={topic.title}>
        <h2>{topic.title}</h2>
        <p>{topic.text}</p>
        {topic.link && <a href={topic.link.href}>{topic.link.label} ↗</a>}
      </section>)}</div>
      <nav className="cz-atlas-help-views" aria-label="Przykładowe widoki atlasu">
        <span>Zacznij od gotowego widoku</span>
        {atlasHelpViews.map(view => <a key={view.href} href={view.href}>{view.label} ↗</a>)}
      </nav>
      <p className="cz-atlas-help-keyboard">Na mapie terenu: po ustawieniu fokusu użyj strzałek do przesuwania, + / − do zmiany skali i Home do przywrócenia widoku.</p>
    </div>
  </details>
}
