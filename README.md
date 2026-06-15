# Ignite Coaching

Ignite is a mobile-first React SPA for a personal training brand. It includes a client onboarding flow, an editor panel for the trainer, and localStorage persistence.

## Features
- Mobile-first responsive UI
- 6-step onboarding client form
- Trainer editor panel protected by a 4-digit PIN
- Local `localStorage` persistence for clients, trainer profile, and PIN
- GitHub Pages deployment via `docs/`

## Local setup
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages
This project is configured to publish from the `docs/` folder.

1. Build the app:
   ```bash
   npm run build
   ```
2. Commit the generated `docs/` folder:
   ```bash
   git add docs
   git commit -m "Prepare GitHub Pages docs output"
   git push
   ```
3. In GitHub repository settings, enable Pages from:
   - Branch: `main`
   - Folder: `/docs`

After a short delay, the site should be available on GitHub Pages.

## Notes
- The app uses Vite and React.
- `vite.config.js` is set to output static files into `docs/` for GitHub Pages compatibility.
