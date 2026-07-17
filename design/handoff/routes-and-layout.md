# Subtera Routes and Layout

## Purpose

This document defines the application routes, shared shell,
page layout rules and responsive behaviour for the Subtera frontend.

The implementation must use real browser dimensions.

Do not reproduce the ChatGPT Sites presentation canvas.

Do not use `transform: scale()` to fit desktop layouts into the viewport.

---

## 1. Product routes

The application contains five product routes.

| Route | Page |
|---|---|
| `/` | Overview |
| `/analytics` | Analytics |
| `/customers` | Customers |
| `/subscriptions` | Subscriptions |
| `/settings` | Settings |

The root route `/` represents the Overview page.

Do not create a separate `/overview` route unless required by the
existing project architecture.

---

## 2. Shared application shell

All product routes must use the same shared application shell.

Recommended component structure:

```text
AppShell
├── Sidebar
├── MainArea
│   ├── Topbar
│   └── PageContent
└── MobileDrawer
```

The shell must not be duplicated inside each route.

Shared shell elements include:

- Subtera brand;
- workspace switcher;
- sidebar search;
- product navigation;
- profile row;
- topbar;
- help button;
- notification button;
- profile menu;
- mobile drawer.

---

## 3. Desktop shell

### Sidebar

- Width: `248px`
- Position: fixed or sticky
- Height: full viewport height
- Background: sidebar token
- Border-right: default border
- Internal padding: approximately `16px`

The sidebar must remain visible on desktop.

The sidebar contains:

1. Subtera logo
2. Workspace switcher
3. Search field
4. Navigation
5. Profile row

Navigation items:

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

Only one navigation item may be active at a time.

The active item must match the current route.

### Main area

The main area occupies all remaining viewport width.

Recommended layout:

```text
grid-template-columns: 248px minmax(0, 1fr);
```

Do not assign a fixed width to the main application area.

Do not center the complete application inside an artificial frame.

### Topbar

- Height: `72px`
- Position: sticky where practical
- Top offset: `0`
- Full width of the main area
- Border-bottom: default border
- Background: application canvas or translucent canvas

The topbar contains:

Left:

- breadcrumb

Right:

- help button;
- notification button;
- user avatar;
- profile menu trigger.

Breadcrumb examples:

- `Dashboard / Overview`
- `Dashboard / Analytics`
- `Dashboard / Customers`
- `Dashboard / Subscriptions`
- `Dashboard / Settings`

The topbar must not repeat the large page title.

---

## 4. Desktop content area

### General rules

- Main content padding: `32px`
- Minimum horizontal padding: `24px`
- Maximum content width: none required
- Grid: `12 columns`
- Grid gutter: `20px`
- Vertical section gap: `20px` to `24px`

Recommended main area structure:

```text
PageContent
├── PageHeader
├── PrimaryContent
└── SecondaryContent
```

The content area must fill the available width.

Avoid large empty margins around the dashboard.

### Page header

The page header contains:

Left:

- page title;
- supporting description.

Right:

- page-specific actions;
- filters;
- date selector;
- export button where applicable.

Recommended layout:

```text
display: flex;
justify-content: space-between;
align-items: flex-start;
gap: 24px;
```

Header controls may wrap when horizontal space is limited.

---

## 5. Overview route

Route:

`/`

Desktop content order:

1. Page header
2. Four KPI cards
3. Revenue Overview
4. Customer Growth
5. Subscriptions by Plan
6. Recent Transactions

### KPI row

Use four equal cards.

Each card occupies three columns of the 12-column grid.

```text
3 columns | 3 columns | 3 columns | 3 columns
```

KPI cards:

- Monthly Recurring Revenue
- Annual Recurring Revenue
- Active Subscriptions
- Churn Rate

### Main analytics row

- Revenue Overview: 8 columns
- Customer Growth: 4 columns

```text
Revenue Overview: 8
Customer Growth: 4
```

### Lower row

- Subscriptions by Plan: 4 columns
- Recent Transactions: 8 columns

```text
Subscriptions by Plan: 4
Recent Transactions: 8
```

---

## 6. Analytics route

Route:

`/analytics`

Desktop content order:

1. Page header and global controls
2. Four analytics KPI cards
3. Revenue and MRR Trends
4. Subscription Growth
5. Churn and Retention
6. Plan Performance

### KPI row

Four equal cards:

- MRR Growth
- Average Revenue per Account
- Net Subscription Growth
- Churn Rate

Each card occupies three columns.

### Primary analytics row

- Revenue and MRR Trends: 8 columns
- Subscription Growth: 4 columns

### Secondary analytics row

- Churn and Retention: 4 columns
- Plan Performance: 8 columns

Analytics charts must use the available card width.

Do not use fixed image dimensions for chart rendering.

---

## 7. Customers route

Route:

`/customers`

Desktop content order:

1. Page header
2. Customer KPI cards
3. Customer status filters
4. Customer accounts table
5. Pagination

### Header actions

Recommended actions:

- Search customers
- Filters
- Export CSV
- Add customer

### KPI row

Four equal cards:

- Total Customers
- Active Subscribers
- Trial Accounts
- At-Risk Customers

### Customer status filters

Primary mutually exclusive tabs:

- All
- Active
- Trial
- Past due
- Churned

Secondary overlapping filter:

- At risk: 96

The At risk filter must not be placed inside the mutually exclusive
status tabs.

### Customer table

The table fills the available content width.

Columns:

- Customer
- Company
- Plan
- Monthly Value
- Status
- Last Activity
- Joined
- Actions

The table must support horizontal scrolling on smaller screens.

Do not compress columns until text becomes unreadable.

---

## 8. Subscriptions route

Route:

`/subscriptions`

Desktop content order:

1. Page header
2. Subscription KPI cards
3. Plan Performance
4. Subscription Status
5. All Subscriptions table
6. Pagination

### Header actions

Recommended actions:

- Date range
- Filters
- Export
- Add subscription

### KPI row

Four equal cards:

- Active Subscriptions
- Monthly Recurring Revenue
- Trialing
- Churn Rate

### Main content row

- Plan Performance: 8 columns
- Subscription Status: 4 columns

### Subscription Status logic

The current-state chart contains only current subscription states:

- Active
- Trialing
- Past due
- Paused

Historical churn activity must remain outside the donut chart.

Show historical churn separately as:

- Churned during selected period
- Churn rate

### Subscriptions table

Columns:

- Customer
- Plan
- Status
- Billing Cycle
- Started
- Next Billing
- Amount
- Actions

The table fills the full content width.

Allow horizontal scrolling when required.

---

## 9. Settings route

Route:

`/settings`

Desktop content order:

1. Page header
2. Settings tabs
3. Settings sections
4. Save and discard actions

### Header actions

- Discard changes
- Save changes

### Settings tabs

- General
- Reporting
- Notifications
- Billing
- Integrations

Only the General tab requires complete visual implementation for the
current demo.

Other tabs may display static placeholder content if included.

### General settings layout

Use a two-column desktop layout.

Left column:

- Workspace Profile
- Regional Preferences
- Danger Zone

Right column:

- Reporting Defaults
- Notifications
- Data and Privacy

Recommended distribution:

```text
Left column: 6 grid columns
Right column: 6 grid columns
```

Sections may stack when available width becomes limited.

---

## 10. Desktop breakpoints

Recommended breakpoints:

- Large desktop: `1440px` and above
- Desktop: `1200px` to `1439px`
- Compact desktop: `1024px` to `1199px`
- Tablet and below: under `1024px`

The exact breakpoint values may be adapted to the existing framework.

Behaviour is more important than the exact values.

### Large desktop

- Sidebar width remains `248px`
- Main content padding: `32px`
- Full 12-column layouts
- Tables display all planned columns where space allows

### Compact desktop

- Sidebar remains visible where practical
- Main content padding may reduce to `24px`
- Page header controls may wrap
- Grid gutter may reduce to `16px`
- Large data tables may scroll horizontally

Do not scale the interface down as a single visual object.

---

## 11. Mobile shell

Exact mobile mockups are provided only for:

- Overview
- Navigation drawer

Recommended mobile breakpoint:

`767px` and below

### Mobile app bar

- Height: `64px`
- Full viewport width
- Sticky at the top
- Contains brand, notification and menu button

The desktop sidebar is hidden on mobile.

### Mobile drawer

- Width: `304px`
- Maximum width: `calc(100vw - 32px)`
- Height: full viewport
- Opens above the application content
- Includes a backdrop
- Closes with the close button or backdrop click

Drawer content:

1. Subtera brand
2. Workspace switcher
3. Search field
4. Navigation
5. Profile row

The drawer must not permanently reserve horizontal page space.

---

## 12. Mobile Overview

Route:

`/`

Mobile content order:

1. Mobile app bar
2. Page title and description
3. Date range
4. Four KPI cards
5. Revenue Overview
6. Customer Growth
7. Subscriptions by Plan
8. Recent Transactions

### Mobile page dimensions

- Reference width: `390px`
- Content padding: `16px`
- Grid: `4 columns`
- Gutter: `12px`
- Section gap: `16px`

The page must also work at common widths such as:

- `320px`
- `360px`
- `375px`
- `390px`
- `430px`

Do not hardcode the page to exactly `390px`.

### KPI layout

Use a two-column grid.

```text
KPI | KPI
KPI | KPI
```

Each KPI card occupies two mobile grid columns.

At very narrow widths, the cards may become one column if required for
readability.

### Mobile analytics cards

All analytics cards become full width.

Charts must:

- reduce the number of X-axis labels;
- preserve readable tooltips;
- avoid horizontal overflow;
- preserve chart meaning.

### Mobile transactions

Replace the desktop table with transaction rows.

Each row contains:

- customer;
- plan;
- date;
- amount;
- status.

Payment method may be hidden on mobile.

---

## 13. Other pages on small screens

Exact mobile mockups are not currently provided for:

- Analytics
- Customers
- Subscriptions
- Settings

These routes must still remain usable and must not break.

Minimum requirements:

- sidebar becomes the mobile drawer;
- page headers stack;
- controls wrap;
- cards become one column or two columns where appropriate;
- data tables use horizontal scrolling;
- settings columns stack vertically;
- no content exceeds the viewport width;
- no text becomes unreadably small.

Do not invent complex mobile-only product features.

---

## 14. Tables and overflow

All desktop tables must use a responsive wrapper.

Recommended behaviour:

```text
overflow-x: auto;
```

Tables must preserve:

- readable column widths;
- status labels;
- monetary values;
- action menus.

Do not force every table column into a narrow mobile viewport.

For the Overview transaction list, use the dedicated mobile row design
instead of the desktop table.

---

## 15. Height and scrolling

The application uses the actual browser viewport.

Recommended shell behaviour:

```text
min-height: 100dvh;
```

The page itself should scroll naturally.

Avoid nested vertical scroll containers unless required for:

- mobile drawer;
- dropdown menus;
- intentionally constrained data panels.

The desktop sidebar may remain sticky or fixed.

The main content must not be clipped by the viewport height.

---

## 16. Excluded presentation elements

The following elements belong only to the ChatGPT Sites prototype and
must not be included in the product:

- top view switcher;
- Portfolio Cover navigation tab;
- Overview Desktop preview tab;
- Analytics Desktop preview tab;
- Customers Desktop preview tab;
- Subscriptions Desktop preview tab;
- Settings Desktop preview tab;
- Overview Mobile preview tab;
- Mobile Drawer preview tab;
- Mini UI Kit preview tab;
- presentation canvas;
- outer showcase frame;
- preview scaling;
- prototype labels such as
  `Static design concept — no production logic`.

The Portfolio Cover and Mini UI Kit are portfolio assets, not application
routes.

---

## 17. Implementation constraints

Do not:

- use `transform: scale()` for the application;
- render page screenshots as product UI;
- create a fixed `1440px` application width;
- duplicate the shell on every route;
- create a separate style system for each page;
- include the prototype view switcher;
- include the presentation background;
- force desktop layouts onto mobile;
- hide overflow problems with page-level clipping.

Use:

- shared layout components;
- shared design tokens;
- reusable grid primitives;
- responsive CSS;
- semantic navigation;
- route-aware active states.

---

## 18. Recommended application structure

The final folder structure may follow the existing repository
architecture.

A possible structure is:

```text
src/
├── app/
│   ├── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── customers/
│   │   └── page.tsx
│   ├── subscriptions/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── dashboard/
│   ├── charts/
│   └── data-table/
│
└── styles/
```

The canonical component category mapping is:

- `layout` → `src/components/layout/`;
- `ui` → `src/components/ui/`;
- `product` → `src/components/dashboard/`;
- `tables` → `src/components/data-table/`;
- `charts` → `src/components/charts/`.

The terms `product` and `tables` describe component responsibilities. They do
not require directories with those names.

Do not create both `src/components/product/` and
`src/components/dashboard/`.

Do not create both `src/components/tables/` and
`src/components/data-table/`.

Create `src/components/charts/` and `src/components/data-table/` only when
their first real implementations are introduced.

Codex may adapt this structure to the existing project.

The shared shell and page layout rules must remain consistent.
