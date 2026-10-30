# Change report: Slotwise booking app

*Example project. This is a sample rescue made to show how delivery looks; Slotwise is not a real client.*

**Received:** a React + Vite + TypeScript booking app built quickly with an AI coding tool. It looked fine in the
preview, but the production build failed and real users would have hit several problems.

**Delivered:** git tag `before` (as received) and git tag `after` (fixed). Every number below comes from a real run
saved in `kanit/before/` and `kanit/after/`.

## Summary

| Check | Before | After |
|---|---|---|
| `npm run build` | **Failed**: 2 TypeScript errors (exit code 2) | **Passes** (exit code 0) |
| Automated tests | None (`Missing script: "test"`) | **15 tests pass** in 4 files |
| Secret key in browser bundle | **Found** (`mk_live_…` in the JS file) | **None** (scan runs on every build) |
| Phone layout at 390 px | Page is 1180 px wide, **790 px sideways scroll** | Fits the screen, 0 px overflow |
| Submitting an empty form | Request sent with empty name and email, "Booked!" shown | Blocked, 3 clear messages, 0 requests |
| Time slots fail to load (HTTP 500) | Blank list, uncaught error in console | Error message + "Try again" button |
| Lighthouse (mobile, local preview) | Performance 88 · Accessibility 91 · Best practices 96 · SEO 73 | 100 · 100 · 100 · 100 |

## What was wrong and what I changed

1. **Build failed (TypeScript).** `SlotCard` read `slot.spotsLeft`, a field that does not exist (the data uses
   `left`), and passed a number to `formatPrice(value: string)`. In the preview this showed as "spots left" with no
   number. Fixed the field name and made `formatPrice` take a number and format it as currency.
   *Files:* `src/components/SlotCard.tsx`, `src/format.ts`.

2. **Secret key shipped to every visitor.** The mail service key was hard-coded in `src/api.ts` and sent from the
   browser, so anyone could copy it from the page source. Moved the call to a server function (`api/book.ts`) that
   reads `MAIL_API_KEY` from an environment variable. The browser now only calls `/api/book`.
   Added `scripts/check-bundle.mjs`, which fails the build if a key pattern appears in `dist/`.
   **Action for you:** the old key was public, so rotate it in the mail provider and put the new one in your
   hosting environment variables (see `.env.example`). Do not prefix it with `VITE_`.

3. **No form validation.** Empty or wrong details were sent and the user saw "Booked!". Added shared rules
   (`src/lib/validate.ts`) used by both the form and the server: a slot must be picked, name required, email
   format checked, note limited to 500 characters. Errors show under each field and are announced to screen readers.
   The button is disabled while sending, so double bookings from double clicks are blocked.

4. **No loading or error states.** The list was empty while loading and stayed empty if the request failed.
   Added a loading skeleton (same size as the cards, so the page no longer jumps: layout shift 0.229 → 0),
   an error message with "Try again", an empty-week message and a "Fully booked" state for full slots.
   A failed booking now shows the server's message instead of a false "Booked!".

5. **Layout broke on phones.** Fixed widths (`width: 1180px`, `repeat(3, 360px)`, `420px` inputs) and
   `white-space: nowrap` on the title. Replaced with a fluid container and auto-fitting grids; tested at 390 px.

6. **Accessibility and SEO basics.** Labels for every input (placeholders only before), readable contrast on the
   main button, real links in the menu, `<main>` landmark, meta description, `robots.txt` and a favicon.

## Tests added (Vitest + Testing Library)

- `src/lib/validate.test.ts`: valid booking, empty form, bad email, note length (4)
- `src/App.test.tsx`: loading then slots, full slots disabled, error + retry (3)
- `src/components/BookingForm.test.tsx`: empty form not sent, request has no secret, server error shown, no double submit (4)
- `api/book.test.ts`: missing key, server-side validation, key never returned, mail service down (4)

Run them with `npm test`. `npm run build` now runs the type check, the build and the secret scan.

## How it was checked

- `npm run build` and `npm test` outputs: `kanit/*/build.txt`, `kanit/*/test.txt`
- Secret scan: `kanit/*/secret-scan.txt` (the before bundle was built with the type check skipped, only to measure it)
- Browser checks (phone overflow, empty form, failed load) in headless Chrome: `kanit/*/olcum.json` + screenshots
- Lighthouse 12.8.2, mobile, one run each against `vite preview` on this machine: `kanit/*/lighthouse.json`.
  Scores on your real hosting will differ a little.

## Not done in this example

- Not deployed. In a real order this goes to your own Vercel or Netlify account with your domain.
- The mail service is a placeholder (`api.mailer.example.com`); in tests it is mocked.
- Booking does not reserve the slot in a database yet; that is a feature, not a fix, and would be quoted separately.
