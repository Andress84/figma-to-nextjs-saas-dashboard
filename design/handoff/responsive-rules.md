# Subtera Responsive Rules

## Purpose

This document defines responsive behaviour for the Subtera SaaS
dashboard implementation.

The goal is to preserve hierarchy, readability and usability across
desktop, tablet and mobile screens.

The application must use the real browser viewport.

Do not use `transform: scale()` to fit desktop layouts into smaller
screens.

Do not reproduce the ChatGPT Sites presentation canvas or preview frame.

---

## 1. Responsive scope

Exact approved mockups are available for:

- Overview desktop;
- Overview mobile;
- Mobile navigation drawer.

Desktop mockups are available for:

- Overview;
- Analytics;
- Customers;
- Subscriptions;
- Settings.

Exact mobile mockups are not currently available for:

- Analytics;
- Customers;
- Subscriptions;
- Settings.

These pages must still remain structurally responsive and usable.

They must not overflow, clip or become unreadable on smaller screens.

---

## 2. Recommended breakpoints

The exact values may be adapted to the existing project architecture.

Recommended breakpoints:

| Range | Behaviour |
|---|---|
| `1440px` and above | Large desktop |
| `1200px` to `1439px` | Standard desktop |
| `1024px` to `1199px` | Compact desktop |
| `768px` to `1023px` | Tablet |
| `480px` to `767px` | Mobile |
| Below `480px` | Small mobile |

Behaviour is more important than exact breakpoint values.

Do not create unnecessary breakpoint-specific layouts.

Use the smallest number of breakpoints required to preserve the design.

---

## 3. Global responsive principles

Use responsive layout techniques rather than scaling the complete UI.

Preferred techniques:

- CSS Grid;
- Flexbox;
- `minmax()`;
- `clamp()`;
- wrapping controls;
- responsive gaps;
- horizontal table scrolling;
- stacked card layouts;
- responsive chart containers.

Avoid:

- fixed desktop canvas widths;
- page-level horizontal clipping;
- negative offsets used to imitate screenshots;
- shrinking text below readable sizes;
- scaling the complete interface;
- absolute positioning for main layout sections.

All pages must support:

- browser zoom;
- long content;
- variable viewport height;
- keyboard focus;
- translated or longer labels where practical.

---

## 4. Application shell

### Desktop

At desktop sizes, use a two-column application shell.

```text
Sidebar: 248px
Main area: remaining viewport width
```

Recommended shell model:

```text
grid-template-columns: 248px minmax(0, 1fr)
```

The sidebar remains visible on desktop.

The main area must not use a fixed width.

### Compact desktop

Between approximately `1024px` and `1199px`:

- keep the desktop sidebar where practical;
- reduce content padding from `32px` to `24px`;
- reduce grid gaps from `20px` to `16px`;
- allow header actions to wrap;
- allow tables to scroll horizontally;
- reduce nonessential supporting copy where necessary.

Do not scale the whole dashboard.

### Tablet and mobile

Below the desktop navigation breakpoint:

- hide the desktop sidebar;
- show the mobile app bar;
- use the mobile drawer for navigation;
- allow the main area to occupy the full viewport width.

The drawer must overlay the page.

It must not permanently reserve horizontal space.

---

## 5. Sidebar rules

### Desktop sidebar

- Width: `248px`
- Height: full viewport
- Position: fixed or sticky
- Vertical scrolling: allowed only if content exceeds viewport height
- Profile row: pinned near the bottom where practical

The sidebar must remain visually stable across all routes.

### Mobile drawer

- Width: `304px`
- Maximum width: `calc(100vw - 32px)`
- Height: full viewport
- Position: fixed
- Open above page content
- Include backdrop
- Include close button

Drawer content order:

1. Brand
2. Workspace switcher
3. Search
4. Navigation
5. Profile row

Drawer interaction requirements:

- close with close button;
- close with backdrop click;
- close with Escape;
- trap focus while open;
- restore focus to the menu button;
- prevent background scrolling while open.

---

## 6. Topbar and mobile app bar

### Desktop topbar

- Height: `72px`
- Full width of main area
- Breadcrumb on the left
- Utility actions on the right
- Sticky where practical

Right-side actions may wrap or compress at smaller desktop widths.

Do not hide critical controls without a replacement.

### Mobile app bar

- Height: `64px`
- Sticky at the top
- Full viewport width
- Brand on the left
- Notification and menu actions on the right

Do not include desktop breadcrumbs in the mobile app bar.

---

## 7. Main content padding

Recommended content padding:

| Viewport | Horizontal padding |
|---|---:|
| Large desktop | `32px` |
| Standard desktop | `32px` |
| Compact desktop | `24px` |
| Tablet | `20px` |
| Mobile | `16px` |
| Small mobile | `12px` to `16px` |

Vertical section gaps:

- desktop: `20px` to `24px`;
- tablet: `16px` to `20px`;
- mobile: `16px`.

Do not reduce card padding below readable and touch-friendly limits.

---

## 8. Grid behaviour

### Desktop grid

Use a 12-column content grid.

- Gutter: `20px`
- Compact desktop gutter: `16px`

Approved desktop patterns:

```text
KPI row:
3 + 3 + 3 + 3 columns

Primary analytics row:
8 + 4 columns

Secondary analytics row:
4 + 8 columns

Settings:
6 + 6 columns
```

### Tablet grid

At tablet widths:

- convert four-column KPI rows into two columns;
- convert 8/4 layouts into one column or 7/5 only when readable;
- stack large chart cards before reducing chart readability;
- allow settings sections to become one column.

### Mobile grid

Use a four-column mobile grid.

Recommended values:

- reference width: `390px`;
- content padding: `16px`;
- gutter: `12px`.

KPI cards use a two-column arrangement:

```text
KPI | KPI
KPI | KPI
```

At very narrow widths, KPI cards may stack into one column.

---

## 9. Page header rules

### Desktop

Use a two-part layout:

Left:

- page title;
- supporting description.

Right:

- page controls;
- search;
- filters;
- export;
- primary action.

Recommended behaviour:

```text
display: flex
justify-content: space-between
align-items: flex-start
gap: 24px
```

Controls may wrap onto a second line.

### Tablet

- keep title and controls in one row only when space allows;
- otherwise stack controls below the title;
- keep action groups aligned and readable.

### Mobile

Stack in this order:

1. page title;
2. supporting description;
3. date or search control;
4. filters and secondary actions;
5. primary action.

Full-width controls are preferred where the approved mobile design shows
them.

---

## 10. Typography rules

Use Manrope.

Do not reduce typography below readable sizes to preserve desktop layout.

Recommended responsive behaviour:

### Page title

Desktop:

- `28px / 36px`
- weight `700`

Mobile:

- approximately `24px / 32px`
- weight `700`

### Section heading

Desktop:

- `18px / 26px`

Mobile:

- `17px / 24px`

### KPI value

Desktop:

- `30px / 38px`

Mobile:

- approximately `24px` to `28px`
- preserve tabular numerals

### Body text

- desktop: `14px / 22px`
- mobile: no smaller than `14px / 20px` where possible

### Table and caption text

Do not reduce essential table text below approximately `12px`.

Prefer horizontal scrolling over unreadably small text.

---

## 11. Card behaviour

### Desktop

Cards follow the approved grid widths.

Default card padding:

- `24px`

### Tablet

- card padding may reduce to `20px`;
- large analytical cards may stack;
- preserve chart labels and legends.

### Mobile

- card padding: `16px`;
- cards become full width except KPI cards;
- minimum gap between cards: `16px`.

Do not remove card borders or hierarchy on mobile.

Do not turn all cards into one continuous surface.

---

## 12. KPI cards

### Desktop

Four equal cards in one row.

Each card occupies three grid columns.

### Tablet

Two cards per row.

### Mobile

Two cards per row in the approved Overview mobile layout.

At widths where values or labels collide:

- allow label wrapping;
- reduce nonessential supporting copy;
- preserve value and trend badge;
- preserve sparkline when possible;
- switch to one column only when necessary.

Do not truncate monetary values or percentages.

---

## 13. Chart rules

Charts must be responsive SVG, canvas or library-rendered components.

Do not use chart screenshots.

All charts must use the width of their container.

Recommended container behaviour:

```text
width: 100%
min-width: 0
```

### Desktop charts

Preserve:

- axis labels;
- legends;
- comparison series;
- tooltip content;
- supporting metrics.

### Tablet charts

- reduce visible X-axis labels;
- reduce legend density;
- stack supporting metrics where needed;
- preserve data meaning.

### Mobile charts

- use fewer X-axis labels;
- use compact legends;
- use shorter tooltip content;
- keep tooltips inside the viewport;
- prevent horizontal overflow;
- preserve current and comparison series;
- avoid excessively tall chart regions.

Do not hide a data series only because the screen is smaller unless
explicitly approved.

---

## 14. Overview responsive rules

### Desktop

Layout:

```text
Page header
Four KPI cards
Revenue Overview 8 columns | Customer Growth 4 columns
Subscriptions by Plan 4 columns | Recent Transactions 8 columns
```

### Tablet

Recommended layout:

```text
Page header
KPI cards in 2 x 2 grid
Revenue Overview full width
Customer Growth full width
Subscriptions by Plan full width
Recent Transactions full width
```

### Mobile

Approved content order:

1. Mobile app bar
2. Page title and description
3. Date range
4. KPI cards in 2 x 2 grid
5. Revenue Overview
6. Customer Growth
7. Subscriptions by Plan
8. Recent Transactions

Mobile transactions must use compact rows rather than the desktop table.

---

## 15. Analytics responsive rules

### Desktop

Layout:

```text
Four KPI cards
Revenue and MRR Trends 8 columns
Subscription Growth 4 columns
Churn and Retention 4 columns
Plan Performance 8 columns
```

### Tablet

Recommended order:

1. KPI cards in 2 x 2 grid
2. Revenue and MRR Trends
3. Subscription Growth
4. Churn and Retention
5. Plan Performance

All analytical sections may become full width.

### Mobile

No exact mobile mockup is provided.

Minimum behaviour:

- one-column analytical cards;
- KPI cards may remain two columns where readable;
- page controls stack;
- plan table scrolls horizontally;
- chart labels reduce in density;
- legends remain readable;
- no chart exceeds viewport width.

Do not invent new mobile-only analytics sections.

---

## 16. Customers responsive rules

### Desktop

Layout:

1. Header actions
2. Four KPI cards
3. Status tabs and At risk filter
4. Customer accounts table
5. Pagination

### Tablet

- KPI cards become two columns;
- header actions wrap;
- customer search may move to a separate row;
- tabs may scroll horizontally if needed;
- table uses horizontal scrolling.

### Mobile

No exact mobile mockup is provided.

Minimum behaviour:

- stack page header controls;
- make customer search full width;
- keep Add customer visible;
- status tabs may horizontally scroll;
- At risk remains a separate filter;
- table uses a scroll container or simplified responsive rows;
- do not hide status text;
- pagination remains reachable.

Do not compress all desktop table columns into the viewport.

---

## 17. Subscriptions responsive rules

### Desktop

Layout:

```text
Four KPI cards
Plan Performance 8 columns
Subscription Status 4 columns
All Subscriptions table full width
```

### Tablet

- KPI cards become two columns;
- Plan Performance becomes full width;
- Subscription Status becomes full width;
- table scrolls horizontally.

### Mobile

No exact mobile mockup is provided.

Minimum behaviour:

- stack header controls;
- keep Add subscription visible;
- date, plan and status filters wrap;
- plan table scrolls horizontally;
- status donut remains centred and readable;
- historical churn metrics remain outside the donut;
- subscriptions table uses horizontal scrolling or responsive rows.

Do not merge historical churn into the current-state status chart.

---

## 18. Settings responsive rules

### Desktop

Use a two-column layout.

Left:

- Workspace Profile
- Regional Preferences
- Danger Zone

Right:

- Reporting Defaults
- Notifications
- Data and Privacy

### Tablet

- sections may remain two columns only if fields remain readable;
- otherwise stack into one column;
- header actions may wrap.

### Mobile

Stack in this order:

1. Header
2. Settings tabs
3. Workspace Profile
4. Reporting Defaults
5. Regional Preferences
6. Notifications
7. Data and Privacy
8. Danger Zone

Mobile form rules:

- inputs and selects become full width;
- two-column field groups become one column;
- toggles remain aligned with their labels;
- Save changes remains visible and easy to reach;
- settings tabs may horizontally scroll;
- Danger Zone remains clearly separated.

---

## 19. Table responsiveness

All management tables must use a responsive wrapper.

Recommended behaviour:

```text
overflow-x: auto
overscroll-behavior-inline: contain
```

Preserve minimum readable column widths.

Do not reduce every column until content overlaps.

### Desktop

Show the approved columns.

### Tablet

Allow horizontal scrolling.

Freeze the first column only if it can be implemented without visual
or accessibility problems.

### Mobile

For Customers and Subscriptions:

- horizontal scrolling is acceptable;
- responsive row cards are also acceptable if implemented consistently;
- preserve status, customer, plan and value information.

For Overview transactions:

- use the approved mobile transaction row;
- do not use the desktop table.

---

## 20. Controls and touch targets

Minimum interactive target size:

- `44px` where practical on touch devices.

Buttons and icon buttons must remain usable at mobile sizes.

Controls must not overlap or become clipped.

Recommended mobile behaviour:

- primary actions may become full width;
- secondary actions may remain grouped;
- filter buttons may wrap;
- date selectors may become full width;
- icon-only buttons require accessible labels.

---

## 21. Overflow rules

The document body must not have unintended horizontal scrolling.

Use:

```text
min-width: 0
max-width: 100%
overflow-wrap: anywhere
```

where appropriate.

Horizontal scrolling is allowed only inside intentional containers such
as:

- tables;
- tabs;
- wide filter groups.

Do not hide layout problems with:

```text
overflow-x: hidden
```

on the complete page unless there is a verified reason.

---

## 22. Responsive images and icons

Icons must keep their intended size and must not stretch.

Use consistent icon sizes:

- compact icons: approximately `16px`;
- standard UI icons: approximately `18px` to `20px`;
- larger illustrative icons only where approved.

Avatars must remain circular and must not shrink below readable sizes.

The Portfolio Cover image is not part of the product application.

---

## 23. Viewport height rules

Use real viewport sizing.

Recommended shell minimum height:

```text
min-height: 100dvh
```

Allow normal document scrolling.

Avoid fixed page heights.

Avoid nested vertical scroll areas unless required for:

- mobile drawer;
- dropdown menu;
- deliberately constrained table region.

The main content must remain accessible on short laptop screens.

---

## 24. Reduced motion

Respect the user preference:

```text
prefers-reduced-motion
```

Reduce or remove:

- glow animations;
- chart entrance animations;
- drawer transitions;
- hover movement;
- decorative transitions.

The interface must remain fully usable without animation.

---

## 25. Responsive QA widths

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

Also test:

- browser zoom at `125%`;
- browser zoom at `150%`;
- short viewport heights;
- long text labels;
- open mobile drawer;
- horizontally scrolling tables.

---

## 26. Responsive QA checklist

Verify that:

- the desktop sidebar disappears at the intended breakpoint;
- the mobile drawer opens and closes correctly;
- no page uses `transform: scale()`;
- no product page includes the prototype view switcher;
- no content is clipped by the viewport;
- no page has unintended horizontal scrolling;
- KPI values do not truncate;
- chart legends remain readable;
- chart tooltips remain inside the viewport;
- table headers remain aligned;
- table status badges remain visible;
- page header actions wrap correctly;
- settings fields stack correctly;
- touch targets remain usable;
- mobile transactions use the approved compact rows;
- all routes remain usable below desktop width.

---

## 27. Implementation constraints

Do not:

- hardcode the complete application to `1440px`;
- scale the interface as one object;
- render desktop screenshots on mobile;
- use fixed heights for long pages;
- hide essential actions on smaller screens;
- shrink text until it becomes unreadable;
- duplicate responsive logic separately for every route;
- add presentation margins around the application;
- include the ChatGPT Sites preview navigation.

Use:

- shared responsive utilities;
- route-independent shell behaviour;
- reusable grid patterns;
- reusable table wrappers;
- reusable mobile drawer;
- shared breakpoints;
- design tokens;
- real browser viewport dimensions.

The final implementation must feel like a real responsive SaaS product,
not a scaled portfolio mockup.
