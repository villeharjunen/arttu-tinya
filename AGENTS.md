# Agent rules

Shared instructions for every AI coding assistant that works in this repo (Claude Code, Codex, Cursor, Copilot, Gemini and others). Tool-specific files should point here instead of repeating these rules.

## What this is

The wedding site for Arttu & Tinya (Umbria, 20–23 May 2027), served by GitHub Pages from `main` at https://villeharjunen.github.io/arttu-tinya/. A push to `main` goes live within a minute or two, so treat every push as a release.

- `index.html`: all markup
- `css/style.css`: all styles
- `js/config.js`: the values most likely to change (password, wedding time, RSVP endpoint)
- `js/*.js`: one plain script per feature, loaded in order at the end of `index.html`
- `apps-script/Code.gs`: the Google Apps Script that writes RSVPs to a Google Sheet
- `images/`: photos used by the site

## Rules

1. **Keep it static and dependency-free.** No build step, bundler, framework, package manager or CDN script. Plain HTML, CSS and browser JavaScript that runs from the file as committed.
2. **Content is in Finnish.** Guest-facing text and code comments are written in Finnish. Keep new text in Finnish and match the existing tone. Don't translate existing text unless asked.
3. **Put settings in `js/config.js`.** Anything a person might change later (dates, times, links, passwords, endpoints) belongs in `CONFIG`, not hard-coded in a feature script.
4. **One feature, one script.** A new feature gets its own file in `js/` and a `<script>` tag in `index.html` after `config.js`. Don't reorder existing tags without a reason.
5. **The password gate is not security.** It is client-side and visible in the source. Never put anything private (addresses, phone numbers, bank details beyond what the couple chose to share) on the site on the assumption that the gate hides it.
6. **Don't change the password, the wedding time or the RSVP endpoint** unless the user asks for that specific change.
7. **Apps Script changes don't deploy by pushing.** After editing `apps-script/Code.gs`, tell the user to paste it into the Sheet's Apps Script editor and publish it via Deploy → Manage deployments → New version. Keep the spam honeypot and the formula-injection guard (`clean()`).
8. **Mobile first.** Most guests will open the link on a phone. Check every layout change at phone width (about 375px) with no horizontal scrolling.
9. **Images:** resize and compress new photos to about 2000px on the long edge and under 1 MB, like the existing ones, add meaningful `alt` text in Finnish, and use the existing naming pattern (`hero-N.jpg`, `gallery-N.jpg`, `venue-N.jpg`).
10. **Don't commit the old single-file versions** (`Arttu_ja_Tinya_haasivut_v*.html`). They are gitignored and kept locally for reference only.
11. **Git:** work on `main` by default and create a new branch only when the user asks for one. Commit or push only when the user asks. Write short, imperative commit messages in English. Never force-push `main`.
12. **Placeholders stay visible.** If information is missing (for example the gift account or accommodation details), leave an obvious placeholder such as `XXX` instead of inventing content.

## Checking a change

Open `index.html` directly in a browser, or run `python3 -m http.server` in the repo root and visit http://localhost:8000. Test the password gate, the countdown, the RSVP form (it posts to the live Sheet, so mark test rows clearly and tell the user to delete them) and the phone layout.
