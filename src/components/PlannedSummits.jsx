import React from 'react'
import { Star, ArrowUpRight } from 'lucide-react'
import { plannedSummits } from '../data/plannedSummits'
import '../plannedSummits.css'

export function PlannedSummits({ peaks = plannedSummits }) {
  return <section className="cz-planned-summits" id="w-planach" aria-labelledby="planned-title">
    <div className="cz-planned-heading"><h2 id="planned-title"><Star size={16} aria-hidden="true" />W planach</h2><span>Poza listą zdobytych szczytów</span></div>
    {peaks.map(peak => <a className="cz-planned-card" key={peak.id} href={`/mapa?atlas=${peak.id}`}>
      <Star className="cz-planned-symbol" size={36} strokeWidth={1} aria-hidden="true" />
      <div><span className="cz-planned-location">{peak.range} · {peak.countryLabel}</span><h3>{peak.name}</h3><p>{peak.description}</p></div>
      <div className="cz-planned-height"><strong>{peak.elevation.toLocaleString('pl-PL')} <small>m</small></strong><span>Zobacz na mapie <ArrowUpRight size={14} aria-hidden="true" /></span></div>
    </a>)}
  </section>
}
