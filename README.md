# AeroNet Drone Academy 🛸 (v2)

Drone engineering from first principles for B.Tech EEE students — physics, motors, ESCs, batteries, sensors, control, firmware, RF, design and autonomy — with solved numericals, live simulators, labs, quizzes, a reel mode for low-energy days, and an 8-week project plan.

## What's inside

- **15 modules** in 5 tracks (Foundations · Power train · Brains · Links & making it real · Specialisations: fixed-wing/VTOL, PCB design, computer vision). Each has: learning outcomes, theory with KaTeX equations, grid-paper derivations, original solved numericals with step-by-step solutions, "practise more from" book pointers, a hands-on lab with a checklist, industry skills, curated resources, and an 8–10 question quiz with explanations.
- **9 interactive simulators** backed by a unit-tested physics library (`src/lib/physics.js`): hover power (momentum theory), mixer matrix, BLDC operating point, LiPo sag/flight time, complementary filter, rate-loop PID tuner, RF link budget, first-pass sizing, camera survey planner.
- **Tests:** quick quiz, 20-minute mock test, 90-second rapid fire, weak-spot drill (questions you got wrong).
- **Reels:** a vertical swipe feed of flash cards, mini-MCQs and YouTube Shorts / Instagram links per topic; a *revision session* filter replays passed modules and your mistakes.
- **Project plan:** 6 prep weeks + 8 project weeks with review gates, a starter BOM and a risk table (printable).
- **Tutor:** optional AI tutor through a Netlify Function (API key stays server-side).
- Progress, XP, streaks and lab checklists are saved on the device. Works offline after the first visit (PWA).

See **AUDIT.md** for the bugs and content errors fixed from v1.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # physics unit tests (node:test, no extra packages)
npm run build      # production build in dist/
```

## Enable the AI tutor (optional)

In Netlify → Site configuration → Environment variables:

- `GEMINI_API_KEY` = your key
- `GEMINI_MODEL` (optional) = a current model id from Google's model list

Do **not** put the key in a `VITE_` variable — those are compiled into the public JavaScript.

## Editing content

Modules live in `src/content/modules-{a,b,c}.js` as plain objects. Text supports a tiny markup: `$inline math$`, `$$display math$$`, `**bold**`, `` `code` ``, lines starting with `- ` (bullets) or `1. ` (numbered), `| tables |`, `> callout`, fenced code blocks and `[[fig:name]]` for the figures in `src/components/figures.jsx`.

Numericals are original problems; book pointers say where to practise more. Please don't paste copyrighted textbook pages or problem sets into the app.

## Notes

- `lucide-react` and Tailwind are no longer used by the code; they are left in `package.json` so the existing lockfile keeps working. Remove them with `npm uninstall lucide-react tailwindcss postcss autoprefixer` and delete `postcss.config.js` / `tailwind.config.js` if you like.
- KaTeX is vendored in `public/vendor/katex` (MIT licence) so equations render offline.
