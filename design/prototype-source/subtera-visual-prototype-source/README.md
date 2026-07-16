# Subtera Visual Prototype

Static visual concept source for the approved Subtera subscription analytics dashboard. This is a presentation prototype, not a production Next.js application.

## Included files

- `index.js` — the complete source used by the prototype. The HTML, CSS, inline SVG charts/icons, and minimal view-switching JavaScript are embedded in this file.
- `serve.mjs` — a dependency-free local Node.js preview server.
- `package.json` — the optional local start command.
- `README.md` — setup and handoff notes.

There is no separate `index.html`, stylesheet, or local assets folder in the approved source. Those parts are embedded in `index.js`. Manrope is requested from Google Fonts; if the computer is offline, the system sans-serif fallback is used.

## Run locally

Requirements: Node.js 18 or newer.

1. Open a terminal in:

   ```text
   design/prototype-source/subtera-visual-prototype-source/
   ```

2. Run the dependency-free preview server:

   ```bash
   node serve.mjs
   ```

   No dependency installation is required.

3. Open [http://localhost:4173](http://localhost:4173) in a browser.

4. Stop the server with `Ctrl+C`.

The equivalent package script may also be used:

```bash
npm start
```

This command only runs `node serve.mjs`; it does not install dependencies or affect the main Next.js project's pnpm workflow.

To use another port, set the `PORT` environment variable before starting the server.

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
- The production product routes are `/`, `/analytics`, `/customers`, `/subscriptions`, and `/settings`.
- Treat this prototype as a visual and content reference only.
- Do not copy its monolithic HTML, CSS, or view-switching architecture into the Next.js application.

This export intentionally contains no backend, authentication, API integration, or production business logic.
