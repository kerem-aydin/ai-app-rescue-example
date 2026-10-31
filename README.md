# Slotwise: rescuing an AI-built booking app (example)

*Case study on a sample app. Slotwise is a fictional product, built to show the process end to end.*

A React + Vite + TypeScript booking app, built quickly with an AI coding tool. It looked fine in the preview,
but the production build failed, a secret key shipped to every visitor, and the phone layout scrolled sideways.
This repo holds both versions: git tag `before` (as received) and git tag `after` (fixed).

| Check | Before | After |
|---|---|---|
| `npm run build` | Failed (2 TypeScript errors) | Passes |
| Automated tests | None | 15 tests pass |
| Secret key in browser bundle | Found | None (scan runs on every build) |
| Phone layout at 390 px | 790 px sideways scroll | Fits the screen |
| Lighthouse (mobile, local preview) | 88 · 91 · 96 · 73 | 100 · 100 · 100 · 100 |

Full report, file by file: [CHANGES.md](CHANGES.md). Raw outputs and screenshots: [`evidence/`](evidence/).

## Run it

```bash
npm install
npm test          # 15 tests
npm run build     # type check + build + secret scan of dist/
npm run preview
```

Compare the two versions: `git diff before after --stat`.
