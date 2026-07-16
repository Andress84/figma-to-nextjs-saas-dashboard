# Subtera Implementation Scope

## 1. Goal

Build a polished static frontend demonstration of the Subtera subscription
analytics SaaS dashboard using Next.js and reusable React components.

The implementation should be suitable for:

- GitHub portfolio presentation;
- Upwork portfolio presentation;
- frontend code demonstration;
- responsive UI demonstration;
- visual comparison with the approved design concept.

---

## 2. Product routes

- `/` — Overview
- `/analytics` — Analytics
- `/customers` — Customers
- `/subscriptions` — Subscriptions
- `/settings` — Settings

Use Next.js App Router.

---

## 3. Approved visual references

Desktop:

- `design/approved-screens/desktop/01-overview-desktop.png`
- `design/approved-screens/desktop/02-analytics-desktop.png`
- `design/approved-screens/desktop/03-customers-desktop.png`
- `design/approved-screens/desktop/04-subscriptions-desktop.png`
- `design/approved-screens/desktop/05-settings-desktop.png`

Mobile:

- `design/approved-screens/mobile/06-overview-mobile-full.png`
- `design/approved-screens/mobile/07-mobile-navigation-drawer.png`

Design system:

- `design/approved-screens/system/08-mini-ui-kit.png`

The approved screenshots are the visual source of truth.

---

## 4. Responsive scope

### Desktop

Exact approved desktop concepts exist for all five product pages:

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

### Mobile

Exact approved mobile concepts exist for:

- Overview
- Navigation drawer

Analytics, Customers, Subscriptions and Settings must remain structurally
responsive and usable on smaller screens, but exact mobile visual parity is not
required because separate approved mobile mockups do not currently exist.

For these pages:

- prevent horizontal page overflow;
- allow wide tables to use a deliberate responsive strategy;
- stack page-header controls when necessary;
- preserve accessible controls;
- maintain the shared application shell.

---

## 5. Functional scope

The project may include local frontend interactions such as:

- route navigation;
- active navigation states;
- opening and closing the mobile drawer;
- switching visual tabs;
- toggling controls;
- opening local dropdowns;
- changing segmented controls;
- local filtering of mock table data;
- local search of mock data;
- local pagination;
- tooltips;
- responsive navigation behavior.

All data may be static or locally mocked.

No external service is required.

---

## 6. Excluded

Do not implement:

- backend;
- authentication;
- database;
- real payments;
- Stripe integration;
- real billing;
- real exports;
- real CSV generation unless added later as a small client-side demo;
- real customer creation;
- real customer deletion;
- real subscription creation;
- email notifications;
- server-side account management;
- AI functionality;
- marketing landing page;
- production deployment infrastructure;
- production security model;
- organization permissions;
- multi-tenant backend logic.

Buttons for excluded functionality may be represented visually and may show a
small local demo response, but they must not imply a working production
backend.

---

## 7. Prototype exclusions

The following belong only to the ChatGPT Work presentation and must not appear
inside the product:

- the upper view switcher;
- the presentation canvas;
- the static gallery shell;
- centered desktop preview framing;
- large decorative outer margins;
- artificial application scaling;
- `transform: scale()`.

The application must use the actual browser viewport.

Desktop layout:

- Sidebar: `248px`
- Main area: remaining viewport width

---

## 8. Architecture requirements

Use:

- Next.js App Router;
- TypeScript;
- reusable React components;
- centralized design tokens;
- shared AppShell;
- shared Sidebar;
- shared Topbar;
- shared cards;
- shared buttons and form controls;
- shared badge components;
- shared table primitives;
- centralized static mock data;
- responsive CSS;
- accessible interactive controls.

Global visual changes to typography, color, spacing, radius, borders and card
padding must be possible without editing every individual page.

Avoid:

- duplicated page shells;
- large monolithic page components;
- repeated inline style objects;
- route-specific copies of the same button or card;
- hardcoded viewport scaling;
- embedding screenshots as page content.

---

## 9. Data consistency

Use the same approved numbers and labels across all pages.

Examples:

- MRR: `$84,720`
- ARR: `$1,016,640`
- Active subscriptions: `2,846`
- Churn rate: `3.84%`
- Gross revenue: `$112,480`
- Total customer accounts: `3,214`
- Trial accounts: `214`
- At-risk customers: `96`
- Churned during selected period: `104`

Plan names, prices, active counts and MRR values must remain consistent across
Overview, Analytics and Subscriptions.

---

## 10. Quality requirements

The project should include:

- responsive layout checks;
- TypeScript checking;
- linting;
- keyboard navigation for interactive controls;
- visible focus states;
- correct button semantics;
- status text in addition to status color;
- no unintended horizontal page overflow;
- consistent component states;
- deterministic mock data;
- basic automated tests for important UI behavior;
- visual QA against approved screenshots.

---

## 11. Current delivery scope

Required implementation:

- five desktop product pages;
- mobile Overview;
- mobile navigation drawer;
- shared responsive application shell;
- reusable Mini UI Kit components;
- static coherent demo data;
- basic local interactions;
- tests and quality checks.

Not required at this stage:

- additional product pages;
- exact mobile designs for all desktop routes;
- backend integration;
- production business logic.
