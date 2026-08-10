# PAIR — Couples Budgeting App

> *Money, together.*

A mobile-first budgeting app for couples, built as a portfolio project. PAIR lets two partners manage shared finances, track budgets by category, monitor savings pots and debts, and plan ahead month by month.

---

## Project Overview

| | |
|---|---|
| **Type** | Mobile-first web app (React SPA) |
| **Target platform** | iOS via TestFlight (Expo migration planned) |
| **Users** | Two partners sharing finances |
| **Status** | Active development — UI complete, backend integration planned |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Language | JavaScript (ES2023) |
| Fonts | Outfit (display) + Inter (body) via Google Fonts |
| Theming | CSS custom properties with `[data-theme]` attribute |
| State | React `useState` + Context API |
| Routing | Manual screen routing via `useState` in `App.jsx` |

### Planned additions
- **Expo + React Native** — native iOS/Android
- **Supabase** — auth, database, real-time sync between partners
- **TrueLayer** — Open Banking integration (transactions, balances, credit cards)
- **Monzo API** — Pots data (not available via Open Banking)
- **Expo EAS Build** — cloud build + TestFlight distribution

---

## Features Built

### Screens
- **Onboarding** — hero screen with PAIR branding, couple illustration, PAIR'd widget, CTA buttons
- **Create Account** — two-step flow (personal details → partner invite) with form validation
- **Login** — email/password with loading state and forgot password link
- **Dashboard** — balance card, spending overview, budget categories, activity feed, bottom nav
- **Budget Overview** — donut chart summary, category breakdown, month navigation (6 months back, 3 ahead)
- **Category Detail** — radial progress, spending insights, transaction history, add transaction
- **Pots** — tabbed Savings / Debts view with summary ring charts
- **Pot Detail** — progress ring, payment history, add deposit/payment form, edit sheet
- **Settings** — profile rows, dark/light mode toggle, preferences

### Key interactions
- Month navigation in Budgets (past months show historical data, future show planning mode)
- Add deposits and payments to any savings pot or debt with per-person attribution
- Edit pot details inline via a bottom sheet (name, emoji, goal, APR etc)
- Dark/light theme switch persisted via React Context
- Partner invite flow on account creation

---

## Brand

| Element | Value |
|---|---|
| Name | PAIR |
| Slogan | Money, together. |
| P colour | `#0088A6` (teal) |
| A colour | `#47D3B2` (mint) |
| I colour | `#BBF42E` (lime) |
| R colour | `#FF4F40` (coral) |
| Dark background | `#0B1120` |
| Light background | `#F1F9F2` |
| Display font | Outfit |
| Body font | Inter |

---

## Project Timeline

### Week 1 — Foundation & Onboarding
- Initialised React + Vite + Tailwind CSS v4 project
- Built onboarding screen with hero copy, couple illustration, PAIR'd widget
- Implemented PAIR multicolour logo wordmark
- Established brand colours and gradient text (`together.`)
- Wired Google Fonts (Outfit + Inter)

### Week 2 — Dashboard & Navigation
- Built full dashboard with balance card, SparkChart, category cards, activity feed
- Implemented bottom navigation (Home, Budgets, Pots, Profile)
- Built Budget Overview with donut chart and category drill-down
- Built Category Detail screen with radial progress ring and transaction list
- Added PAIR'd badge with partner name in dashboard header

### Week 3 — Architecture & Theming
- **Converted entire project from TypeScript to JavaScript** — removed tsconfig, type annotations, generics
- **Extracted all inline styles to `src/styles.css`** — large refactor, dynamic styles (prop-driven colours, computed widths) kept inline legitimately
- Implemented dark/light theme system via CSS custom properties on `[data-theme]` attribute
- Built Settings screen with dark mode toggle using React Context
- Fixed recurring React `background`/`backgroundClip` inline style conflict — resolved permanently with `.gradient-text` CSS class

### Week 4 — Pots & Detail Screens
- Built Pots screen with Savings and Debts tabs
- Moved SAVINGS and DEBTS data to named exports in `Pots.jsx` for shared access across screens
- Built Pot Detail screen with payment tracking, history list, and progress visualisation
- Added edit sheet to Pot Detail for updating name, emoji, description, goal/total, APR, minimum payment
- Fixed Vite cache corruption causing `ReferenceError: POTS is not defined` — resolved by deleting `node_modules/.vite`

### Week 5 — Budgets Month Navigation & Auth
- Added month navigation to Budget Overview — 6 months historical + 3 months planning ahead
- Built per-month spending data with realistic historical variation
- Designed future planning mode — dimmed donut, "Planned" badge, no spending state
- Redesigned budget header and month navigator into a polished pill control with chevron arrows
- Built Create Account screen (two-step: personal details + partner invite with validation)
- Built Login screen (email/password, loading state, cross-links to signup)
- Wired all auth screens into app router

---

## Key Learnings

### React & JavaScript

**1. Function hoisting breaks with Vite's module transform**
Defining helper components after `export default` usually works due to JS hoisting, but Vite's HMR module caching can hold stale bindings. Lesson: define all helper components *before* the default export, or use `const` arrow functions to make scope explicit.

**2. React reconciliation with mixed node types**
Mixing `<br>` tags with text nodes and `<span>` elements inside a single `<p>` causes React's `removeChild`/`insertBefore` errors. The fix is to use discrete string literals (`{'Money, '}`) and avoid `<br>` inside mixed-content paragraphs.

**3. Inline style conflicts with CSS properties**
Using the `background` shorthand alongside `backgroundClip` in React's `style` prop triggers a reconciliation warning because React applies them as separate properties that conflict. Solution: move gradient text styling to a dedicated CSS class entirely.

**4. Vite cache corruption**
When refactoring module exports (moving `POTS` to named exports, renaming components), Vite's cache in `node_modules/.vite` can hold stale compiled versions that cause `ReferenceError`s even when the source is correct. Always clear the cache after significant refactors: `rm -rf node_modules/.vite`.

### Architecture

**5. Shared data between screens requires careful placement**
When multiple screens need the same data (e.g. SAVINGS/DEBTS arrays needed by both `Pots.jsx` for the list and `App.jsx` for routing to `PotDetail`), the data needs to live in a shared location. Named exports from the screen file that owns it (`Pots.jsx`) was the cleanest solution without adding a separate data layer.

**6. CSS custom properties for theming vs. Tailwind**
Tailwind's dark mode utilities (`dark:bg-gray-900`) are convenient but less flexible for a design-heavy app with non-standard colours. Using CSS custom properties on a `[data-theme]` attribute gives full control and works well with arbitrary brand colours.

**7. Inline styles are sometimes the right choice**
The goal of "no inline styles" has genuine merit but dynamic values (colours from component props, widths computed from ratios) legitimately belong inline. Over-extracting these to CSS classes that accept no parameters creates more complexity, not less.

### Design & UX

**8. Mobile-first constraint improves design discipline**
Designing for a 390px-wide frame forces every element to justify its vertical space. This constraint produced a cleaner layout than unconstrained web design typically does.

**9. Financial app conventions are strong**
Users of Monzo, Revolut, and similar apps have strong expectations: bottom nav, card-based layout, progress bars for budgets, radial rings for pots. Matching these patterns reduces cognitive load significantly.

**10. Two-step onboarding for a couples app**
The partner invite step in account creation is a core differentiator for PAIR — both users need to be linked. Designing this as step 2 of signup (rather than an afterthought in settings) makes the PAIR'd concept central to the product from the first interaction.

---

## Challenges

### Technical

- **TypeScript → JavaScript migration mid-project** — the project was initially scaffolded with TypeScript. Converting mid-build required removing all type annotations, generics, `as` casts, deleting `tsconfig.json` files, and removing TypeScript devDependencies. Time-consuming but straightforward.

- **Persistent Vite HMR caching** — the `ChevronLeft is not defined` error persisted across multiple fixes because Vite's HMR was serving a cached module version. Required a full rewrite of the file with renamed components to force cache invalidation, alongside manually clearing `node_modules/.vite`.

- **CSS extraction at scale** — extracting ~1400 lines of inline styles into `src/styles.css` while correctly identifying which styles were truly static vs. dynamic required careful judgement. Several passes were needed to get it right.

- **Month data architecture** — generating realistic per-month budget data without a real backend required a deterministic approach (multipliers per category per offset) that feels varied but stays consistent across re-renders.

### Product

- **Open Banking limitations** — Monzo Pots are not exposed via the Open Banking standard that TrueLayer uses. This requires a dual-integration approach (TrueLayer for transactions/balances, Monzo API for pots), which adds complexity for a product whose core feature is pot-based saving.

- **Partner data sync** — without a backend, both partners see completely independent local state. Making PAIR genuinely shared in real time requires Supabase or equivalent, which is a significant architectural step beyond the current prototype.

- **Joint account attribution** — on a joint account, knowing *which* partner made a specific transaction requires either Monzo's own tagging system or manual attribution. Open Banking transactions do not include a "who spent this" field.

---

## Planned Next Steps

1. **Expo + React Native migration** — rewrite components using RN primitives, NativeWind for styling
2. **Supabase integration** — auth, shared database, real-time sync
3. **TrueLayer Open Banking** — connect joint Monzo account, pull real transactions and balance
4. **Monzo API** — pull Pots data to replace hardcoded savings pots
5. **TestFlight distribution** — Expo EAS Build → App Store Connect → TestFlight invite

---

## Running Locally

```bash
pnpm install
pnpm dev
```

Dev server runs on the port defined by `$PORT` (default 8443). Hot reload is enabled.

---

## Project Structure

```
src/
├── App.jsx              # Root router and shared data
├── ThemeContext.jsx      # Dark/light theme provider
├── index.css            # Tailwind import + gradient-text class
├── styles.css           # All static component styles
├── main.jsx             # React entry point
├── screens/
│   ├── Onboarding.jsx
│   ├── CreateAccount.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── BudgetOverview.jsx
│   ├── CategoryDetail.jsx
│   ├── Pots.jsx         # Also exports SAVINGS and DEBTS arrays
│   ├── PotDetail.jsx
│   └── Settings.jsx
└── imports/             # Figma-imported assets (logo, illustration)
```
