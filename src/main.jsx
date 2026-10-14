import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { SitePage } from './App'
import { applyPageMetadata } from './pageMetadata'
import { legacyRedirects, normalizePagePath } from './data/siteMetadata'
import { resolvePageView, resolveSharePage } from './data/sharePages'

const pathname = normalizePagePath(window.location.pathname)
if (legacyRedirects[pathname]) window.location.replace(legacyRedirects[pathname])
applyPageMetadata(pathname)
const view = resolvePageView(pathname, window.location.search)
const bootstrap = document.getElementById('cz-page-location')
const renderedLocation = bootstrap ? JSON.parse(bootstrap.textContent) : null
// Preview/dev servers may serve index.html for an unknown address. Do not
// mistake that fallback document for a prerender of the requested page.
const canHydrate = renderedLocation && (renderedLocation.pathname === view.pathname || renderedLocation.pathname === '/404')
const initialLocation = canHydrate ? renderedLocation : view
// Sharing has real HTML/OG at its own URL. In the interactive page use the
// regular address, so history, filters and photo navigation keep their meaning.
if (resolveSharePage(pathname)) window.history.replaceState(window.history.state, '', view.pathname + view.search + window.location.hash)
const root = document.getElementById('root')
const app = <SitePage location={initialLocation} />
if (canHydrate && root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
