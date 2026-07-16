# Subtera approved screens

These images are the approved visual references for the production
Next.js implementation.

## Desktop routes

- `desktop/01-overview-desktop.png` → `/`
- `desktop/02-analytics-desktop.png` → `/analytics`
- `desktop/03-customers-desktop.png` → `/customers`
- `desktop/04-subscriptions-desktop.png` → `/subscriptions`
- `desktop/05-settings-desktop.png` → `/settings`

## Mobile references

- `mobile/06-overview-mobile-full.png` → mobile `/`
- `mobile/07-mobile-navigation-drawer.png` → mobile navigation state

Only the Overview page has a separately approved mobile composition.
The other routes must use responsive behavior derived from the shared
application shell and components.

## Design system

- `system/08-mini-ui-kit.png`

Use it as the visual reference for shared tokens, controls, navigation,
badges, cards, tables and form components.

## Important implementation rules

- Use the real browser viewport.
- Desktop sidebar width: 248 px.
- Do not reproduce the ChatGPT Work view switcher.
- Do not reproduce the presentation canvas.
- Do not use `transform: scale()` to fit the application.
- Build reusable React components and centralized design tokens.
- Screenshots are visual references, not raster images to embed in pages.
