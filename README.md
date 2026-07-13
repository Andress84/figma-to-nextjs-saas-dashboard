# figma-to-nextjs-saas-dashboard

Phase 1 establishes the technical foundation for a professional Figma-to-Next.js portfolio project. It includes the application architecture, responsive dashboard shell, placeholder routes, design-token foundation, testing setup, and automated quality checks. It intentionally does not include the final Figma-led visual design, production charts, authentication, a database, billing, or backend services.

The planned product is a fictional B2B SaaS analytics dashboard that demonstrates a reliable workflow for the Upwork Project Catalog service: “You will get a Figma to React or Next.js responsive frontend.”

## Technology stack

- Next.js 16.2 with the App Router and React 19
- TypeScript in strict mode
- React Server Components by default
- Tailwind CSS 4 and CSS custom properties for future design tokens
- pnpm 11 through Corepack on Node.js 24 LTS
- Biome for formatting and import organization
- ESLint with Next.js Core Web Vitals and TypeScript rules
- Vitest, React Testing Library, and jsdom
- Playwright and `@axe-core/playwright`
- GitHub Actions

## Routes

| Route | Phase 1 responsibility |
| --- | --- |
| `/` | Dashboard shell and foundation overview |
| `/analytics` | Analytics module placeholder |
| `/customers` | Customer module placeholder |
| `/subscriptions` | Subscription module placeholder |
| `/settings` | Settings module placeholder |

## Project structure

```text
.
├── .github/workflows/ci.yml     # Full automated quality suite
├── docs/                        # Figma, Lighthouse, and screenshot handoff notes
├── e2e/                         # Navigation and accessibility browser tests
├── public/                      # Static assets added only when the design needs them
├── src/
│   ├── app/                     # App Router layouts, routes, and error states
│   ├── components/
│   │   ├── dashboard/           # Dashboard-specific shared presentation
│   │   ├── layout/              # Shell, header, sidebar, and navigation
│   │   └── ui/                  # Generic reusable UI
│   ├── data/mock/               # Fictional placeholder data
│   ├── features/                # Business-specific route modules
│   ├── lib/                     # Shared utilities and colocated unit tests
│   ├── test/                    # Shared test initialization
│   └── types/                   # Shared TypeScript contracts
├── biome.json
├── playwright.config.ts
└── vitest.config.ts
```

Directories are added only when they contain a real implementation or durable documentation. Future chart, data-table, form, validation, service, icon, and image directories should be introduced with the work that needs them.

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

`pnpm fix` formats files, organizes imports, and applies safe local lint fixes. `pnpm check` validates formatting, runs ESLint, performs strict TypeScript checking, runs unit/component tests, and creates a production build.

## Testing

```bash
pnpm test
pnpm test:watch
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:e2e:ui
pnpm check:full
```

`pnpm check:full` runs the standard quality suite followed by Playwright navigation and accessibility smoke tests. The UI command is intended for local interactive debugging.

## Demo disclaimer

This is a portfolio demonstration, not a live SaaS product. Any companies, customers, analytics, subscriptions, transactions, or financial values added in future phases will be entirely fictional. No real customer or payment data should be used.

The project is intended to demonstrate a professional, accessible, responsive Figma-to-Next.js implementation workflow. Phase 1 stops at the technical foundation; the final dashboard design belongs to a later phase.
