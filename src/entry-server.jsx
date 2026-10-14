import React from 'react'
import { renderToString } from 'react-dom/server'
import { SitePage } from './App'

export function renderPage(location) {
  return renderToString(<SitePage location={location} />)
}
