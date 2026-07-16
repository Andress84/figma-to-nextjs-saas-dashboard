# Subtera — Final Approved Specification

## 1. Purpose

Subtera is a fictional subscription analytics SaaS dashboard created as a
portfolio and GitHub demonstration project.

The product helps a SaaS team monitor:

- recurring revenue;
- subscription growth;
- customer accounts;
- churn and retention;
- plan performance;
- subscription lifecycle states;
- reporting preferences.

This is a static frontend demonstration, not a production billing platform.

---

## 2. Source of truth

Implementation priority:

1. `design/approved-screens/`
2. This specification: `design/brief/final-approved-specification.md`
3. `design/brief/implementation-scope.md`
4. `design/handoff/`
5. `design/prototype-source/`
6. `design/references/`

When two sources conflict, the source listed earlier takes priority.

The approved screenshots define the final visual direction.

This specification defines the approved product structure, content, and
behavior.

The implementation scope defines what must and must not be built.

The handoff documents define reusable components, design tokens, responsive
rules, shared fictional data, routes, layout, and visual QA requirements.

The prototype source is a visual and content reference only. It must not be
used as the production application architecture.

The original reference images define visual inspiration only. They must not be
copied directly or override approved screens and specifications.

---

## 3. Product routes

| Route | Page |
|---|---|
| `/` | Overview |
| `/analytics` | Analytics |
| `/customers` | Customers |
| `/subscriptions` | Subscriptions |
| `/settings` | Settings |

Use Next.js App Router.

---

## 4. Product direction

The product should feel like a calm, premium B2B SaaS workspace.

Visual characteristics:

- near-black application canvas;
- dark clearly separated surfaces;
- restrained violet accent;
- subtle glow used only for selected or important elements;
- rounded cards;
- clean one-pixel borders;
- high data readability;
- dense but organized desktop layout;
- minimal decorative effects;
- no gaming or crypto visual language;
- no excessive glassmorphism;
- no neon outlines around every element.

Working product name: **Subtera**.

Workspace name: **Acme Cloud**.

Default profile:

- Name: Maya Chen
- Role: Workspace Admin
- Initials: MC

---

## 5. Desktop application shell

Reference desktop width: approximately `1440px`.

Application shell:

- Sidebar width: `248px`
- Topbar height: `72px`
- Main content padding: `32px`
- Main grid: `12 columns`
- Grid gutter: `20px`
- Vertical section gap: `20–24px`

The sidebar is fixed on desktop. The main content occupies the remaining
browser width.

Do not use:

- a centered presentation canvas;
- artificial application scaling;
- `transform: scale()`;
- the ChatGPT Work view switcher;
- the prototype gallery navigation.

The production interface must use the actual browser viewport.

### Shared sidebar navigation

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

The active route must have:

- violet icon and text treatment;
- subtle tinted background;
- left accent indicator.

### Shared topbar

Left:

- Breadcrumb: `Dashboard / Current page`

Right:

- Help button
- Notifications button
- Profile avatar
- Profile menu chevron

---

## 6. Overview Desktop

Route: `/`

Approved screenshot:

`design/approved-screens/desktop/01-overview-desktop.png`

### Page header

Title:

`Overview`

Description:

`Monitor recurring revenue, subscriptions and customer activity.`

Controls:

- Date range: `Jun 15 – Jul 14, 2026`
- Filters
- Export

### KPI cards

#### Monthly Recurring Revenue

- Current: `$84,720`
- Previous: `$78,140`
- Change: `+8.4%`
- Supporting text: `+$6,580 net increase`

#### Annual Recurring Revenue

- Current: `$1,016,640`
- Previous: `$937,680`
- Change: `+8.4%`
- Supporting text: `+$78,960 annualized`

Relationship:

`ARR = MRR × 12`

#### Active Subscriptions

- Current: `2,846`
- Previous: `2,705`
- Change: `+5.2%`
- Supporting text: `+141 net subscriptions`

#### Churn Rate

- Current: `3.84%`
- Previous: `4.27%`
- Change: `−0.43 percentage points`
- Supporting text: `104 subscriptions churned`

A reduction in churn is a positive improvement and must use positive status
styling.

### Revenue Overview

- Gross revenue: `$112,480`
- Previous period: `$102,630`
- Change: `+9.6%`
- Segmented control: `Revenue / MRR`

The `$112,480` value is gross revenue for the selected period. It is not MRR.

Chart:

- current period: solid violet line;
- previous period: muted dashed line;
- restrained violet area fill;
- tooltip with current value, previous value and period change;
- no excessive chart decoration.

### Customer Growth

- Total customer accounts: `3,214`
- Growth: `+9.8%`
- New subscriptions: `245`
- Churned: `104`
- Net growth: `+141`

Chart series:

- New subscriptions: violet
- Churned subscriptions: coral

### Subscriptions by Plan

| Plan | Price | Active | Share | MRR |
|---|---:|---:|---:|---:|
| Starter | $15 | 1,326 | 46.6% | $19,890 |
| Growth | $29 | 900 | 31.6% | $26,100 |
| Pro | $49 | 453 | 15.9% | $22,197 |
| Teams | $99 | 167 | 5.9% | $16,533 |
| Total | — | 2,846 | 100% | $84,720 |

Use a donut chart with `2,846 Active` in the center.

### Recent Transactions

| Customer | Plan | Date | Payment | Amount | Status |
|---|---|---|---|---:|---|
| Olivia Chen | Growth | Jul 14, 10:42 | Visa •4242 | $29.00 | Paid |
| Northstar Labs | Teams | Jul 14, 09:18 | Mastercard •1088 | $99.00 | Paid |
| Marco Ruiz | Starter | Jul 13, 17:05 | Visa •9031 | $15.00 | Refunded |
| Ava Thompson | Pro | Jul 13, 14:22 | Amex •0005 | $49.00 | Pending |
| Koto Studio | Teams | Jul 12, 16:41 | Visa •3320 | $99.00 | Failed |

Status must always be communicated through both text and color.

---

## 7. Analytics Desktop

Route: `/analytics`

Approved screenshot:

`design/approved-screens/desktop/02-analytics-desktop.png`

Purpose:

Provide deeper analysis of revenue, subscriptions, churn and plan performance.

### Page controls

- Date range
- Compare to previous period
- Filters
- Export report

### KPI cards

- MRR Growth: `+8.4%`
- Average Revenue per Account: `$29.77`
- Net Subscription Growth: `+141`
- Churn Rate: `3.84%`

ARPA relationship:

`$84,720 ÷ 2,846 = $29.77`

### Sections

#### Revenue and MRR Trends

Show:

- Gross Revenue: `$112,480`
- Previous Gross Revenue: `$102,630`
- Monthly Recurring Revenue: `$84,720`
- Previous MRR: `$78,140`

Include the `Revenue / MRR` segmented control.

#### Subscription Growth

- New: `245`
- Churned: `104`
- Net growth: `+141`

Use grouped bars for new and churned subscriptions.

#### Churn and Retention

- Current churn: `3.84%`
- Previous churn: `4.27%`
- Retained subscriptions: `2,601`
- Net revenue retention: `108.4%`

Lower churn should be communicated as an improvement.

#### Plan Performance

Use the same approved plan names, prices, counts, share and MRR values as the
Overview page.

Include:

- MRR contribution;
- churn;
- trend;
- export data action.

---

## 8. Customers Desktop

Route: `/customers`

Approved screenshot:

`design/approved-screens/desktop/03-customers-desktop.png`

Purpose:

Manage customer accounts, subscription status and recurring value.

### Page controls

- Search customers
- Filters
- Export CSV
- Add customer

### KPI cards

- Total Customers: `3,214`
- Active Subscribers: `2,846`
- Trial Accounts: `214`
- At-Risk Customers: `96`

At-risk supporting detail:

`payment or engagement risk`

Trend:

`12 fewer`

### Customer filters

The primary segment tabs are mutually exclusive subscription states:

- All — active by default
- Active
- Trial
- Past due
- Churned

`At risk` must not appear as a primary segment tab.

Use a separate secondary filter chip:

`At risk: 96`

At-risk is an additional condition and may overlap with another customer
status, including Active.

Summary values:

- Active: `2,846`
- Trial: `214`
- Past due: `63`
- Churned this period: `104`

### Customer table columns

- Customer
- Company
- Plan
- Monthly value
- Status
- Last activity
- Joined
- Row actions

Approved example rows:

| Customer | Company | Plan | Value | Status |
|---|---|---|---:|---|
| Olivia Chen | Northstar Studio | Growth | $29 | Active |
| Noah Williams | BrightLayer | Teams | $99 | Active |
| Ava Thompson | Pixel Harbor | Pro | $49 | Trial |
| Marco Ruiz | Verde Labs | Starter | $15 | Active |
| Maya Patel | Cloudnest | Growth | $29 | Active |
| Ethan Brooks | Fieldnote | Pro | $49 | Past due |
| Sophia Nguyen | Orbitstack | Teams | $99 | Active |
| Liam Carter | Linear Forge | Starter | $15 | Churned |

The selected table-row state must be available as a reusable component state.

Include pagination and rows-per-page control.

---

## 9. Subscriptions Desktop

Route: `/subscriptions`

Approved screenshot:

`design/approved-screens/desktop/04-subscriptions-desktop.png`

Purpose:

Monitor active plans, billing status and recurring subscription value.

### Page controls

- Date range
- Filters
- Export
- Add subscription

### KPI cards

- Active Subscriptions: `2,846`
- Monthly Recurring Revenue: `$84,720`
- Trialing: `214`
- Churn Rate: `3.84%`

### Plan Performance

Use the approved plan data:

| Plan | Price | Active | Share | MRR | Churn |
|---|---:|---:|---:|---:|---:|
| Starter | $15 | 1,326 | 46.6% | $19,890 | 4.5% |
| Growth | $29 | 900 | 31.6% | $26,100 | 3.6% |
| Pro | $49 | 453 | 15.9% | $22,197 | 2.9% |
| Teams | $99 | 167 | 5.9% | $16,533 | 2.1% |

### Subscription Status

The donut visualization represents current subscription states only:

- Active: `2,846`
- Trialing: `214`
- Past due: `63`
- Paused: `41`

Current subscription total:

`3,164`

Calculation:

`2,846 + 214 + 63 + 41 = 3,164`

Do not include historical churn as a donut segment.

Display historical churn separately:

- Churned during selected period: `104`
- Churn rate: `3.84%`

### All Subscriptions table

Columns:

- Customer
- Plan
- Status
- Billing cycle
- Started
- Next billing
- Amount
- Row actions

Supported visible statuses:

- Active
- Trialing
- Past due
- Paused
- Canceled

Include:

- Search subscriptions
- All plans filter
- All statuses filter
- Pagination
- Rows-per-page control
- Selected row state

---

## 10. Settings Desktop

Route: `/settings`

Approved screenshot:

`design/approved-screens/desktop/05-settings-desktop.png`

Purpose:

Manage workspace preferences, reporting defaults and notifications.

### Page actions

- Discard changes
- Save changes

### Tabs

- General
- Reporting
- Notifications
- Billing
- Integrations

Only the General tab needs to be fully represented in this demo.

### Workspace Profile

Fields:

- Workspace logo
- Workspace name
- Workspace ID or slug
- Company name
- Workspace owner
- Support email

### Regional Preferences

Fields:

- Time zone
- Currency
- Language
- Date format
- Week starts on

Include an informational message explaining that changing the time zone affects
report grouping and display only.

### Reporting Defaults

Controls:

- Default reporting period
- Compare with previous period
- Default revenue view
- Default chart granularity
- Include trial accounts in customer totals

### Notifications

Toggles:

- Weekly performance summary
- Churn alerts
- Failed payment alerts
- Trial expiration reminders
- Large MRR change alerts

### Data and Privacy

Actions:

- Export workspace data
- Download customer data

Display:

- Data retention: `24 months`
- Last successful data sync: `Jul 14, 2026 at 10:42`

### Danger Zone

Action:

- Delete workspace

Use restrained destructive styling and require confirmation in an eventual
interactive implementation.

---

## 11. Mobile Overview

Route: `/` on mobile

Approved screenshot:

`design/approved-screens/mobile/06-overview-mobile-full.png`

Reference width:

`390px`

Layout:

- Content padding: `16px`
- Grid: `4 columns`
- Gutter: `12px`
- Top app bar: approximately `64px`
- Minimum tap target: `44px`

Order:

1. Mobile app bar
2. Page title and description
3. Date range
4. KPI cards in a `2 × 2` grid
5. Revenue Overview
6. Customer Growth
7. Subscriptions by Plan
8. Recent Transactions

Mobile charts must be simplified without losing their meaning.

The desktop transaction table becomes stacked mobile transaction rows.

Payment method can be hidden in the collapsed mobile transaction view.

---

## 12. Mobile Navigation Drawer

Approved screenshot:

`design/approved-screens/mobile/07-mobile-navigation-drawer.png`

Drawer width:

approximately `304px`

Include:

- Subtera brand;
- close button;
- workspace switcher;
- workspace search;
- Overview;
- Analytics;
- Customers;
- Subscriptions;
- Settings;
- profile row.

The drawer overlays the current page and must have an accessible backdrop and
focus behavior in implementation.

---

## 13. Mini UI Kit

Approved screenshot:

`design/approved-screens/system/08-mini-ui-kit.png`

The UI Kit is the visual reference for reusable components and foundations.

Required shared components:

- Button
- Icon Button
- Search Input
- Text Input
- Select
- Date Range Select
- Workspace Switcher
- Navigation Item
- Profile Row
- Tabs
- Segmented Control
- Toggle
- Trend Badge
- Status Badge
- KPI Card
- Analytics Card
- Plan Row
- Desktop Transaction Row
- Mobile Transaction Row
- Table Header
- Selected Table Row
- Pagination
- Informational Message
- Form Field

Build shared components centrally. Do not reproduce separate versions inside
each page unless the component meaningfully differs.

---

## 14. Visual foundations

### Colors

- Canvas: `#08090E`
- Sidebar: `#0B0C12`
- Card: `#11121A`
- Raised surface: `#151722`
- Border: `#262938`
- Primary text: `#F5F3FF`
- Secondary text: `#A7A7B5`
- Muted text: `#6F7280`
- Primary violet: `#7C5CFF`
- Lavender: `#B49CFF`
- Supporting blue: `#5C7CFA`
- Success: `#3DDC97`
- Warning: `#F5B942`
- Error: `#FF6B81`
- Information: `#56B4FF`

### Typography

Typeface: `Manrope`

- Page title: `28/36`, weight `700`
- Section heading: `18/26`, weight `650–700`
- KPI value: `30/38`, weight `700`
- Card title: `15/22`, weight `600`
- Body: `14/22`, weight `400`
- UI label: `13/20`, weight `500–600`
- Caption and table text: `12–13/20`, weight `500`

Use tabular numerals for metrics when available.

### Spacing

Base scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48`

Defaults:

- Desktop card padding: `24px`
- Mobile card padding: `16px`
- Card gap: `20px`
- Label-to-value gap: `8px`
- Section title-to-content gap: `20–24px`

### Radius

- Main cards: `16px`
- Buttons and inputs: `12px`
- Navigation items: `10px`
- Small internal surfaces: `8px`
- Badges: `999px`

### Effects

Use glow only for:

- active navigation item;
- selected or highlighted KPI card;
- important chart point or chart line.

Do not apply glow to every card.

---

## 15. Implementation principles

- Use reusable React components.
- Use centralized design tokens.
- Use semantic HTML.
- Use TypeScript.
- Preserve keyboard accessibility.
- Ensure sufficient text contrast.
- Use text plus color for all statuses.
- Use responsive CSS layouts rather than scaled desktop canvases.
- Keep mock data centralized.
- Avoid duplicated page-specific styles.
- Treat the exported Work prototype as a visual and content reference only.
