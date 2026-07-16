# Design Handoff

This directory contains the approved UI/UX source material for the Subtera SaaS dashboard implementation.

It is intended to support the Phase 2 Figma-to-Next.js workflow and to keep visual decisions, product scope, implementation rules, and reference assets organized in one place.

## Directory index

| Path | Purpose |
| --- | --- |
| `approved-screens/` | Approved desktop, mobile, and UI Kit screens. This is the primary visual source of truth. |
| `brief/` | Final product specification and implementation scope. |
| `handoff/` | Implementation rules for components, design tokens, responsive behavior, content, data, routes, layout, and visual QA. |
| `presentation/` | Portfolio presentation assets. These are not application routes or product UI. |
| `prototype-source/` | Static visual prototype used as a reference for composition, content, and visual intent only. |
| `references/` | External visual inspiration and layout references only. These are not approved product screens. |

## Source-of-truth order

When files appear to conflict, use the following priority order:

1. `approved-screens/`
2. `brief/final-approved-specification.md`
3. `brief/implementation-scope.md`
4. `handoff/`
5. `prototype-source/`
6. `references/`

The higher item in this list takes precedence.

### Interpretation rules

- Approved screenshots define the final visual direction.
- The final specification defines the approved product structure, content, and behavior.
- The implementation scope defines what must and must not be built.
- Handoff documents define reusable components, data contracts, tokens, responsive rules, and QA requirements.
- The prototype source is a presentation reference, not production architecture.
- Reference images are inspiration only and must not override approved screens or specifications.

## Implementation principles

The production Next.js application must:

- use reusable React components;
- use centralized design tokens;
- keep shared content and fictional product data in typed modules;
- use one shared application shell across all routes;
- preserve semantic HTML and accessible controls;
- support responsive desktop, tablet, and mobile layouts;
- use the real browser viewport;
- render charts as real responsive components;
- preserve consistent content and values across routes;
- avoid duplicated route-specific copies of shared components;
- avoid embedding screenshots as application UI;
- avoid copying the prototype's monolithic HTML and CSS architecture;
- avoid `transform: scale()` as a responsive-layout technique.

## Approved product routes

- `/`
- `/analytics`
- `/customers`
- `/subscriptions`
- `/settings`

The Portfolio Cover, Mini UI Kit, prototype gallery navigation, and presentation frames are documentation or portfolio assets only. They must not appear as product routes.

## Fictional data notice

Subtera is a fictional portfolio project.

All companies, users, customers, subscriptions, transactions, analytics, and financial values in this directory are fictional and must remain internally consistent across the implementation.
