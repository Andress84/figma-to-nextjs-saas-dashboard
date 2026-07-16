# Subtera Component Map

## Purpose

This document defines the shared component architecture for the Subtera
frontend implementation.

The goal is to prevent duplicated markup, duplicated styles and
page-specific component copies.

All five product routes must reuse the same application shell,
design tokens and UI primitives.

---

## 1. Component principles

Use shared components whenever the same visual or behavioural pattern
appears on more than one page.

Do not create separate versions of the same component for every route.

Examples of patterns that must remain shared:

- navigation items;
- buttons;
- form controls;
- metric cards;
- badges;
- chart containers;
- tables;
- pagination;
- settings sections;
- mobile drawer;
- page headers.

Prefer composition over large page-specific components.

Use route data and configuration objects to change content instead of
duplicating component markup.

---

## 2. Recommended component structure

A possible component structure is:

```text
src/components/
├── layout/
│   ├── app-shell.tsx
│   ├── sidebar.tsx
│   ├── sidebar-navigation.tsx
│   ├── topbar.tsx
│   ├── page-header.tsx
│   ├── page-content.tsx
│   └── mobile-drawer.tsx
│
├── ui/
│   ├── button.tsx
│   ├── icon-button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   ├── segmented-control.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── toggle.tsx
│   ├── card.tsx
│   ├── tooltip.tsx
│   ├── pagination.tsx
│   └── status-message.tsx
│
├── charts/
│   ├── chart-card.tsx
│   ├── chart-legend.tsx
│   ├── chart-tooltip.tsx
│   ├── revenue-chart.tsx
│   ├── customer-growth-chart.tsx
│   ├── subscription-growth-chart.tsx
│   ├── churn-chart.tsx
│   └── donut-chart.tsx
│
├── tables/
│   ├── data-table.tsx
│   ├── table-header.tsx
│   ├── customer-table.tsx
│   ├── subscription-table.tsx
│   ├── plan-performance-table.tsx
│   ├── transaction-table.tsx
│   └── mobile-transaction-list.tsx
│
└── product/
    ├── metric-card.tsx
    ├── workspace-switcher.tsx
    ├── profile-row.tsx
    ├── trend-badge.tsx
    ├── status-badge.tsx
    ├── plan-row.tsx
    ├── settings-section.tsx
    ├── form-field.tsx
    └── danger-zone.tsx
```

Codex may adapt filenames to the existing project conventions.

The responsibility boundaries should remain the same.

---

## 3. Layout components

### AppShell

Used by:

- `/`
- `/analytics`
- `/customers`
- `/subscriptions`
- `/settings`

Responsibilities:

- desktop two-column shell;
- desktop sidebar;
- main content area;
- topbar;
- mobile app bar;
- mobile drawer;
- route-aware active navigation;
- viewport-height behaviour.

The AppShell must not contain page-specific dashboard content.

Recommended composition:

```text
AppShell
├── Sidebar
├── MainArea
│   ├── Topbar
│   └── RouteContent
└── MobileDrawer
```

### Sidebar

Responsibilities:

- brand;
- workspace switcher;
- search field;
- navigation;
- profile row.

The desktop width is defined in the design tokens and layout handoff.

Do not duplicate the Sidebar inside each route.

### SidebarNavigation

Receives a navigation configuration list.

Suggested item shape:

```text
label
href
icon
isActive
```

Navigation items:

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

The active state must be calculated from the current route.

### Topbar

Responsibilities:

- breadcrumb;
- help action;
- notification action;
- profile trigger.

The Topbar must not contain page-specific title text.

### PageHeader

Responsibilities:

- page title;
- supporting description;
- page-level controls;
- page-level actions.

Suggested props:

```text
title
description
actions
```

Examples of actions:

- date range;
- filters;
- export;
- search;
- add customer;
- add subscription;
- save changes.

### PageContent

Responsibilities:

- consistent horizontal padding;
- vertical section spacing;
- responsive width handling.

### MobileDrawer

Responsibilities:

- mobile navigation overlay;
- backdrop;
- close button;
- workspace switcher;
- navigation;
- profile row;
- focus management;
- escape-key close;
- body scroll lock while open.

---

## 4. UI primitives

### Button

Required visual variants:

- primary;
- secondary;
- ghost;
- destructive.

Required sizes:

- default;
- compact.

Recommended props:

```text
variant
size
disabled
loading
leadingIcon
trailingIcon
```

Primary examples:

- Add customer
- Add subscription
- Save changes

Secondary or ghost examples:

- Export
- Filters
- View all
- Manage plans
- Discard changes

Destructive example:

- Delete workspace

### IconButton

Used for:

- help;
- notifications;
- mobile menu;
- close;
- row actions;
- refresh;
- pagination arrows.

Required states:

- default;
- hover;
- active;
- disabled;
- focus-visible.

### Input

Used for:

- sidebar search;
- customer search;
- subscription search;
- settings fields.

Supported options:

- leading icon;
- trailing shortcut;
- disabled state;
- read-only state;
- error state where needed.

### Select

Used for:

- date range;
- billing cycle;
- plan filter;
- status filter;
- regional preferences;
- reporting defaults.

Select width should follow content or parent layout.

Do not hardcode every select to the same width.

### Tabs

Used for:

- customer status tabs;
- settings tabs.

Customer status tabs:

- All
- Active
- Trial
- Past due
- Churned

Settings tabs:

- General
- Reporting
- Notifications
- Billing
- Integrations

### SegmentedControl

Used for:

- Revenue / MRR switching.

Only one segment may be active.

### Badge

Base component for compact status and metadata labels.

Recommended variants:

- neutral;
- success;
- warning;
- error;
- information;
- violet.

### Avatar

Supported forms:

- image;
- initials;
- fallback icon.

Used in:

- profile row;
- topbar;
- customer rows;
- transaction rows.

### Toggle

Used in Settings.

Required states:

- on;
- off;
- disabled;
- focus-visible.

### Card

Base surface component.

Suggested variants:

- default;
- raised;
- highlighted;
- danger.

The Card component owns:

- background;
- border;
- radius;
- internal padding;
- optional shadow or glow.

Do not hardcode card surfaces separately in every page.

### Tooltip

Used for:

- charts;
- icon buttons;
- compact explanations.

Chart tooltips may use a specialised wrapper around the shared tooltip
surface.

### Pagination

Used on:

- Customers;
- Subscriptions.

Responsibilities:

- previous;
- page numbers;
- ellipsis;
- next;
- disabled states;
- current page state.

---

## 5. Product components

### WorkspaceSwitcher

Used in:

- desktop sidebar;
- mobile drawer.

Displays:

- workspace icon;
- workspace label;
- workspace name;
- chevron.

Current demo workspace:

- Acme Cloud

### ProfileRow

Used in:

- desktop sidebar;
- mobile drawer.

Displays:

- avatar;
- Maya Chen;
- Workspace Admin;
- chevron.

### TrendBadge

Purpose:

- display KPI movement or comparison.

Required variants:

- positive;
- negative;
- improvement;
- neutral.

Important rule:

A lower churn rate is an improvement and must use the positive visual
treatment.

Examples:

- `+8.4%`
- `+5.2%`
- `-0.43 pp`
- `12 fewer`

The semantic meaning determines the colour, not the arrow direction
alone.

### StatusBadge

Customer status values:

- Active
- Trial
- Past due
- Churned

Subscription status values:

- Active
- Trialing
- Past due
- Paused
- Canceled

Transaction status values:

- Paid
- Pending
- Refunded
- Failed

Do not communicate status using colour alone.

Always include readable text.

### MetricCard

Used on:

- Overview;
- Analytics;
- Customers;
- Subscriptions.

Suggested props:

```text
label
value
trend
supportingText
icon
sparkline
highlighted
```

Required visual variants:

- default;
- highlighted.

The highlighted treatment is used selectively.

Do not apply violet glow to every metric card.

### ChartCard

Shared container for analytics visualisations.

Suggested props:

```text
title
description
value
trend
controls
legend
footer
children
```

The ChartCard owns layout and spacing.

The chart implementation owns data rendering.

### PlanRow

Used in:

- Overview plan distribution;
- Mini UI Kit;
- plan-related compact lists.

Displays:

- colour indicator;
- plan name;
- price;
- active count;
- subscriber share;
- MRR value.

### SettingsSection

Used on the Settings route.

Suggested props:

```text
title
description
actions
variant
children
```

Variants:

- default;
- informational;
- danger.

### FormField

Used inside Settings sections.

Responsibilities:

- label;
- input or select;
- helper text;
- validation message;
- disabled state.

### DangerZone

Used only on Settings.

Displays:

- warning copy;
- destructive action;
- danger visual treatment.

The delete action is static in the demo.

---

## 6. Chart components

Charts must be implemented as real responsive components.

Do not use screenshots as chart content.

### ChartCard

Shared container for all chart types.

### ChartLegend

Supports:

- colour marker;
- label;
- optional value.

### ChartTooltip

Supports:

- date or period label;
- current value;
- previous value;
- percentage change.

### RevenueChart

Used on:

- Overview;
- Analytics.

Series:

- current period;
- previous period.

Visual rules:

- primary violet solid line;
- subtle violet area fill;
- muted comparison line;
- restrained grid;
- responsive X-axis labels.

### CustomerGrowthChart

Used on:

- Overview.

Series:

- new subscriptions;
- churned subscriptions.

Supporting values:

- New
- Churned
- Net

### SubscriptionGrowthChart

Used on:

- Analytics.

Series:

- new subscriptions;
- churned subscriptions.

The visual may use grouped bars as shown in the approved mockup.

### ChurnChart

Used on:

- Analytics.

Purpose:

- compare current churn trend with the previous period;
- communicate that lower churn is beneficial.

### DonutChart

Used on:

- Overview plan distribution;
- Subscriptions status.

The component must support different data sets.

Overview plan distribution data:

- Starter
- Growth
- Pro
- Teams

Subscription status data:

- Active
- Trialing
- Past due
- Paused

Do not include historical churn inside the current-state subscription
status donut.

---

## 7. Table components

### DataTable

Base table wrapper.

Responsibilities:

- table structure;
- responsive overflow;
- header;
- body;
- selected row;
- empty state if required;
- pagination area;
- row actions.

Suggested props:

```text
columns
rows
rowKey
selectedRowKey
renderRowActions
footer
```

Avoid building a highly generic enterprise table framework.

Only support features required by the approved screens.

### CustomerTable

Route:

`/customers`

Columns:

- Customer
- Company
- Plan
- Monthly Value
- Status
- Last Activity
- Joined
- Actions

Customer statuses:

- Active
- Trial
- Past due
- Churned

At risk is an overlapping condition and is not the main row status.

### SubscriptionTable

Route:

`/subscriptions`

Columns:

- Customer
- Plan
- Status
- Billing Cycle
- Started
- Next Billing
- Amount
- Actions

Subscription statuses:

- Active
- Trialing
- Past due
- Paused
- Canceled

### PlanPerformanceTable

Used on:

- Analytics;
- Subscriptions.

Columns may include:

- Plan
- Price
- Active
- Share
- MRR
- MRR Contribution
- Churn
- Trend

The Subscriptions version may omit MRR Contribution if the approved
mockup does not show it.

### TransactionTable

Used on desktop Overview.

Columns:

- Customer
- Plan
- Date
- Payment
- Amount
- Status

### MobileTransactionList

Used on mobile Overview.

Each row displays:

- avatar;
- customer;
- plan;
- date;
- amount;
- status.

Payment method is omitted on mobile.

---

## 8. Route-to-component map

### Overview

Route:

`/`

Uses:

- AppShell
- PageHeader
- MetricCard
- RevenueChart
- CustomerGrowthChart
- DonutChart
- PlanRow
- TransactionTable
- MobileTransactionList
- TrendBadge
- StatusBadge

### Analytics

Route:

`/analytics`

Uses:

- AppShell
- PageHeader
- MetricCard
- RevenueChart
- SubscriptionGrowthChart
- ChurnChart
- PlanPerformanceTable
- TrendBadge

### Customers

Route:

`/customers`

Uses:

- AppShell
- PageHeader
- MetricCard
- Input
- Button
- Tabs
- Badge
- CustomerTable
- Pagination
- TrendBadge
- StatusBadge

### Subscriptions

Route:

`/subscriptions`

Uses:

- AppShell
- PageHeader
- MetricCard
- DonutChart
- PlanPerformanceTable
- SubscriptionTable
- Select
- Pagination
- TrendBadge
- StatusBadge

### Settings

Route:

`/settings`

Uses:

- AppShell
- PageHeader
- Tabs
- SettingsSection
- FormField
- Input
- Select
- Toggle
- Button
- StatusMessage
- DangerZone

---

## 9. Shared data and configuration

Where practical, keep repeated product data in shared configuration
files.

Possible data groups:

```text
navigationItems
planDefinitions
customerStatuses
subscriptionStatuses
transactionStatuses
overviewMetrics
analyticsMetrics
customerMetrics
subscriptionMetrics
```

Plan definitions must remain consistent across all pages.

Approved plans:

| Plan | Price |
|---|---:|
| Starter | $15 |
| Growth | $29 |
| Pro | $49 |
| Teams | $99 |

Do not duplicate different plan prices in separate route files.

---

## 10. Component variants required for the demo

Only create variants that are visible in the final screens.

### NavigationItem

- default;
- active.

### Button

- primary;
- secondary;
- ghost;
- destructive;
- disabled where shown.

### TrendBadge

- positive;
- negative;
- improvement;
- neutral if required.

### StatusBadge

- paid;
- pending;
- refunded;
- failed;
- active;
- trial;
- trialing;
- past due;
- paused;
- churned;
- canceled.

### MetricCard

- default;
- highlighted.

### Card

- default;
- raised;
- highlighted;
- danger.

### TransactionRow

- desktop;
- mobile.

Do not build unnecessary variant libraries for states that are not used.

---

## 11. Responsive component behaviour

### Sidebar

Desktop:

- visible;
- fixed width.

Mobile:

- hidden;
- replaced by MobileDrawer.

### PageHeader

Desktop:

- title and actions in one row where space allows.

Mobile:

- title, description and controls stack vertically.

### MetricCard

Desktop:

- four cards in one row.

Mobile:

- two-column grid;
- one column at very narrow widths if required.

### ChartCard

Desktop:

- follows the approved 8/4 or 4/8 grid.

Mobile:

- full width.

### DataTable

Desktop:

- full table layout.

Tablet:

- horizontal scrolling where required.

Mobile:

- keep horizontal scrolling for large management tables;
- use MobileTransactionList only for Overview transactions.

### SettingsSection

Desktop:

- two-column page layout.

Mobile:

- all sections stack vertically.

---

## 12. Accessibility requirements

Interactive components must support:

- keyboard navigation;
- visible focus states;
- semantic button elements;
- semantic links for navigation;
- form labels;
- accessible names for icon-only buttons;
- appropriate ARIA attributes for drawer, tabs and toggles;
- sufficient contrast;
- non-colour status communication.

The mobile drawer must:

- trap focus while open;
- close with Escape;
- restore focus to the menu trigger;
- prevent background interaction.

---

## 13. Implementation constraints

Do not:

- duplicate shared components per route;
- hardcode the same colour values inside multiple components;
- hardcode plan prices in multiple locations;
- render charts as screenshots;
- render whole pages as screenshots;
- use route-specific copies of Button, Badge or Card;
- create independent sidebar implementations;
- use `transform: scale()` for responsive layouts;
- include the ChatGPT Sites view switcher;
- include portfolio presentation chrome in product routes.

Use:

- design tokens;
- shared primitives;
- composition;
- route configuration;
- reusable responsive layouts;
- typed component props;
- consistent semantic naming.

---

## 14. Suggested implementation order

1. Create design tokens.
2. Build AppShell.
3. Build Sidebar, Topbar and MobileDrawer.
4. Build UI primitives.
5. Build MetricCard, TrendBadge and StatusBadge.
6. Build ChartCard and chart helpers.
7. Build table primitives.
8. Implement Overview.
9. Implement Analytics.
10. Implement Customers.
11. Implement Subscriptions.
12. Implement Settings.
13. Verify shared component reuse.
14. Run responsive and visual QA.

The final implementation should allow global visual adjustments through
shared tokens and components instead of route-by-route manual edits.
