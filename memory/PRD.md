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
