# Subtera Design Tokens

## Purpose

This document defines the shared visual foundations for the Subtera
frontend implementation.

All colors, typography, spacing, radii, borders and effects must be
centralized.

Do not duplicate raw visual values inside individual pages or components.

The implementation may use:

- CSS custom properties;
- Tailwind theme tokens;
- a centralized TypeScript theme configuration;
- the existing token system already supported by the repository.

---

## 1. Color system

### Application backgrounds

- Canvas: `#08090E`
- Sidebar: `#0B0C12`
- Primary surface: `#11121A`
- Raised surface: `#151722`
- Hover surface: `#1B1D29`

Usage:

- Canvas is the main application background.
- Sidebar is used for the desktop sidebar and mobile drawer.
- Primary surface is used for cards and main panels.
- Raised surface is used for inputs, controls and nested panels.
- Hover surface is used for hovered controls and table rows.

### Selected surface

Value:

`rgba(124, 92, 255, 0.10)`

Use for:

- active navigation;
- selected table rows;
- active tabs;
- highlighted secondary controls.

---

## 2. Borders

### Default border

Value:

`#262938`

Use for:

- cards;
- inputs;
- selects;
- buttons;
- dividers;
- tables.

### Strong border

Value:

`#373B4E`

Use for:

- focused controls;
- emphasized panels;
- selected elements.

### Accent border

Value:

`rgba(124, 92, 255, 0.45)`

Use for:

- highlighted KPI card;
- active navigation;
- selected states;
- important violet controls.

Default border width:

`1px`

Avoid heavy outlines and thick borders.

---

## 3. Text colors

### Primary text

Value:

`#F5F3FF`

Use for:

- page titles;
- card titles;
- KPI values;
- table amounts;
- important labels.

### Secondary text

Value:

`#A7A7B5`

Use for:

- descriptions;
- supporting copy;
- navigation labels;
- form labels.

### Muted text

Value:

`#6F7280`

Use for:

- metadata;
- chart axes;
- timestamps;
- helper text;
- table headers.

### Disabled text

Value:

`#505361`

Use only for disabled or unavailable interface elements.

---

## 4. Brand and accent colors

### Primary violet

Value:

`#7C5CFF`

Use for:

- primary actions;
- active navigation;
- selected controls;
- primary chart series;
- important highlights.

### Violet hover

Value:

`#8D72FF`

Use for hover states of primary actions.

### Lavender

Value:

`#B49CFF`

Use for:

- secondary chart data;
- supporting highlights;
- secondary plan colors.

### Supporting blue

Value:

`#5C7CFA`

Use sparingly for secondary chart information.

### Chart comparison

Value:

`#5A5F73`

Use for:

- previous-period chart series;
- secondary chart lines;
- neutral comparison data.

### Chart grid

Value:

`#242635`

Use for chart grid lines and chart separators.

---

## 5. Status colors

Status information must use both text and color.

### Success

- Foreground: `#3DDC97`
- Background: `#133227`

Use for:

- Paid;
- Active;
- positive growth;
- successful actions;
- improved churn.

### Warning

- Foreground: `#F5B942`
- Background: `#352A12`

Use for:

- Pending;
- At risk;
- warnings;
- expiring trials.

### Error

- Foreground: `#FF6B81`
- Background: `#3A1820`

Use for:

- Failed;
- Past due;
- destructive actions;
- validation errors.

### Information

- Foreground: `#56B4FF`
- Background: `#132A38`

Use for:

- Trial;
- Refunded;
- informational messages;
- neutral system guidance.

### Neutral status

- Foreground: `#A7A7B5`
- Background: `#252733`

Use for:

- Paused;
- Canceled;
- Churned;
- inactive states.

---

## 6. Typography

### Primary font family

`Manrope`

### Fallback stack

`Manrope, Inter, system-ui, -apple-system, BlinkMacSystemFont,
"Segoe UI", sans-serif`

### Page title

- Font size: `28px`
- Line height: `36px`
- Font weight: `700`

### Section heading

- Font size: `18px`
- Line height: `26px`
- Font weight: `700`

### KPI value

- Font size: `30px`
- Line height: `38px`
- Font weight: `700`

### Large analytics value

- Font size: `28px`
- Line height: `36px`
- Font weight: `700`

### Card title

- Font size: `15px`
- Line height: `22px`
- Font weight: `600`

### Body text

- Font size: `14px`
- Line height: `22px`
- Font weight: `400`

### UI label

- Font size: `13px`
- Line height: `20px`
- Font weight: `500` or `600`

### Table text

- Font size: `13px`
- Line height: `20px`
- Font weight: `500`

### Caption

- Font size: `12px`
- Line height: `16px` to `20px`
- Font weight: `500`

### Overline

- Font size: `10px` to `11px`
- Line height: `16px`
- Font weight: `600`
- Letter spacing: approximately `0.08em`
- Text transform: uppercase

### Numerical formatting

Use tabular numerals for:

- currency;
- percentages;
- dates;
- KPI values;
- table amounts;
- chart tooltips.

Recommended CSS property:

`font-variant-numeric: tabular-nums`

---

## 7. Spacing scale

Use the following shared spacing scale:

- `4px`
- `8px`
- `12px`
- `16px`
- `20px`
- `24px`
- `32px`
- `40px`
- `48px`

Recommended semantic tokens:

- `space-1`: `4px`
- `space-2`: `8px`
- `space-3`: `12px`
- `space-4`: `16px`
- `space-5`: `20px`
- `space-6`: `24px`
- `space-8`: `32px`
- `space-10`: `40px`
- `space-12`: `48px`

### Layout spacing

- Desktop page padding: `32px`
- Compact desktop padding: `24px`
- Mobile page padding: `16px`
- Desktop grid gutter: `20px`
- Mobile grid gutter: `12px`
- Section gap: `20px` to `24px`

### Card spacing

- Desktop card padding: `24px`
- Mobile card padding: `16px`
- Card title to content: `16px` to `20px`
- Label to value: `8px`
- Value to supporting text: `8px`
- Card-to-card gap: `20px`

### Form spacing

- Label to control: `8px`
- Control to helper text: `6px` to `8px`
- Field-to-field gap: `16px`
- Form section gap: `24px`

### Table spacing

- Horizontal row padding: `16px`
- Vertical row padding: `14px` to `16px`
- Table header height: approximately `44px`
- Standard table row height: approximately `52px` to `56px`

---

## 8. Radius

### Small radius

Value:

`8px`

Use for:

- internal surfaces;
- tooltips;
- compact controls;
- nested chart areas.

### Navigation radius

Value:

`10px`

Use for navigation items.

### Control radius

Value:

`12px`

Use for:

- buttons;
- inputs;
- selects;
- tabs;
- segmented controls;
- icon buttons.

### Card radius

Value:

`16px`

Use for:

- KPI cards;
- analytics cards;
- tables;
- settings panels;
- main content sections.

### Pill radius

Value:

`999px`

Use for:

- status badges;
- trend badges;
- filter chips;
- count badges.

---

## 9. Control sizes

### Standard desktop control

- Height: `40px`

### Large control

- Height: `44px`

### Mobile control

- Minimum height: `44px`

### Compact badge

- Height: approximately `24px`

### Icon button

- Desktop size: `40px`
- Mobile size: minimum `44px`

### Desktop topbar

- Height: `72px`

### Mobile app bar

- Height: `64px`

All interactive mobile controls must have a minimum touch target of
`44px × 44px`.

---

## 10. Shadows and glow

### Default card shadow

Use a restrained dark shadow:

`0 12px 30px rgba(0, 0, 0, 0.28)`

### Highlighted element

Use:

- outline:
  `0 0 0 1px rgba(124, 92, 255, 0.35)`
- glow:
  `0 0 36px rgba(124, 92, 255, 0.12)`

Glow may be used only for:

- active navigation;
- highlighted MRR card;
- important chart point;
- selected brand accent;
- focused primary action.

Do not apply glow to every card.

Do not use strong neon effects.

---

## 11. Charts

### Current period

- Line color: `#8B6CFF`
- Area fill:
  violet gradient from approximately `28%` opacity to `0%`

### Previous period

- Line color: `#5A5F73`
- Line style: dashed
- No strong glow

### New subscriptions

- Color: `#7C5CFF`

### Churned subscriptions

- Color: `#FF7A90`

### Positive retention line

- Color: `#3DDC97`

### Chart grid

- Color: `#242635`
- Width: `1px`

### Chart tooltip

- Background: `#1B1D29`
- Border: `#373B4E`
- Radius: `8px`
- Primary text: `#F5F3FF`
- Secondary text: `#A7A7B5`

Charts must remain readable without relying on glow.

---

## 12. Focus states

All interactive elements must have a visible keyboard focus state.

Recommended focus treatment:

- border:
  `1px solid rgba(124, 92, 255, 0.70)`
- outline:
  `2px solid rgba(124, 92, 255, 0.25)`
- outline offset:
  `2px`

Do not remove focus outlines without providing an accessible replacement.

---

## 13. Motion

Use subtle motion only.

Recommended durations:

- Fast interaction: `120ms`
- Standard interaction: `180ms`
- Drawer and overlay: `220ms`

Recommended easing:

`ease-out`

Animate only:

- hover transitions;
- drawer opening;
- dropdown opening;
- button states;
- subtle chart appearance.

Respect the user preference:

`prefers-reduced-motion`

Do not use continuous decorative animations.

---

## 14. Implementation rules

All shared values must be centralized.

Do not:

- hardcode different violet colors on individual pages;
- create unique card radii for each route;
- duplicate button styles;
- duplicate badge styles;
- use arbitrary spacing values without a reason;
- use screenshots as interface elements;
- use `transform: scale()` to imitate responsive design;
- reduce text contrast for decorative purposes.

Shared component changes must propagate across:

- Overview;
- Analytics;
- Customers;
- Subscriptions;
- Settings;
- Mobile Overview;
- Mobile Drawer.

---

## 15. Suggested CSS custom properties

The following names are recommended:

- `--color-bg-canvas`
- `--color-bg-sidebar`
- `--color-surface-primary`
- `--color-surface-raised`
- `--color-surface-hover`
- `--color-border-default`
- `--color-border-strong`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-accent-primary`
- `--color-accent-hover`
- `--color-accent-lavender`
- `--color-accent-blue`
- `--color-success`
- `--color-warning`
- `--color-error`
- `--color-information`
- `--radius-sm`
- `--radius-nav`
- `--radius-control`
- `--radius-card`
- `--radius-pill`

Codex may adapt the token names to the existing project architecture,
but the values and semantic meaning should remain consistent.
