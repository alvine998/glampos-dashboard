# AGENTS.md — GlampOS (Property Management System)

This file gives coding agents (Claude Code, Cursor, Copilot Workspace, etc.) the
context needed to work on this repo correctly without re-deriving conventions
from scratch. Read this before making changes.

## What this project is

GlampOS is a **Property Management System for glamping businesses**. It is a
**fully frontend** dashboard — there is no backend/API written in this repo;
all data comes from external APIs consumed via Axios. Do not scaffold backend
routes, database models, or server actions unless explicitly asked.

Core modules visible in the product: Dashboard (daily ops summary), Kalender
(calendar/booking timeline), Booking, Unit & Properti, Rate & Harga, Keuangan
(finance), Laporan (reports), Pengaturan (settings).

The UI language is **Bahasa Indonesia**. Keep all user-facing copy, labels,
dates, and currency formatting (Rupiah, `Rp`) in Indonesian unless told
otherwise. Don't translate existing strings to English.

The product supports **role-based preview modes**: Owner, Front Office,
Finance, Super Admin. Treat this as a first-class concept — new screens
should consider which role(s) can see them and what data/actions differ per
role, even though role logic is handled on the frontend (state/props), not
via a backend auth layer.

## Tech stack

- **Framework**: Next.js (App Router) — always use the `app/` directory
  conventions, not `pages/`.
- **Language**: TypeScript. No `.js`/`.jsx` files. Avoid `any`; prefer
  explicit interfaces/types for props, API responses, and Zustand store
  shapes.
- **Styling**: Tailwind CSS. No CSS modules, no styled-components, no inline
  `style={}` unless it's a genuinely dynamic value (e.g. a computed chart
  color or width %) that Tailwind can't express.
- **State management**: Zustand. Use per-domain stores (e.g. `useBookingStore`,
  `useUnitStore`) rather than one giant global store. Keep server-derived data
  and pure UI state (modals open/closed, active tab) in separate stores or
  clearly separated slices.
- **HTTP**: Axios. Centralize instances/interceptors (base URL, auth headers,
  error handling) in a single client module — don't instantiate Axios ad hoc
  inside components.
- **Charts**: Chart.js and ApexCharts are both available. Don't introduce a
  third charting library. Use Chart.js and ApexCharts consistently with
  whatever the existing screen already uses for that chart type — check
  neighboring components before picking one for a new chart.
- **Runtime/package manager**: Bun. Use `bun`, not `npm`/`yarn`/`pnpm`, for
  installs and scripts.
- **Notifications**: `react-hot-toast` for all toast/alert feedback (success,
  error, loading states). Don't build custom toast UI.
- **Icons**: `lucide-react` only. Don't mix in another icon set.
- **Progress indicators**: use the existing ProgressBar component/library for
  loading and progress states (e.g. route transitions, upload/save progress).
- **Calendar**: use the existing calendar library/component already wired
  into the Kalender module — don't add a second calendar dependency.

## Rendering & hydration

This app relies on **hydrated HTML** (server-rendered markup hydrated on the
client). When writing components:
- Be careful with anything that differs between server and client render
  (dates, `Math.random`, `window`/`localStorage` access, locale-dependent
  formatting) — guard it or compute it post-mount to avoid hydration
  mismatches.
- Prefer Server Components for static/structural pieces and mark truly
  interactive pieces `"use client"` explicitly, rather than defaulting
  everything to client components.
- Never read `window`, `document`, or browser-only APIs during the initial
  render path without a mount check.

## Design language

Match the existing GlampOS visual style — do not default to generic
shadcn/Tailwind dashboard boilerplate. Specifically:

- **This is not a generic AI-generated dashboard.** Avoid the typical
  "AI dashboard" look (purple/indigo gradients, glassmorphism cards, generic
  stat-card-with-icon-in-a-circle everywhere) unless that's already the
  established pattern in this codebase. Reuse existing card, stat, and list
  components instead of inventing new visual patterns per screen.
- **Colors**: follow the palette already defined in `tailwind.config.ts` /
  the design tokens used across the live dashboard (clean, light, neutral
  base with a glamping-appropriate accent — greens/earth tones over generic
  SaaS blue/purple). Pull hex values from the existing config rather than
  guessing — if a new color is truly needed, add it to the Tailwind config
  as a token, don't hardcode hex in components.
- Reuse existing typography scale, spacing, and card/shadow styles — check
  an existing dashboard/summary card before building a new one.

## Forms

- **If a form has 5 or fewer inputs, use a modal.**
- **If a form has more than 5 inputs, do NOT use a modal — build a
  dedicated create/edit page instead** (e.g. `app/units/new/page.tsx`,
  `app/units/[id]/edit/page.tsx`). This applies even if an existing similar
  flow used a modal — check input count before copying a pattern.
- Edit and create flows for the same entity should share the same
  page/component where practical, toggled by presence of an `id`/initial
  data, to avoid duplicated form logic.

## Tables

- Every data table's **Actions column is always the rightmost column and
  must be fixed/sticky** (stays visible on horizontal scroll). Don't add new
  table components without this — check an existing table (e.g. bookings
  list, unit list) for the sticky-column pattern already in use and follow
  it exactly.
- Keep row actions (edit/delete/view) consistent in icon and order across
  tables — check existing tables before choosing icons.

## Commands

Confirm these against `package.json` before relying on them — fill in/adjust
if scripts differ:

```bash
bun install        # install dependencies
bun dev             # start dev server
bun run build        # production build
bun run lint         # lint
```

## Conventions checklist for agents

Before opening a PR-worthy change, verify:
- [ ] No backend/API/database code was added — this repo is frontend-only.
- [ ] All new UI copy is in Bahasa Indonesia and matches existing tone.
- [ ] No hydration warnings introduced (check server/client render parity).
- [ ] Colors/spacing pulled from existing Tailwind config, not new hardcoded
      hex values or generic "AI dashboard" gradients.
- [ ] Forms: modal used only if ≤5 inputs; full create/edit page if >5.
- [ ] Tables: Actions column is right-most and fixed/sticky.
- [ ] Role-based visibility (Owner / Front Office / Finance / Super Admin)
      considered for any new screen or action.
- [ ] Toasts via `react-hot-toast`, icons via `lucide-react`, charts via the
      already-established Chart.js/ApexCharts choice for that chart type.
- [ ] Used `bun`, not another package manager.

## Notes for future edits to this file

This file was written from a description of the stack rather than a full
repo scan. If actual folder structure, exact Tailwind color tokens, exact
script names, or component names diverge from what's written here, update
this file to match reality — AGENTS.md should always reflect the real repo,
not assumptions.