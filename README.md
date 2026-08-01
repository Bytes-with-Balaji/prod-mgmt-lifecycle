# PM Command Center — Product Management Lifecycle Demo

An interactive, hands-on simulation of the end-to-end product management lifecycle:
lifecycle map, customer research, strategy canvas, prioritization (RICE/ICE/MoSCoW/Value-Effort),
business case modeling, roadmap, launch readiness (Go/No-Go), analytics funnel, A/B experiments,
a PM decision simulator, and a product health / pivot-scale-sunset dashboard.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## Deploy to GitHub Pages

1. Update `base` in `vite.config.js` to match your repo name:
   ```js
   base: '/your-repo-name/'
   ```
2. Create the GitHub repo and push this project:
   ```bash
   git init
   git add .
   git commit -m "PM lifecycle demo"
   gh repo create your-repo-name --public --source=. --push
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```
4. In your repo on GitHub: **Settings → Pages → Source → Deploy from branch → `gh-pages` / root**.
   Your app will be live at `https://<username>.github.io/your-repo-name/` within a minute or two.

## Deploy to Vercel or Netlify (no base-path config needed)

- **Vercel**: import the repo at vercel.com, framework preset "Vite", no changes needed.
- **Netlify**: connect the repo, build command `npm run build`, publish directory `dist`.
  Or just drag-and-drop the `dist/` folder (after `npm run build`) into https://app.netlify.com/drop.

## Tech

- React 18 + Vite
- `recharts` for charts, `lucide-react` for icons
- No Tailwind / CSS framework required — all styling is inline
