# Estimathon Grader

Polished, local‑first scoring app for Estimathon‑style events. Deployable to Vercel as a static Next.js site. Not affiliated with Jane Street.

## Rules & Scoring (summary)
- 13 estimation problems; submit positive intervals [min, max].
- Up to 18 total submissions per team; only the last submission per problem counts.
- Final score = product of interval widths (max/min) × 2^(wrong or blank).
- Lowest score wins.

References: estimathon.com/how-to-play and estimathon.com/static/estimathon-rules.pdf

## Features
- Admin panel to configure problems, add teams, submit intervals, and set final answers.
- Live scoreboard with computed scores and ranking.
- LocalStorage persistence with export/import via browser storage tools.
- Neutral branding and accessible UI designed for projection.

## How to run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000 for the scoreboard and http://localhost:3000/admin for the admin panel.

## Deploy to Vercel
- Push this repository to GitHub.
- Import the repo in Vercel; framework: Next.js.
- Build command: `next build` (default), Output: `Next.js` (default).
- Environment: none required for the local‑first mode.

## Notes
- This demo stores data in the browser (LocalStorage). For multi‑device, real‑time use, add a backend (e.g., Vercel KV/Supabase) and swap the persistence adapter.
- Ensure contest rules are communicated on‑site (no internet/calculators, etc.).

