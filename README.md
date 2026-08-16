# Your Trading Academy — Static Site (GitHub Pages ready)

A private stock market trading course website with:
- Admin-managed student logins (no public sign-up)
- YouTube-embedded video modules
- Embedded YouTube Live sessions
- Floating WhatsApp button on every page
- Dark terminal/finance UI

## Structure
- `frontend/` — React app, fully static after build. Uses `HashRouter` so it works on GitHub Pages without server rewrites.
- Data is stored in the browser's `localStorage`. Default admin/students/modules seed from `frontend/src/config.js` on first visit.

## Default credentials (change immediately)
- Admin: `admin` / `admin123`
- Demo student: `student` / `student123`

## Local dev
```
cd frontend
yarn install
yarn start
```

## Customize
Edit `frontend/src/config.js`:
- Brand name, tagline
- WhatsApp number (with country code, no spaces)
- Default admin and student accounts
- Default course modules & YouTube URLs

Everything can also be managed live via the Admin Console after login.

## Deploy to GitHub Pages

1. Push repo to GitHub.
2. In `frontend/package.json` add:
   ```json
   "homepage": "https://<your-username>.github.io/<repo-name>",
   ```
3. Install `gh-pages`:
   ```
   cd frontend
   yarn add -D gh-pages
   ```
   Add scripts in `package.json`:
   ```json
   "predeploy": "yarn build",
   "deploy": "gh-pages -d build"
   ```
4. Run `yarn deploy`. GitHub Pages will serve the site at your `homepage` URL.
5. In GitHub → Settings → Pages, ensure the branch is set to `gh-pages`.

> Routes look like `/#/login`, `/#/modules` because HashRouter is used (needed for GitHub Pages).

## Notes
- `localStorage` is per-browser. Admin changes are only visible in the same browser. For content shared with all students, edit `frontend/src/config.js` — bump `VERSION` in `lib/store.js` to force re-seed.
- Videos are served by YouTube; this site only embeds them.
