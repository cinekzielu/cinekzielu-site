import { defineConfig } from 'vite'
import { generateSitePages } from './scripts/generate-site-pages.mjs'

export default defineConfig({
  server: { allowedHosts: ['terminal.local'] },
  plugins: [{ name: 'cinekzielu-static-metadata', apply: 'build', closeBundle: generateSitePages }],
})
