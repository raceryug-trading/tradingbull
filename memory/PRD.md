# Your Trading Academy — PRD

## Problem Statement
Stock market trading course website. No public sign-up. Admin creates username/password per student. YouTube-embedded recorded videos and live sessions. Floating WhatsApp icon site-wide. Must deploy to GitHub Pages (free static hosting).

## Architecture
- **Frontend only** (React + HashRouter). No backend.
- **Data**: browser `localStorage`, seeded from `frontend/src/config.js` on first visit.
- **Deploy target**: GitHub Pages (`gh-pages` package, `HashRouter` for compat).

## Personas
1. **Instructor / Admin** — manages students, modules, videos, live URL.
2. **Student** — logs in with instructor-issued credentials, watches videos + live.

## Core Requirements (Static)
- Login-gated portal, no sign-up
- Admin panel: students, modules, lessons (YouTube URLs), live session URL, admin credentials
- YouTube iframe embed for both recorded + live
- WhatsApp floating button on every page
- Dark terminal/finance theme

## Implemented (2026-02)
- Landing page with market ticker, hero, mock candle chart, features CTA
- Login page (Student/Admin toggle)
- Modules page (sidebar list + iframe player)
- Live Session page (live badge, embed, offline state)
- Admin Panel with 4 tabs: Students / Videos & Modules / Live Session / Admin Password
- Protected routes with adminOnly flag
- WhatsApp floating button (wa.me link, pre-filled message)
- Dark terminal design: Barlow Condensed + Inter + JetBrains Mono
- HashRouter for GitHub Pages compat
- README with GitHub Pages deploy steps

## Backlog (P1/P2)
- P1: Instructor content sync across browsers (currently localStorage only)
  → e.g. commit config.js updates, or export/import JSON, or optional Firebase/Supabase
- P1: Student progress tracking (mark lesson complete)
- P2: Position size + risk calculator widget
- P2: Announcements/notice board managed by admin
- P2: PDF/notes attachment per lesson

## Next Session Ideas
- Content Export/Import JSON to sync across browsers
- Lesson progress marks
- Position size calculator
- Notice board / announcements

## Iteration 2 (2026-02) — Follow-up features
- **Content Sync (Backup & Sync tab)**: Export full state as JSON, Import from JSON file, Reset to defaults
- **Progress Tracking**: Per-student lesson completion, overall + per-module progress bars, checkmarks in sidebar
- **Announcements Board**: Admin can post/remove announcements with tone (info/warn/alert); students see them on Modules page and can dismiss individually (persists in localStorage)
- New store functions: getAnnouncements, addAnnouncement, removeAnnouncement, getProgress, toggleLessonComplete, moduleProgress, exportAll, importAll, resetAll
- All iteration 2 tests passed (0 failures)

## Remaining Backlog
- P2: Position size / risk calculator widget
- P2: PDF/notes attachment per lesson
- P2: Optional cloud sync (Firebase/Supabase) instead of manual JSON

## Iteration 3 (2026-02) — Cloud Sync (Firebase)
- **Optional Firebase Firestore + Firebase Auth** for real-time sync across all browsers/devices
- Falls back to localStorage transparently when `REACT_APP_FIREBASE_*` env vars are empty
- Admin login switches to Firebase Auth email/password when Firebase is configured
- New files: `frontend/src/lib/firebase.js`, `frontend/src/lib/cloudSync.js`, `frontend/src/lib/useCloudRefresh.js`
- README updated with 5-step Firebase Console setup + Firestore security rules
- Data model in Firestore: `academy/main/students/{username}`, `academy/main/modules/{id}`, `academy/main/announcements/{id}`, `academy/main/config` (with live subdoc)
- Student progress + dismissed announcements remain per-browser (privacy + latency)
- All iteration 3 tests passed in fallback mode (0 failures). Cloud path requires user's Firebase credentials.

## Remaining Backlog
- P2: Position size / risk calculator widget
- P2: PDF/notes attachment per lesson
- P2: Live countdown to next scheduled session

## Cloud Sync — LIVE (verified 2026-02)
- User provided Firebase config for project `trading-bulls-e3389`. Values written to /app/frontend/.env
- User completed Firebase Console setup: Email/Password auth, admin user created, Firestore DB, security rules published
- E2E test (iteration_4.json): 13/13 flows PASSED including admin login, invalid-credential toast, Firestore CRUD via UI (student/module/lesson/announcement/live), cross-session persistence after localStorage wipe, and Firebase-managed Admin Password notice.
- Cloud sync fully working. Admin credentials in test_credentials.md.
