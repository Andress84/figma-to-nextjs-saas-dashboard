# figma-to-nextjs-saas-dashboard

A professional Figma-to-Next.js portfolio project for a fictional B2B subscription analytics SaaS dashboard named **Subtera**.

The repository demonstrates a structured workflow for the Upwork Project Catalog service: **“You will get a Figma to React or Next.js responsive frontend.”**

## Project status

- **Phase 1 — Technical foundation:** complete
- **Design handoff:** complete
- **Phase 2 — Next.js visual implementation:** pending

Phase 1 established the application architecture, responsive dashboard shell, placeholder routes, initial design-token foundation, testing setup, and automated quality checks.

The approved UI/UX package is now included in the repository. It contains desktop and mobile reference screens, the final product specification, component architecture, design tokens, responsive rules, fictional product data, visual QA requirements, and the original static visual prototype.

Phase 2 will replace the current placeholder content with the approved Subtera interface using reusable React components, centralized design tokens, responsive layouts, accessible interactions, and shared typed mock data.

The project intentionally does not include authentication, a database, real billing, Stripe integration, backend services, or production customer data.

## Technology stack

- Next.js 16.2 with the App Router and React 19
- TypeScript in strict mode
- React Server Components by default
- Tailwind CSS 4 and CSS custom properties for design tokens
- pnpm 11 through Corepack on Node.js 24 LTS
- Biome for formatting and import organization
- ESLint with Next.js Core Web Vitals and TypeScript rules
- Vitest, React Testing Library, and jsdom
- Playwright across Chromium, Firefox, and WebKit, with `@axe-core/playwright`
- GitHub Actions

## Product routes

The five product routes already exist as Phase 1 placeholders. Phase 2 will implement the approved UI for each route.

| Route | Product page |
| --- | --- |
| `/` | Overview |
| `/analytics` | Analytics |
| `/customers` | Customers |
| `/subscriptions` | Subscriptions |
| `/settings` | Settings |

All routes share one responsive application shell.

## Design handoff

The `design/` directory contains the approved UI/UX source material for Phase 2.

Implementation priority:

1. `design/approved-screens/`
2. `design/brief/final-approved-specification.md`
3. `design/brief/implementation-scope.md`
4. `design/handoff/`
5. `design/prototype-source/`
6. `design/references/`

Approved screenshots are the visual source of truth. The prototype source is a visual and content reference only and must not be copied as the production architecture.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml                         # Full automated quality suite
├── design/
│   ├── approved-screens/                 # Approved desktop, mobile, and UI Kit screens
│   ├── brief/                            # Final specification and implementation scope
│   ├── handoff/                          # Components, data, tokens, responsive rules, and QA
│   ├── presentation/                     # Portfolio presentation assets
│   ├── prototype-source/                 # Static visual prototype reference
│   └── references/                       # Visual inspiration and source references
├── docs/                                 # Additional Figma, Lighthouse, and screenshot notes
├── e2e/                                  # Navigation and accessibility browser tests
├── public/                               # Static product assets
├── src/
│   ├── app/                              # App Router layouts, routes, and error states
│   ├── components/
│   │   ├── dashboard/                    # Dashboard-specific shared presentation
│   │   ├── layout/                       # Shell, header, sidebar, and navigation
│   │   └── ui/                           # Generic reusable UI
│   ├── data/
│   │   └── mock/                         # Fictional deterministic product data
│   ├── features/                         # Business-specific route modules
│   ├── lib/                              # Shared utilities and colocated unit tests
│   ├── test/                             # Shared test initialization
│   └── types/                            # Shared TypeScript contracts
├── biome.json
├── playwright.config.ts
└── vitest.config.ts
```

Directories are added only when they contain a real implementation or durable documentation. Chart, table, form, validation, service, icon, and image directories should be introduced only when the implementation requires them.

## Installation

Use a Node.js 24 LTS release. With `nvm`, the checked-in version selector can be used first:

```bash
nvm use
corepack enable pnpm
pnpm install --frozen-lockfile
```

No project tool needs to be installed globally.

## Development

```bash
pnpm dev
pnpm build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) after starting the development server.

## Quality checks

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm lint:fix
pnpm typecheck
pnpm fix
pnpm check
```

`pnpm fix` formats files, organizes imports, and applies safe local lint fixes.

`pnpm check` validates formatting, runs ESLint, performs strict TypeScript checking, runs unit and component tests, and creates a production build.

## Testing

```bash
pnpm test
pnpm test:watch
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
pnpm test:e2e:ui
pnpm check:full
```

`pnpm check:full` runs the standard quality suite followed by Playwright navigation and accessibility smoke tests in Chromium, Firefox, and WebKit.

The UI command is intended for local interactive debugging.

## Implementation principles

The Phase 2 implementation must:

- use reusable React components;
- use centralized design tokens;
- keep shared product data in typed mock-data modules;
- preserve consistent values across all routes;
- use the real browser viewport;
- remain responsive across desktop, tablet, and mobile;
- use semantic HTML and accessible controls;
- preserve visible keyboard focus states;
- support reduced-motion preferences;
- render charts as real responsive components;
- avoid route-specific copies of shared UI;
- avoid `transform: scale()` for responsive layouts;
- avoid embedding approved screenshots as product UI.

## Demo disclaimer

This is a portfolio demonstration, not a live SaaS product.

All companies, customers, analytics, subscriptions, transactions, financial values, and account details used in the project are fictional. No real customer, payment, authentication, or production data should be added.

The project is intended to demonstrate a professional, accessible, responsive Figma-to-Next.js implementation workflow. The technical foundation and approved UI/UX handoff are complete; the final Next.js visual implementation belongs to Phase 2.
