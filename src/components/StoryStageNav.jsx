import React, { useId } from 'react'
import '../storyStageNav.css'

// Native hashes keep chapter links, Back/Forward and browse memory intact.
// Scrolling only changes the supplied active ID; it never creates history entries.
export function StoryStageNav({ stages, activeId, label, onNavigate }) {
  const inputId = useId()
  const index = Math.max(0, stages.findIndex(stage => stage.id === activeId))
  const go = href => {
    onNavigate?.()
    if (window.location.hash !== href) window.location.hash = href
    else document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }
  const neighbor = (stage, direction) => stage ? <a href={stage.href} onClick={onNavigate} aria-label={`${direction < 0 ? 'Poprzedni' : 'Następny'} etap: ${stage.title}`}>{direction < 0 ? '←' : '→'}</a> : <span className="cz-stage-nav-edge" aria-hidden="true">{direction < 0 ? '←' : '→'}</span>
  return <nav className="cz-stage-nav" aria-label={label}>
    {neighbor(stages[index - 1], -1)}
    <label htmlFor={inputId}><span>Etap {index + 1} / {stages.length}</span><select id={inputId} value={stages[index].href} onChange={event => go(event.target.value)} aria-label={`${label} — wybierz etap`}>{stages.map(stage => <option key={stage.id} value={stage.href}>{stage.title}</option>)}</select></label>
    {neighbor(stages[index + 1], 1)}
  </nav>
}
