# Subtera Project Instructions

## Project purpose

This repository contains a portfolio demonstration of a fictional B2B
subscription analytics SaaS dashboard named Subtera.

The implementation must demonstrate:

- professional Figma-to-Next.js workflow;
- reusable React components;
- centralized design tokens;
- responsive layouts;
- accessible interactions;
- deterministic fictional data;
- automated quality checks.

This is a frontend portfolio demo.

Do not present it as a production billing platform.

---

## Source of truth

Before implementing or changing product UI, read the relevant files in this
order:

1. `design/approved-screens/`
2. `design/brief/final-approved-specification.md`
3. `design/brief/implementation-scope.md`
4. `design/handoff/`
5. `design/prototype-source/`
6. `design/references/`

Rules:

- Approved screenshots are the visual source of truth.
- Brief and handoff documents define content, data and implementation rules.
- Prototype source is a visual and content reference only.
- Original references provide inspiration only and must not be copied directly.
- When two sources conflict, the source listed earlier takes priority.

---

## Required product routes

Use Next.js App Router.

Required routes:

- `/` — Overview
- `/analytics` — Analytics
- `/customers` — Customers
- `/subscriptions` — Subscriptions
- `/settings` — Settings

All routes must share one reusable application shell.

Do not add a separate `/overview` route unless the existing architecture
requires it and the reason is documented.

---

## Package manager and runtime

- Use `pnpm`.
- Use the Node.js version declared by the repository.
- Do not use npm or yarn.
- Do not replace the lockfile.
- Do not install project tools globally.
- Do not add a major dependency without explaining why it is necessary.

Install dependencies with:

```text
corepack enable pnpm
pnpm install --frozen-lockfile
```

---

## Required quality commands

Run the smallest relevant checks while working.

Before considering an implementation pass complete, run:

```text
pnpm check
```

When Playwright browser binaries are available, also run:

```text
pnpm check:full
```

Available focused commands include:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Do not claim that checks passed unless they were actually executed.

If a check cannot run, explain the exact reason.

---

## TypeScript and React

- Keep TypeScript in strict mode.
- Avoid `any`.
- Use `unknown` and type narrowing when the value is not known.
- Document any technically unavoidable use of `any`.
- Prefer React Server Components.
- Add `"use client"` only when browser interaction, state, effects or framework
  error boundaries require it.
- Keep client-component boundaries small.
- Do not introduce unnecessary global state management.
- Keep mock data deterministic and separate from React presentation components.
- Keep shared TypeScript contracts in `src/types` where appropriate.

---

## Existing project architecture

Preserve the repository's established structure unless a change is clearly
necessary.

Use:

- `src/app` for App Router layouts, routes and error states;
- `src/components/ui` for generic reusable UI;
- `src/components/layout` for shell, sidebar, topbar and navigation;
- `src/components/dashboard` for shared dashboard presentation;
- `src/features` for business-specific route modules;
- `src/data/mock` for fictional mock data;
- `src/lib` for shared utilities;
- `src/types` for shared TypeScript contracts;
- `src/test` for shared test setup;
- `e2e` for Playwright tests.

Create new directories only when they contain real implementation or durable
documentation.

Do not perform a broad architecture rewrite unless the task explicitly
requires it.

Document any necessary architectural deviation.

---

## Shared component requirements

Build repeated UI as shared components.

At minimum, reuse shared implementations for:

- AppShell;
- Sidebar;
- SidebarNavigation;
- Topbar;
- PageHeader;
- MobileDrawer;
- Button;
- IconButton;
- Input;
- Select;
- Tabs;
- SegmentedControl;
- Badge;
- Avatar;
- Toggle;
- Card;
- Tooltip;
- Pagination;
- MetricCard;
- ChartCard;
- TrendBadge;
- StatusBadge;
- reusable table primitives;
- settings sections and form fields.

Do not create route-specific copies of the same component.

Global changes to the following must be possible from shared tokens or shared
components:

- colors;
- typography;
- spacing;
- card padding;
- radii;
- borders;
- shadows;
- button styles;
- form-control styles;
- status treatments.

Prefer composition and typed configuration over large monolithic page
components.

---

## Design tokens

Use centralized design tokens.

Do not scatter raw visual values across route components.

The approved token definitions are in:

`design/handoff/design-tokens.md`

The implementation may use Tailwind theme values, CSS custom properties or the
existing centralized token approach.

Maintain semantic token meaning.

Do not create slightly different violet, border, radius or spacing values for
individual pages without a documented reason.

---

## Responsive implementation

Follow:

`design/handoff/responsive-rules.md`

Required behaviour:

- Desktop sidebar width is `248px`.
- Main application area fills the remaining browser width.
- Desktop topbar is approximately `72px`.
- Desktop content padding is approximately `32px`.
- Mobile content padding is approximately `16px`.
- Desktop sidebar becomes an overlay drawer below the navigation breakpoint.
- Overview must closely match the approved mobile composition.
- Analytics, Customers, Subscriptions and Settings must remain structurally
  responsive even though exact mobile mockups are not provided.
- Wide tables may scroll inside deliberate table containers.
- The page body must not have unintended horizontal overflow.

Do not:

- use `transform: scale()` for responsive layout;
- use a fixed `1440px` application canvas;
- embed screenshots as product UI;
- force desktop layouts onto mobile;
- hide layout defects with page-level clipping.

---

## Prototype exclusions

The exported ChatGPT Work prototype is not the production architecture.

Do not copy into the product:

- the prototype view switcher;
- the presentation canvas;
- the gallery shell;
- Portfolio Cover navigation;
- Mini UI Kit navigation;
- large outer presentation margins;
- artificial preview framing;
- preview scaling;
- monolithic prototype architecture.

The application must use real routes and the real browser viewport.

---

## Data requirements

All companies, people, analytics, subscriptions, transactions and financial
values must remain fictional.

Never add real customer data, payment data, secrets or personal information.

Use the approved content and values from:

`design/handoff/content-and-data.md`

Keep repeated values in shared typed mock-data modules.

Do not duplicate conflicting values across routes.

Important approved values include:

- MRR: `$84,720`
- ARR: `$1,016,640`
- Active subscriptions: `2,846`
- Churn rate: `3.84%`
- Gross revenue: `$112,480`
- Total customer accounts: `3,214`
- Subscription status total: `3,164`

Plan names, prices, active counts and MRR values must remain consistent across
Overview, Analytics and Subscriptions.

---

## Charts

Implement charts as real responsive components.

Do not use chart screenshots.

Before adding a chart dependency:

- inspect the existing repository;
- explain why the dependency is needed;
- prefer a maintained, accessible and tree-shakeable option;
- avoid adding multiple chart libraries.

Charts must:

- resize with their containers;
- preserve approved data meaning;
- provide accessible summaries or labels;
- keep tooltips within the viewport;
- respect reduced-motion preferences;
- remain readable without glow.

---

## Tables

Use shared table primitives.

Required behaviour:

- readable columns;
- consistent row height;
- selected-row state;
- accessible row actions;
- status text in addition to color;
- pagination where approved;
- contained horizontal scrolling at smaller widths.

Do not build an unnecessary enterprise table framework.

Implement only the features required by the approved screens.

---

## Accessibility

Maintain:

- semantic landmarks;
- semantic links for navigation;
- semantic buttons for actions;
- accessible names for icon-only buttons;
- associated form labels;
- keyboard navigation;
- visible focus states;
- sufficient contrast;
- status text in addition to color;
- reduced-motion support;
- accessible drawer behaviour;
- accessible tab and toggle semantics.

The mobile drawer must:

- close with Escape;
- manage focus while open;
- restore focus to the trigger;
- prevent background interaction.

Do not make information available only on hover.

---

## Testing

Add or update tests for meaningful behaviour introduced by the task.

Use:

- Vitest and React Testing Library for unit and component behaviour;
- Playwright for navigation, responsive shell and accessibility smoke tests;
- `@axe-core/playwright` where appropriate.

Prioritize tests for:

- route navigation;
- active navigation states;
- mobile drawer open and close;
- keyboard behaviour;
- tabs and segmented controls;
- table filters or pagination when implemented;
- important data formatting;
- accessibility regressions.

Do not create brittle tests that depend on incidental implementation details.

---

## Work discipline

Before editing code:

1. Read this file.
2. Read the relevant brief and handoff documents.
3. Inspect the current implementation.
4. Identify reusable code.
5. State the intended scope.

During implementation:

- make small, reviewable changes;
- avoid unrelated refactors;
- preserve already approved pages;
- keep mock data centralized;
- keep components typed;
- update tests with behaviour changes.

After implementation:

- compare against the approved screenshots;
- use `design/handoff/visual-qa-checklist.md`;
- run the relevant checks;
- report files changed;
- report checks actually run;
- report any remaining visual or technical differences.

---

## Scope exclusions

Do not implement unless a later task explicitly adds them:

- backend;
- authentication;
- database;
- Stripe or payment integration;
- real billing;
- real exports;
- real customer creation;
- real subscription creation;
- email notifications;
- AI functionality;
- marketing landing page;
- production permissions;
- production multi-tenant logic;
- production deployment infrastructure.

Visual controls for excluded functionality may use local demo states.

Do not imply that excluded production functionality is working.

---

## Repository hygiene

Do not commit:

- generated build output;
- test reports;
- browser binaries;
- temporary screenshots outside approved documentation locations;
- secrets;
- environment credentials;
- real customer data;
- real payment data;
- local IDE metadata not already tracked.

Do not modify generated files manually.

Do not update dependencies without a task-related reason.

Do not change the agreed architecture without documenting the reason.

---

## Completion criteria

A task is complete only when:

- the requested scope is implemented;
- shared components are used;
- approved data remains consistent;
- responsive behaviour is preserved;
- accessibility requirements are addressed;
- no prototype-only UI was added;
- relevant tests were added or updated;
- relevant checks were run;
- known limitations are reported honestly.

For visual tasks, completion also requires comparison with the relevant files in:

`design/approved-screens/`
