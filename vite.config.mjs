import { defineConfig } from 'vite'
import { generateSitePages } from './scripts/generate-site-pages.mjs'

export default defineConfig({
  plugins: [{ name: 'cinekzielu-static-metadata', apply: 'build', closeBundle: generateSitePages }],
})
