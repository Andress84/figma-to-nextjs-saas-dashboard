# Subtera Visual QA Checklist

## Purpose

Use this checklist before considering the Subtera demo implementation
visually complete.

The goal is to verify that the coded interface matches the approved
visual prototype, remains internally consistent and behaves like a real
responsive SaaS product.

This checklist focuses on visual quality, layout, responsive behaviour,
content consistency and reusable component implementation.

---

## 1. Product shell

Verify that:

- the application uses the real browser viewport;
- the desktop sidebar is exactly `248px` wide;
- the main content area uses the remaining viewport width;
- the desktop topbar is approximately `72px` high;
- the mobile app bar is approximately `64px` high;
- the application fills the viewport without presentation margins;
- the ChatGPT Sites view switcher is not included;
- the Portfolio Cover is not implemented inside the Next.js dashboard;
- no page uses `transform: scale()`;
- no page is rendered inside an artificial fixed canvas;
- the shell remains consistent across all routes;
- the active sidebar item changes correctly for every route;
- the user profile row remains visually consistent;
- the workspace switcher remains consistent;
- the sidebar search remains consistent.

Approved routes:

- `/`
- `/analytics`
- `/customers`
- `/subscriptions`
- `/settings`

The Portfolio Cover is a presentation asset only. It is not a product route,
part of the application shell, an application screen or a required
product-screen visual parity target.

---

## 2. Global visual direction

Verify that the interface feels:

- premium;
- calm;
- professional;
- suitable for a B2B SaaS product;
- dark but readable;
- data-focused;
- visually related to the approved Subtera concept.

Avoid:

- gaming UI styling;
- crypto-dashboard styling;
- excessive neon;
- excessive glow;
- excessive glassmorphism;
- decorative effects that compete with data;
- bright gradients on every card;
- heavy shadows around every element;
- overly playful rounded shapes;
- inconsistent surface colours.

The intended balance is approximately:

- 90% neutral dark interface;
- 10% controlled violet accent.

---

## 3. Design tokens

### Colours

Verify the implementation uses the approved colour system.

| Token | Value |
|---|---|
| Canvas | `#08090E` |
| Sidebar | `#0B0C12` |
| Card | `#11121A` |
| Raised surface | `#151722` |
| Border | `#262938` |
| Primary text | `#F5F3FF` |
| Secondary text | `#A7A7B5` |
| Muted text | `#6F7280` |
| Primary violet | `#7C5CFF` |
| Lavender | `#B49CFF` |
| Success | `#3DDC97` |
| Warning | `#F5B942` |
| Error | `#FF6B81` |
| Information | `#56B4FF` |

Check that:

- canvas and sidebar are visually distinguishable;
- cards remain distinguishable from the canvas;
- borders are visible but subtle;
- primary text has strong contrast;
- secondary text remains readable;
- muted text is not too faint;
- violet is reserved for active and highlighted states;
- status colours remain readable on dark backgrounds;
- colour is not the only way status is communicated.

### Radius

Verify:

- main cards use approximately `16px`;
- controls use approximately `12px`;
- navigation items use approximately `10px`;
- badges use pill radius;
- radii remain consistent across all routes.

### Spacing

Verify the spacing scale is based on:

- `4`
- `8`
- `12`
- `16`
- `20`
- `24`
- `32`
- `40`
- `48`

Check that custom one-off spacing values are not used without a clear
reason.

---

## 4. Typography

Primary font:

Manrope

Verify that:

- Manrope loads correctly;
- fallback fonts do not unexpectedly change layout;
- metric values use tabular numerals where possible;
- text hierarchy remains consistent across all pages;
- text does not appear too small at 100% browser zoom;
- line heights match the approved system;
- headings do not wrap unnecessarily;
- labels remain readable;
- table text remains readable;
- muted captions are not too faint.

Approved typography:

| Style | Size | Line height | Weight |
|---|---:|---:|---:|
| Page title | 28px | 36px | 700 |
| Section heading | 18px | 26px | 700 |
| KPI value | 30px | 38px | 700 |
| Large analytics value | 28px | 36px | 700 |
| Card title | 15px | 22px | 600 |
| Body | 14px | 22px | 400 |
| UI label | 13px | 20px | 500–600 |
| Table text | 13px | 20px | 500 |
| Caption | 12px | 16–20px | 500 |
| Overline | 10–11px | 16px | 600 |

---

## 5. Shared components

Verify that the following are implemented as reusable components rather
than duplicated route-specific markup.

### Layout

- AppShell
- Sidebar
- SidebarNavigation
- Topbar
- PageHeader
- MobileDrawer

### UI

- Button
- IconButton
- Input
- Select
- Tabs
- SegmentedControl
- Badge
- Avatar
- Toggle
- Card
- Tooltip
- Pagination

### Product components

- MetricCard
- ChartCard
- RevenueChart
- CustomerGrowthChart
- DonutChart
- DataTable
- CustomerTable
- SubscriptionTable
- PlanPerformanceTable
- StatusBadge
- TrendBadge
- SettingsSection
- FormField
- DangerZone

Check that:

- the same component looks identical on every route;
- shared padding and radius come from tokens;
- state styles are shared;
- active, hover, focus and disabled states are consistent;
- layout fixes can be applied globally;
- no route contains its own copied version of a shared component.

---

## 6. Buttons and controls

Verify all buttons have:

- default state;
- hover state;
- pressed state;
- keyboard focus state;
- disabled state where relevant;
- readable labels;
- consistent height;
- consistent horizontal padding;
- correct icon alignment;
- correct icon-to-label spacing.

Check that:

- primary buttons use violet appropriately;
- secondary buttons remain visible;
- ghost buttons remain readable;
- destructive buttons use error styling;
- icon-only buttons have accessible labels;
- control heights are consistent;
- controls do not shrink below usable touch sizes on mobile;
- adjacent buttons do not visually merge;
- dropdown arrows are aligned consistently.

---

## 7. Focus and accessibility states

Verify that:

- every interactive control has a visible keyboard focus indicator;
- focus outlines are not removed without replacement;
- focus treatment is visible on dark surfaces;
- the focus colour is consistent;
- keyboard navigation follows a logical order;
- the mobile drawer traps focus while open;
- closing the drawer restores focus to the menu button;
- colour is never the only indicator of status;
- icon-only buttons include accessible names;
- form controls have visible labels;
- status badges include readable text.

---

## 8. Sidebar

Verify desktop sidebar:

- width is `248px`;
- background matches the approved sidebar colour;
- logo alignment is consistent;
- workspace switcher width is consistent;
- search input width is consistent;
- navigation spacing is consistent;
- active item uses violet accent;
- active item has subtle background treatment;
- inactive items remain readable;
- icons align consistently;
- profile row stays near the bottom where practical;
- no item jumps horizontally between routes.

Verify navigation labels:

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

Do not include:

- Revenue;
- Transactions;
- Plans;
- Integrations;
- Support;
- Help Center;
- any additional unapproved sidebar item.

---

## 9. Topbar

Verify that:

- breadcrumb is positioned on the left;
- utility actions are positioned on the right;
- topbar height remains consistent;
- border separation is subtle;
- help icon matches the design;
- notification icon includes the small unread dot;
- avatar and profile chevron align correctly;
- no page title is duplicated inside the topbar;
- the topbar remains consistent across all product routes;
- the topbar does not contain the prototype view switcher.

Approved breadcrumbs:

- Dashboard / Overview
- Dashboard / Analytics
- Dashboard / Customers
- Dashboard / Subscriptions
- Dashboard / Settings

---

## 10. Page headers

Verify each page header contains:

- correct title;
- correct supporting text;
- correct page-specific actions;
- consistent vertical spacing;
- consistent alignment;
- correct responsive wrapping.

Check that page titles are:

- Overview
- Analytics
- Customers
- Subscriptions
- Settings

Check that page descriptions match the approved copy.

Verify that action groups:

- do not overflow;
- remain aligned;
- wrap predictably;
- remain usable on compact desktop;
- stack logically on mobile.

---

## 11. Cards

Verify that:

- card background is consistent;
- card border is consistent;
- card radius is consistent;
- card padding is consistent;
- card titles align consistently;
- card action buttons align consistently;
- card content does not touch borders;
- internal separators use consistent colour;
- card shadows remain subtle;
- glow is not applied to every card;
- highlighted cards remain clearly but subtly highlighted.

Approved highlighted areas:

- active navigation item;
- selected MRR card;
- main chart highlight.

---

## 12. KPI cards

Verify each KPI card includes:

- metric label;
- contextual icon;
- large metric value;
- trend badge;
- supporting detail;
- compact sparkline where approved.

Check that:

- all four cards have equal height;
- all four cards have equal width at desktop;
- metric values align visually;
- labels wrap cleanly;
- supporting text does not overlap sparklines;
- positive and improvement trends are styled correctly;
- churn reduction uses positive styling;
- highlighted MRR card uses subtle violet treatment;
- all values match the approved data source.

Approved Overview KPIs:

- Monthly Recurring Revenue: `$84,720`
- Annual Recurring Revenue: `$1,016,640`
- Active Subscriptions: `2,846`
- Churn Rate: `3.84%`

---

## 13. Charts

Verify that all charts:

- are rendered as real responsive chart components;
- are not screenshots;
- fit their containers;
- do not overflow;
- use approved colours;
- use consistent grid lines;
- use readable axis labels;
- use readable legends;
- use readable tooltips;
- keep tooltips inside the viewport;
- preserve data meaning at smaller widths.

### Revenue chart

Verify:

- current period uses violet;
- previous period uses muted dashed line;
- area fill remains subtle;
- no excessive glow is used;
- segmented control works visually;
- tooltip matches the design;
- total values remain coherent.

### Customer Growth chart

Verify:

- new subscriptions use violet;
- churned subscriptions use coral or error-related accent;
- both series remain distinguishable;
- summary values appear beneath the chart;
- labels remain readable.

### Donut charts

Verify:

- segments match approved data;
- centre values are correct;
- labels are readable;
- legends align correctly;
- segment colours remain distinct;
- no segment is too similar to the canvas;
- donut does not distort at responsive sizes.

Subscription Status centre total must be:

`3,164`

Subscriptions by Plan centre total must be:

`2,846`

---

## 14. Tables

Verify that:

- table headers align with body columns;
- rows have consistent height;
- row dividers are consistent;
- values align correctly;
- status badges remain readable;
- avatars align consistently;
- selected row treatment is subtle;
- pagination aligns correctly;
- rows-per-page control aligns correctly;
- long values do not overlap;
- table actions remain reachable;
- horizontal scrolling works on smaller screens.

Do not reduce text until it becomes unreadable.

Use horizontal scrolling where necessary.

---

## 15. Overview page

Verify route:

`/`

Check structure:

1. Sidebar and topbar
2. Page header
3. Four KPI cards
4. Revenue Overview
5. Customer Growth
6. Subscriptions by Plan
7. Recent Transactions

Verify:

- Revenue Overview occupies the larger desktop column;
- Customer Growth occupies the smaller desktop column;
- Subscriptions by Plan occupies the smaller lower column;
- Recent Transactions occupies the larger lower column;
- all sections use approved data;
- gross revenue is `$112,480`;
- previous gross revenue is `$102,630`;
- customer accounts are `3,214`;
- net growth is `+141`;
- recent transaction amounts match plan prices.

---

## 16. Analytics page

Verify route:

`/analytics`

Check structure:

1. Header actions
2. Four KPI cards
3. Revenue and MRR Trends
4. Subscription Growth
5. Churn and Retention
6. Plan Performance

Verify:

- active sidebar item is Analytics;
- page header controls match the approved concept;
- Revenue and MRR Trends is the dominant card;
- Subscription Growth remains readable;
- Churn and Retention uses improvement styling;
- Plan Performance data matches shared plan data;
- Average Revenue per Account is `$29.77`;
- Net Subscription Growth is `+141`;
- Churn Rate is `3.84%`.

---

## 17. Customers page

Verify route:

`/customers`

Check structure:

1. Header controls
2. Four KPI cards
3. Lifecycle tabs
4. Separate At risk filter
5. Customer accounts table
6. Pagination

Verify:

- active sidebar item is Customers;
- search input is visible;
- Filters button is visible;
- Export CSV is visible;
- Add customer is visible;
- lifecycle tabs are:
  - All
  - Active
  - Trial
  - Past due
  - Churned
- At risk remains separate;
- At risk is not shown as a lifecycle tab;
- At risk count is `96`;
- Marco Ruiz remains Active;
- selected row treatment does not change underlying status;
- table values match approved customer data;
- customer total is `3,214`;
- active subscribers are `2,846`;
- trial accounts are `214`.

---

## 18. Subscriptions page

Verify route:

`/subscriptions`

Check structure:

1. Header controls
2. Four KPI cards
3. Plan Performance
4. Subscription Status
5. All Subscriptions table
6. Pagination

Verify:

- active sidebar item is Subscriptions;
- date selector is visible;
- Filters is visible;
- Export is visible;
- Add subscription is visible;
- Plan Performance matches global plan data;
- Subscription Status current-state total is `3,164`;
- current-state statuses are:
  - Active
  - Trialing
  - Past due
  - Paused
- historical churn appears outside the donut;
- historical churn count is `104`;
- churn is not included in the current-state donut;
- table data matches approved subscription data;
- annual plan amounts are correct;
- canceled records may appear in the table;
- current-state donut remains logically separate from historical records.

---

## 19. Settings page

Verify route:

`/settings`

Check structure:

1. Page header
2. Discard changes
3. Save changes
4. Settings tabs
5. Workspace Profile
6. Reporting Defaults
7. Regional Preferences
8. Notifications
9. Data and Privacy
10. Danger Zone

Verify tabs:

- General
- Reporting
- Notifications
- Billing
- Integrations

Verify fields and values match the approved content.

Check that:

- labels align consistently;
- inputs align consistently;
- selects align consistently;
- toggles align with labels;
- enabled and disabled toggle states are clear;
- helper text remains readable;
- Danger Zone is visually separated;
- Delete workspace uses error styling;
- destructive action is visual only;
- Workspace owner appears read-only where approved.

---

## 20. Mobile Overview

Verify approved mobile width around:

`390px`

Check structure:

1. Mobile app bar
2. Page title
3. Description
4. Date range
5. KPI cards in a 2 × 2 grid
6. Revenue Overview
7. Customer Growth
8. Subscriptions by Plan
9. Recent Transactions

Verify that:

- desktop sidebar is hidden;
- menu button opens the mobile drawer;
- date range is full width;
- KPI values do not truncate;
- KPI cards remain equal height;
- chart labels remain readable;
- tooltips do not overflow;
- cards stack with consistent spacing;
- transaction rows use the mobile layout;
- payment method is omitted from mobile transaction rows;
- no horizontal page scrolling appears;
- content padding is approximately `16px`;
- controls remain at least approximately `44px` high where practical.

---

## 21. Mobile drawer

Verify that:

- width is approximately `304px`;
- maximum width respects the viewport;
- drawer overlays the page;
- backdrop appears;
- close button works;
- Escape closes the drawer;
- backdrop click closes the drawer;
- background scrolling is locked;
- focus remains trapped;
- focus returns to the menu button after closing.

Content order:

1. Brand
2. Workspace switcher
3. Search
4. Navigation
5. Profile row

Check that all navigation items are readable and aligned.

---

## 22. Responsive behaviour

Test at minimum:

### Desktop

- `1920px`
- `1600px`
- `1440px`
- `1366px`
- `1280px`
- `1024px`

### Tablet

- `834px`
- `820px`
- `768px`

### Mobile

- `430px`
- `390px`
- `375px`
- `360px`
- `320px`

Verify at every width:

- no unintended horizontal scrolling;
- no overlapping cards;
- no clipped text;
- no clipped buttons;
- no broken tables;
- no chart overflow;
- no tooltip overflow;
- no clipped dropdowns;
- no broken pagination;
- no fixed presentation frame;
- no transform scaling.

---

## 23. Browser zoom

Test:

- 100%
- 125%
- 150%

Verify that:

- text remains readable;
- shell remains usable;
- sidebar does not overlap content;
- buttons remain accessible;
- tables remain usable;
- charts remain readable;
- page controls wrap correctly;
- mobile drawer remains usable.

---

## 24. Data consistency

Verify the following values are identical everywhere.

| Metric | Approved value |
|---|---:|
| MRR | `$84,720` |
| ARR | `$1,016,640` |
| Active subscriptions | `2,846` |
| Churn rate | `3.84%` |
| Previous churn rate | `4.27%` |
| Net subscription growth | `+141` |
| New subscriptions | `245` |
| Churned subscriptions | `104` |
| Total customer accounts | `3,214` |
| ARPA | `$29.77` |
| Gross revenue | `$112,480` |
| Previous gross revenue | `$102,630` |
| Subscription status total | `3,164` |

Verify that:

- ARR equals MRR multiplied by 12;
- plan MRR totals `$84,720`;
- plan active counts total `2,846`;
- plan shares total `100%`;
- transaction values match plan prices;
- annual prices equal monthly price multiplied by 12;
- subscription-status totals equal `3,164`;
- historical churn is not included in the current-state donut;
- At risk is separate from customer lifecycle status.

---

## 25. Content consistency

Verify that:

- page titles match the approved copy;
- page descriptions match the approved copy;
- button labels match the approved copy;
- filter labels match the approved copy;
- transaction statuses are correct;
- customer statuses are correct;
- subscription statuses are correct;
- dates use the approved fictional 2026 period;
- no placeholder lorem ipsum remains;
- no inconsistent product names remain;
- workspace name is Acme Cloud;
- user name is Maya Chen;
- role is Workspace Admin;
- product name is Subtera.

---

## 26. Icons

Verify that:

- icon style is consistent;
- stroke weight is consistent;
- icon sizes are consistent;
- icons align vertically with labels;
- active icons use violet treatment;
- inactive icons use muted treatment;
- icon buttons remain centred;
- icons do not stretch;
- icons do not appear blurry;
- the same action uses the same icon everywhere.

---

## 27. Status and trend badges

Verify that:

- badges use consistent padding;
- badges use pill radius;
- badge text remains readable;
- icons and arrows align correctly;
- status colours are consistent;
- negative values use error treatment;
- warning values use warning treatment;
- information values use information treatment;
- improvements use success treatment;
- churn reduction uses success treatment;
- badge text is not truncated;
- colour is not the only status indicator.

---

## 28. Forms and settings controls

Verify that:

- labels are consistently positioned;
- input heights are consistent;
- select heights are consistent;
- field spacing is consistent;
- helper text is readable;
- disabled fields remain legible;
- toggle states are clear;
- focus states are visible;
- form controls do not overflow;
- mobile fields stack correctly;
- Save changes remains visually primary;
- Discard changes remains visually secondary.

---

## 29. Interaction polish

Verify visible interaction states for:

- sidebar navigation;
- buttons;
- icon buttons;
- tabs;
- segmented controls;
- dropdowns;
- search fields;
- table rows;
- pagination;
- toggles;
- mobile drawer;
- card actions.

The demo does not require backend logic.

However, controls should still feel intentional and responsive.

Use local-state interactions where helpful.

---

## 30. Performance-related visual checks

Verify that:

- fonts do not flash excessively;
- charts do not cause layout shifts;
- cards do not jump after hydration;
- icons load without shifting labels;
- images do not stretch;
- mobile drawer animation is smooth;
- hover effects do not cause layout movement;
- skeletons are not required unless already implemented;
- visual effects do not noticeably reduce responsiveness.

---

## 31. Cross-browser visual checks

Test the current versions of:

- Chrome;
- Edge;
- Firefox.

Where practical, also verify Safari behaviour through available testing.

Check:

- font rendering;
- form controls;
- sticky positioning;
- grid layout;
- backdrop behaviour;
- drawer height;
- `100dvh`;
- chart rendering;
- tooltip positioning;
- scrollbar appearance;
- table overflow.

---

## 32. Final screenshot comparison

For each approved product screen or component-system reference, compare the
implementation and reference side by side.

Required application and component-system comparisons:

- Overview Desktop
- Analytics Desktop
- Customers Desktop
- Subscriptions Desktop
- Settings Desktop
- Overview Mobile
- Mobile Drawer
- Mini UI Kit

The Portfolio Cover may still receive separate portfolio-presentation QA, but
it must remain clearly separated from application visual QA. Do not implement
it as a product route, shell element or application screen inside the Next.js
dashboard.

Compare:

- overall composition;
- page proportions;
- sidebar width;
- content width;
- topbar height;
- card positions;
- card sizes;
- section gaps;
- internal padding;
- typography scale;
- colour values;
- border visibility;
- radius;
- control sizes;
- chart proportions;
- table density;
- responsive behaviour.

Do not attempt pixel-perfect matching by scaling the whole page.

Fix differences through shared tokens and reusable components.

---

## 33. Final acceptance criteria

The implementation is ready when:

- all five product routes are present;
- all product routes share the same shell;
- desktop layouts match the approved concept closely;
- Overview mobile matches the approved concept closely;
- mobile drawer works correctly;
- all pages remain usable below desktop width;
- no artificial presentation canvas remains;
- no `transform: scale()` is used;
- shared components control repeated styles;
- design tokens control global visual values;
- data is consistent across routes;
- charts are responsive;
- tables remain usable;
- accessibility states are visible;
- no major overflow or clipping remains;
- the interface feels like a real SaaS product;
- the result is suitable for GitHub, Upwork and portfolio presentation.

---

## 34. Final sign-off

Before sign-off, confirm:

- visual QA completed;
- responsive QA completed;
- data consistency checked;
- keyboard focus checked;
- mobile drawer checked;
- cross-browser check completed;
- browser zoom check completed;
- screenshots updated;
- README screenshots updated;
- no prototype-only UI remains;
- no production functionality is falsely claimed.

The final project may remain a frontend demo with fictional data.

It must still look coherent, responsive and implementation-ready.
