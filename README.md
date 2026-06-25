# Ignite Coaching

Ignite is a mobile-first React SPA for a personal training brand. It includes a client onboarding flow, an editor panel for the trainer, and remote client persistence via Google Sheets.

## Features
- Mobile-first responsive UI
- 6-step onboarding client form
- Trainer editor panel protected by a 4-digit PIN
- Clients stored remotely via Google Sheets + Apps Script
- Trainer profile and PIN stored locally in `localStorage`
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

## Configure Google Sheets backend
Before building, update `src/data/storage.js` with your Google Apps Script endpoint URL and secret token:
```js
const SHEETS_API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
const SHEETS_API_TOKEN = 'YOUR_SECRET_TOKEN';
```
Keep the underlying sheet private; only the Apps Script endpoint is public.

### Fix CORS errors
If you receive a CORS error when the browser calls the script endpoint, make sure your Apps Script web app responds with CORS headers and handles preflight requests.

A simple Apps Script pattern is:

```js
const SECRET_TOKEN = 'YOUR_SECRET_TOKEN';
const SHEET_NAME = 'Clients';

function corsResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doOptions() {
  return corsResponse({});
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  if (payload.token !== SECRET_TOKEN) {
    return corsResponse({ success: false, error: 'invalid token' });
  }
  // ... handle actions and return corsResponse(...)
}
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
