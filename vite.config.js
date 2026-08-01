import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: set `base` to "/<your-repo-name>/" before deploying to GitHub Pages.
// e.g. if your repo is github.com/yourname/pm-demo, base should be '/pm-demo/'
// If you deploy to Vercel/Netlify instead, you can leave this as '/'.
export default defineConfig({
  plugins: [react()],
  base: '/prod-mgmt-lifecycle/',
})
