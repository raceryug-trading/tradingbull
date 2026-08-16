# Your Trading Academy — Static Site (GitHub Pages ready)

A private stock market trading course website with:
- Admin-managed student logins (no public sign-up)
- YouTube-embedded video modules with progress tracking
- YouTube live sessions embedded on-site
- Admin Announcements board (dismissible per student)
- Floating WhatsApp button on every page
- Dark terminal/finance UI
- **Optional Firebase Cloud Sync** — announcements, students, modules, and live URL auto-sync across every browser in real time. Falls back to per-browser localStorage if Firebase is not configured.

## Structure
- `frontend/` — React app (fully static after build). `HashRouter` used so routes work on GitHub Pages without server rewrites.
- No backend server — data lives in `localStorage` and optionally in Firebase Firestore.

## Default credentials (change immediately)
- Admin: `admin` / `admin123` (localStorage mode)
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

---

## 🔥 Optional: Enable Firebase Cloud Sync

Cloud sync makes announcements, student rosters, modules, and the live URL appear on every student's browser instantly — without any manual JSON import/export.

If you skip this section the site keeps working with per-browser `localStorage` (each admin change is only visible where it was made).

### Step 1 — Create the Firebase project (2 min)
1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project** → give it any name.
2. Skip Google Analytics.
3. In the sidebar → **Build → Authentication → Get started**. Enable **Email/Password** sign-in.
4. In **Authentication → Users → Add user**, create your admin account (any email + password). You'll use this to log in to the site's admin panel.
5. In the sidebar → **Build → Firestore Database → Create database → Start in production mode → Region → Enable**.

### Step 2 — Get your web config (1 min)
1. Firebase Console → ⚙️ **Project Settings** → **Your apps** → **Web** (`</>` icon) → Register app.
2. Copy the `firebaseConfig` values shown (`apiKey`, `authDomain`, `projectId`, `appId`).

### Step 3 — Paste config into the app
Open `frontend/.env` and fill in the four values (leave the other keys alone):
```
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_APP_ID=1:1234:web:abcd
```
Rebuild / restart. The login screen now shows a **Cloud Sync Active** badge and the Admin tab expects the Firebase email + password you created in step 1.

### Step 4 — Lock down Firestore (2 min)
Firebase Console → **Firestore Database → Rules**, replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Any signed-in Firebase user (i.e. your admin) can write.
    // Reads are public so students without a Firebase account can load the course.
    match /academy/main/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
Click **Publish**.

> Make sure Firebase Auth self-signup stays disabled — only YOU should create Firebase users (via the Users tab). Anyone with a Firebase account under your project could write otherwise.

### Step 5 — First-run bootstrap
1. Open the site → log in as admin with your Firebase email/password.
2. Add one student, one module, one lesson. This creates the Firestore documents.
3. Open the site from another browser or device → the same data appears within ~1 second. 🎉

### Student login (unchanged)
Students still log in with **username / password** you set in the Students tab. Their credentials live in Firestore and appear on every browser automatically.

### What syncs vs stays local
| Data | Synced (cloud) | Local per browser |
| --- | --- | --- |
| Students | ✅ | – |
| Modules & video lessons | ✅ | – |
| Announcements | ✅ | – |
| Live session URL | ✅ | – |
| Student progress (watched lessons) | – | ✅ per student |
| Dismissed announcements | – | ✅ per student |

---

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

> **Firebase note**: Your `apiKey` and web config get baked into the built JS bundle. That is normal and safe as long as your Firestore rules require authentication for writes (Step 4 above). The `apiKey` is a public identifier, not a secret.

## Notes
- If Firebase config is left empty, the site keeps working exactly like before — per-browser localStorage.
- Videos are served by YouTube; this site only embeds them.
