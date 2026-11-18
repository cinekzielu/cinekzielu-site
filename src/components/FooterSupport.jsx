import React from 'react'
import { author } from '../data/authorData'

export function FooterSupport({ className }) {
  if (!author.supportUrl) return null
  return <a className={className} href={author.supportUrl} aria-label="Dorzuć na szlak — wesprzyj kolejne wyprawy">
    Dorzuć na szlak <span aria-hidden="true">↗</span>
  </a>
}
