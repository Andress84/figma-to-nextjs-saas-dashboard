# Subtera Content and Data

## Purpose

This document defines the approved product copy, fictional data and
consistency rules for the Subtera demo implementation.

The data is fictional and exists only for the portfolio project.

All routes must use the same shared source of truth.

Do not create conflicting values inside separate page components.

---

## 1. Product identity

Product name:

Subtera

Product type:

Subscription analytics SaaS dashboard

Workspace:

Acme Cloud

Primary user:

Maya Chen

User role:

Workspace Admin

Product tone:

- professional;
- concise;
- calm;
- data-focused;
- suitable for a B2B SaaS product;
- no gaming, crypto or science-fiction terminology.

---

## 2. Product routes

| Route | Page title |
|---|---|
| `/` | Overview |
| `/analytics` | Analytics |
| `/customers` | Customers |
| `/subscriptions` | Subscriptions |
| `/settings` | Settings |

The Portfolio Cover, Mini UI Kit and prototype view switcher are
presentation assets.

They are not product routes.

---

## 3. Global navigation copy

Desktop and mobile navigation items:

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

Workspace switcher:

- Label: Workspace
- Workspace name: Acme Cloud

Sidebar search:

- Placeholder: Search
- Keyboard hint: Command or Control + K

Mobile drawer search:

- Placeholder: Search workspace

Profile row:

- Name: Maya Chen
- Role: Workspace Admin

---

## 4. Breadcrumbs

Use the following breadcrumb labels:

| Route | Breadcrumb |
|---|---|
| `/` | Dashboard / Overview |
| `/analytics` | Dashboard / Analytics |
| `/customers` | Dashboard / Customers |
| `/subscriptions` | Dashboard / Subscriptions |
| `/settings` | Dashboard / Settings |

The first breadcrumb item may be styled as the stronger label.

---

## 5. Page headings and descriptions

### Overview

Title:

Overview

Description:

Monitor recurring revenue, subscriptions and customer activity.

### Analytics

Title:

Analytics

Description:

Explore revenue, subscription growth and customer retention trends.

### Customers

Title:

Customers

Description:

Manage customer accounts, subscription status and recurring value.

### Subscriptions

Title:

Subscriptions

Description:

Monitor active plans, billing status and recurring subscription value.

### Settings

Title:

Settings

Description:

Manage workspace preferences, reporting defaults and notifications.

---

## 6. Global reporting period

Approved global period:

Jun 15 – Jul 14, 2026

Use the same selected period on Overview, Analytics and Subscriptions.

Recommended implementation value:

`2026-06-15` through `2026-07-14`

Display format:

Jun 15 – Jul 14, 2026

This is fictional demo data.

Do not replace it with the current system date.

---

## 7. Primary subscription metrics

Approved values:

| Metric | Current | Previous | Change | Supporting detail |
|---|---:|---:|---:|---|
| Monthly Recurring Revenue | $84,720 | $78,140 | +8.4% | +$6,580 net increase |
| Annual Recurring Revenue | $1,016,640 | $937,680 | +8.4% | +$78,960 annualized |
| Active Subscriptions | 2,846 | 2,705 | +5.2% | +141 net subscriptions |
| Churn Rate | 3.84% | 4.27% | -0.43 pp | 104 subscriptions churned |

Important semantic rule:

A lower churn rate is an improvement.

The `-0.43 pp` churn change must use the positive or improvement visual
treatment.

---

## 8. Metric relationships

The following relationships must remain true across all routes.

### ARR

ARR equals MRR multiplied by 12.

`$84,720 × 12 = $1,016,640`

Previous ARR:

`$78,140 × 12 = $937,680`

### Active subscriptions

Starting subscriptions:

2,705

New paid subscriptions:

245

Churned subscriptions:

104

Ending active subscriptions:

`2,705 + 245 - 104 = 2,846`

### Net subscription growth

`245 - 104 = 141`

### Churn rate

`104 / 2,705 = 3.84%`

### Average revenue per active account

`$84,720 / 2,846 = $29.77`

Use `$29.77` as the approved ARPA value.

---

## 9. Plan definitions

These plan definitions are global and must be shared across all routes.

| Plan | Monthly price | Annual price |
|---|---:|---:|
| Starter | $15 | $180 |
| Growth | $29 | $348 |
| Pro | $49 | $588 |
| Teams | $99 | $1,188 |

Do not define different plan prices inside separate page files.

---

## 10. Plan performance data

Approved active subscriber and MRR data:

| Plan | Price | Active | Share | MRR | Churn | Trend |
|---|---:|---:|---:|---:|---:|---:|
| Starter | $15 | 1,326 | 46.6% | $19,890 | 4.5% | +4.0% |
| Growth | $29 | 900 | 31.6% | $26,100 | 3.6% | +7.0% |
| Pro | $49 | 453 | 15.9% | $22,197 | 2.9% | +11.0% |
| Teams | $99 | 167 | 5.9% | $16,533 | 2.1% | +12.0% |
| Total | — | 2,846 | 100% | $84,720 | 3.84% | +8.4% |

Validation:

- active counts total `2,846`;
- subscriber share totals `100%`;
- plan MRR totals `$84,720`;
- each plan MRR equals active subscriptions multiplied by monthly price.

---

## 11. Overview data

### KPI cards

Use the four primary subscription metrics:

- Monthly Recurring Revenue
- Annual Recurring Revenue
- Active Subscriptions
- Churn Rate

### Revenue Overview

Title:

Revenue Overview

Description:

Gross revenue for the selected period

Current gross revenue:

$112,480

Previous-period gross revenue:

$102,630

Change:

+9.6%

Segmented control:

- Revenue
- MRR

Default selected segment:

Revenue

Important distinction:

`$112,480` is gross revenue for the selected reporting period.

It is not Monthly Recurring Revenue.

### Revenue chart data

| Period | Current | Previous |
|---|---:|---:|
| Jun 15–21 | $24,860 | $22,940 |
| Jun 22–28 | $26,430 | $24,310 |
| Jun 29–Jul 5 | $28,190 | $25,610 |
| Jul 6–12 | $27,740 | $25,110 |
| Jul 13–14 | $5,260 | $4,660 |
| Total | $112,480 | $102,630 |

Tooltip example:

- Period: Jul 6 – Jul 12
- Current period: $107,220 cumulative
- Previous period: $97,970 cumulative
- Change: +9.4%

The chart may use cumulative values visually, provided the final total
remains `$112,480` and the previous total remains `$102,630`.

### Customer Growth

Title:

Customer Growth

Description:

New paid subscriptions and churn

Total customer accounts:

3,214

Previous customer total:

2,926

New customer accounts:

288

Customer-account growth:

+9.8%

New paid subscriptions:

245

Churned subscriptions:

104

Net subscription growth:

+141

Weekly data:

| Period | New accounts | New subscriptions | Churned | Net subscriptions |
|---|---:|---:|---:|---:|
| Jun 15–21 | 62 | 53 | 24 | +29 |
| Jun 22–28 | 68 | 58 | 28 | +30 |
| Jun 29–Jul 5 | 74 | 61 | 25 | +36 |
| Jul 6–14 | 84 | 73 | 27 | +46 |
| Total | 288 | 245 | 104 | +141 |

Chart series:

- New subscriptions
- Churned

Summary labels:

- New
- Churned
- Net growth

### Subscriptions by Plan

Title:

Subscriptions by Plan

Description:

Active subscriptions and monthly value

Donut centre:

- Value: 2,846
- Label: Active

Use the approved plan-performance data.

Action:

View details

### Recent Transactions

Title:

Recent Transactions

Description:

Latest subscription payments

Action:

View all

Approved transaction rows:

| Customer | Plan | Date | Payment | Amount | Status |
|---|---|---|---|---:|---|
| Olivia Chen | Growth | Jul 14, 10:42 | Visa •4242 | $29.00 | Paid |
| Northstar Labs | Teams | Jul 14, 09:18 | Mastercard •1088 | $99.00 | Paid |
| Marco Ruiz | Starter | Jul 13, 17:05 | Visa •9031 | $15.00 | Refunded |
| Ava Thompson | Pro | Jul 13, 14:22 | Amex •0005 | $49.00 | Pending |
| Koto Studio | Teams | Jul 12, 16:41 | Visa •3320 | $99.00 | Failed |

Mobile transaction rows omit the Payment column.

---

## 12. Analytics data

### Header controls

Use:

- date range;
- Compare to previous period;
- Filters;
- Export report.

### KPI cards

#### MRR Growth

Value:

+8.4%

Comparison:

vs +6.1%

Supporting detail:

+$6,580 net MRR increase

#### Average Revenue per Account

Value:

$29.77

Trend:

+2.1%

Supporting detail:

$84,720 / 2,846 active

#### Net Subscription Growth

Value:

+141

Supporting values:

- 245 new
- 104 churned subscriptions

#### Churn Rate

Value:

3.84%

Change:

-0.43 pp

Previous period:

4.27%

### Revenue and MRR Trends

Title:

Revenue and MRR Trends

Description:

Current performance compared with the previous period

Gross revenue:

$112,480

Previous gross revenue:

$102,630

Monthly recurring revenue:

$84,720

Previous MRR:

$78,140

Use the approved Revenue Overview chart data.

### Subscription Growth

Title:

Subscription Growth

Description:

New and churned subscriptions by week

Summary:

- New: 245
- Churned: 104
- Net growth: +141

Use the weekly subscription data from the Overview Customer Growth
section.

### Churn and Retention

Title:

Churn and Retention

Description:

Subscription retention quality over time

Current churn rate:

3.84%

Previous churn rate:

4.27%

Retained subscriptions:

2,601

Net revenue retention:

108.4%

Helper message:

Lower churn indicates improved retention for this period.

### Plan Performance

Use the global Plan Performance data.

Action:

Export data

---

## 13. Customer summary data

### KPI cards

| Metric | Value | Supporting detail |
|---|---:|---|
| Total Customers | 3,214 | +288 new accounts |
| Active Subscribers | 2,846 | 88.6% of customer accounts |
| Trial Accounts | 214 | 86 ending this week |
| At-Risk Customers | 96 | payment or engagement risk |

Approved trends:

- Total Customers: +9.8%
- Active Subscribers: +5.2%
- Trial Accounts: 86 ending
- At-Risk Customers: 12 fewer

At risk is an overlapping condition.

It is not a mutually exclusive lifecycle status.

A customer may be Active and also At risk.

---

## 14. Customer filters

Primary lifecycle tabs:

- All
- Active
- Trial
- Past due
- Churned

Separate overlapping filter:

- At risk: 96

Summary counts:

| Filter | Count |
|---|---:|
| Active | 2,846 |
| Trial | 214 |
| Past due | 63 |
| Churned this period | 104 |
| At risk | 96 |

Do not add At risk as a mutually exclusive lifecycle tab.

---

## 15. Customer table data

Table title:

Customer accounts

Description:

Subscription status, recurring value and recent activity

Header controls:

- Search customers
- Filters
- Export CSV
- Add customer
- Refresh

Approved rows:

| Customer | Company | Plan | Monthly Value | Status | Last Activity | Joined |
|---|---|---|---:|---|---|---|
| Olivia Chen | Northstar Studio | Growth | $29 | Active | 12 min ago | May 18, 2026 |
| Noah Williams | BrightLayer | Teams | $99 | Active | 34 min ago | Apr 02, 2026 |
| Ava Thompson | Pixel Harbor | Pro | $49 | Trial | 1 hr ago | Jul 08, 2026 |
| Marco Ruiz | Verde Labs | Starter | $15 | Active | 6 hrs ago | Mar 21, 2026 |
| Maya Patel | Cloudnest | Growth | $29 | Active | Yesterday | Feb 14, 2026 |
| Ethan Brooks | Fieldnote | Pro | $49 | Past due | 2 days ago | Jan 29, 2026 |
| Sophia Nguyen | Orbitstack | Teams | $99 | Active | 3 days ago | Dec 11, 2025 |
| Liam Carter | Linear Forge | Starter | $15 | Churned | 8 days ago | Nov 06, 2025 |

Marco Ruiz may appear as a selected row in the visual concept.

His lifecycle status remains Active.

An optional separate at-risk flag may be associated with him.

Pagination copy:

Showing 1–8 of 3,214 customers

Rows per page:

8

---

## 16. Subscription summary data

### KPI cards

| Metric | Value | Supporting detail |
|---|---:|---|
| Active Subscriptions | 2,846 | +141 net subscriptions |
| Monthly Recurring Revenue | $84,720 | +$6,580 net increase |
| Trialing | 214 | 86 ending this week |
| Churn Rate | 3.84% | 104 churned subscriptions |

Approved trends:

- Active Subscriptions: +5.2%
- MRR: +8.4%
- Trialing: 86 ending
- Churn Rate: -0.43 pp improvement

---

## 17. Subscription status data

The current-state Subscription Status donut contains:

| Status | Count |
|---|---:|
| Active | 2,846 |
| Trialing | 214 |
| Past due | 63 |
| Paused | 41 |
| Current subscription records | 3,164 |

Validation:

`2,846 + 214 + 63 + 41 = 3,164`

Historical period metrics shown outside the donut:

- Churned during selected period: 104
- Churn rate: 3.84%

Do not include Churned in the current-state donut.

Do not use `2,846` as the centre total for the status donut.

The correct current-state centre total is `3,164`.

---

## 18. Subscription table data

Table title:

All Subscriptions

Description:

Plan, billing cycle and subscription lifecycle status

Header controls:

- Search subscriptions
- All plans
- All statuses

Approved rows:

| Customer | Plan | Status | Billing Cycle | Started | Next Billing | Amount |
|---|---|---|---|---|---|---|
| Olivia Chen | Growth | Active | Monthly | May 18, 2026 | Jul 18, 2026 | $29 per month |
| Noah Williams | Teams | Active | Annual | Apr 02, 2026 | Apr 02, 2027 | $1,188 per year |
| Ava Thompson | Pro | Trialing | Monthly | Jul 08, 2026 | Jul 22, 2026 | $49 after trial |
| Marco Ruiz | Starter | Past due | Monthly | Mar 21, 2026 | Jul 21, 2026 | $15 per month |
| Maya Patel | Growth | Active | Annual | Feb 14, 2026 | Feb 14, 2027 | $348 per year |
| Ethan Brooks | Pro | Paused | Monthly | Jan 29, 2026 | Paused | $49 per month |
| Sophia Nguyen | Teams | Active | Monthly | Dec 11, 2025 | Aug 11, 2026 | $99 per month |
| Liam Carter | Starter | Canceled | Monthly | Nov 06, 2025 | — | $15 former monthly |

Pagination copy:

Showing 1–8 of 3,268 subscription records

Rows per page:

8

The subscription-record total differs from the current-state donut
because the paginated table may include historical canceled records.

---

## 19. Settings content

### Header actions

- Discard changes
- Save changes

### Settings tabs

- General
- Reporting
- Notifications
- Billing
- Integrations

Only General content is required for the approved concept.

The remaining tabs may remain visual or static.

---

## 20. Workspace Profile

Section title:

Workspace Profile

Description:

Identity and contact information used across Subtera.

Fields:

| Field | Value |
|---|---|
| Workspace logo | A |
| Workspace name | Acme Cloud |
| Workspace ID or slug | acme-cloud |
| Company name | Acme Cloud Inc. |
| Workspace owner | Maya Chen |
| Support email | support@acmecloud.io |

Workspace owner may be displayed as read-only.

Action:

Change logo

Logo helper copy:

SVG, PNG or JPG · Recommended 256 × 256 px

---

## 21. Regional Preferences

Section title:

Regional Preferences

Description:

Formatting defaults for workspace reports and tables.

Fields:

| Field | Value |
|---|---|
| Time zone | Europe/Berlin |
| Currency | USD – US Dollar |
| Language | English |
| Date format | MM/DD/YYYY |
| Week starts on | Monday |

Informational message:

Changing the time zone updates report grouping and display only. Stored
transaction timestamps remain unchanged.

---

## 22. Reporting Defaults

Section title:

Reporting Defaults

Description:

Starting state for analytics and exported reports.

Fields and states:

| Setting | Value |
|---|---|
| Default reporting period | Last 30 days |
| Compare with previous period | Enabled |
| Default revenue view | Gross Revenue |
| Default chart granularity | Weekly |
| Include trial accounts in customer totals | Enabled |

---

## 23. Notifications

Section title:

Notifications

Description:

Choose which workspace events generate alerts.

Settings:

| Notification | State |
|---|---|
| Weekly performance summary | Enabled |
| Churn alerts | Enabled |
| Failed payment alerts | Enabled |
| Trial expiration reminders | Enabled |
| Large MRR change alerts | Disabled |

Supporting copy may remain concise and secondary.

---

## 24. Data and Privacy

Section title:

Data and Privacy

Description:

Workspace exports, retention and synchronization status.

Actions:

- Export workspace data
- Download customer data

Data retention:

24 months

Last successful data sync:

Jul 14, 2026 at 10:42

---

## 25. Danger Zone

Section title:

Danger Zone

Description:

Permanent workspace actions require additional confirmation.

Action:

Delete workspace

Warning copy:

Deleting this workspace removes its reporting configuration and
disconnects all linked customer data. This action cannot be undone.

The action is visual only in this demo.

Do not implement real destructive behaviour.

---

## 26. Status labels and semantic colours

### Customer statuses

- Active
- Trial
- Past due
- Churned

### Subscription statuses

- Active
- Trialing
- Past due
- Paused
- Canceled

### Transaction statuses

- Paid
- Pending
- Refunded
- Failed

Recommended semantic mapping:

| Status | Semantic treatment |
|---|---|
| Active | Success |
| Trial | Information |
| Trialing | Information |
| Paid | Success |
| Pending | Warning |
| Past due | Error |
| Failed | Error |
| Refunded | Information |
| Paused | Information or neutral |
| Churned | Neutral |
| Canceled | Neutral |

Always display readable status text.

Do not communicate status with colour alone.

---

## 27. Number formatting

Use US English number formatting.

### Currency

Large KPI values:

- `$84,720`
- `$1,016,640`
- `$112,480`

Transaction amounts:

- `$29.00`
- `$99.00`
- `$15.00`

Plan prices:

- `$15`
- `$29`
- `$49`
- `$99`

### Percentages

Use one decimal where the approved value uses one decimal:

- `+8.4%`
- `+9.6%`
- `46.6%`

Use two decimals for churn:

- `3.84%`
- `4.27%`

Percentage-point changes:

- `-0.43 pp`

### Counts

Use thousands separators:

- `2,846`
- `3,214`
- `3,164`

### Dates

Global date range:

Jun 15 – Jul 14, 2026

Table timestamp:

Jul 14, 10:42

Full date:

May 18, 2026

---

## 28. Product actions

The following controls may be implemented as visual or local-state
interactions only:

- Filters;
- Export;
- Export report;
- Export CSV;
- Export data;
- Add customer;
- Add subscription;
- Compare to previous period;
- View all;
- View details;
- Manage plans;
- Refresh;
- Change logo;
- Save changes;
- Discard changes;
- Delete workspace.

No backend, database, authentication or real export is required.

Buttons should still provide appropriate visible interaction states.

---

## 29. Source-of-truth recommendation

Store repeated content and data in shared typed files.

Possible structure:

```text
src/data/
├── navigation.ts
├── plans.ts
├── metrics.ts
├── revenue.ts
├── customers.ts
├── subscriptions.ts
├── transactions.ts
└── settings.ts
```

The exact structure may follow the existing project conventions.

Important requirement:

Repeated values must come from shared data rather than being manually
retyped across routes.

Examples:

- plan prices;
- plan MRR;
- customer names;
- subscription statuses;
- MRR;
- ARR;
- active subscription count;
- churn rate;
- reporting period.

---

## 30. Data consistency checklist

Before final visual QA, verify that:

- MRR is `$84,720` everywhere;
- ARR is `$1,016,640` everywhere;
- active subscriptions are `2,846` everywhere;
- churn rate is `3.84%` everywhere;
- previous churn is `4.27%`;
- net subscription growth is `+141`;
- new subscriptions are `245`;
- churned subscriptions are `104`;
- total customer accounts are `3,214`;
- ARPA is `$29.77`;
- gross revenue is `$112,480`;
- previous gross revenue is `$102,630`;
- plan MRR totals `$84,720`;
- plan active counts total `2,846`;
- current subscription statuses total `3,164`;
- historical churn is not included in the status donut;
- transaction amounts match plan prices;
- annual plan prices equal monthly price multiplied by 12;
- At risk remains separate from customer lifecycle status;
- all dates use the approved fictional 2026 period;
- presentation assets do not appear inside product routes.

The implementation must prioritize coherent product data over decorative
variation.
