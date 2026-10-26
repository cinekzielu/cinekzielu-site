import React from 'react'
import { routeLinkRecovery } from '../data/routeLinkRecovery'

export function RouteLinkNotice({ search, outsideArea = false }) {
  const recovery = routeLinkRecovery(search, outsideArea)
  if (!recovery) return null
  return <div className="cz-route-compare-empty">
    <p role="status">{recovery.message}</p>
    <a href={recovery.href}>{recovery.label} →</a>
  </div>
}
