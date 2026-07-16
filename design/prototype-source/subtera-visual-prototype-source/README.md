# Subtera Visual Prototype

Static visual concept source for the approved Subtera subscription analytics dashboard. This is a presentation prototype, not a production Next.js application.

## Included files

- `index.js` — the complete source used by the prototype. The HTML, CSS, inline SVG charts/icons, and minimal view-switching JavaScript are embedded in this file.
- `serve.mjs` — a dependency-free local Node.js preview server.
- `package.json` — the local start command.
- `README.md` — setup and handoff notes.

There is no separate `index.html`, stylesheet, or local assets folder in the approved source. Those parts are embedded in `index.js`. Manrope is requested from Google Fonts; if the computer is offline, the system sans-serif fallback is used.

## Run locally

Requirements: Node.js 18 or newer.

1. Extract the ZIP archive.
2. Open a terminal in the extracted `subtera-visual-prototype-source` folder.
3. Run:

   ```bash
   npm start
   ```

   No dependency installation is required.

4. Open [http://localhost:4173](http://localhost:4173) in a browser.
5. Stop the server with `Ctrl+C`.

You can also run `node serve.mjs`. To use another port, set the `PORT` environment variable before starting the server.

## Available prototype views

- Portfolio Cover
- Overview Desktop
- Analytics Desktop
- Customers Desktop
- Subscriptions Desktop
- Settings Desktop
- Overview Mobile
- Mobile Drawer
- Mini UI Kit

Use the gallery navigation at the top of the prototype to switch between views.

## Development handoff

- The production SaaS application must use the actual browser viewport.
- Desktop sidebar width is `248px`; the main application area fills the remaining width.
- Do not wrap the product application in an artificial presentation frame.
- Do not use `transform: scale()` to reproduce the prototype preview.
- The gallery view switcher is presentation navigation only and must not appear inside the product application.
- Future product routes are `/`, `/analytics`, `/customers`, `/subscriptions`, and `/settings`.

This export intentionally contains no backend, authentication, API integration, or production business logic.
