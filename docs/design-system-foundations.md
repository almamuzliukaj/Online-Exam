# Design System Foundations

## Purpose

This document defines the visual and interaction foundation used for the Sprint 1 product shell and role-entry experience.

## Design Principles

- Professional but approachable
- Clean academic operations look
- Strong readability over decoration
- Shared shell reused across protected pages
- Role context visible without overwhelming the page
- Responsive behavior preserved on desktop and mobile

## Color Direction

Primary palette:

- `Primary`: teal-green for system actions and role emphasis
- `Accent`: warm amber for secondary highlights
- `Background`: soft parchment-neutral surface so the app feels calmer and more institutional
- `Heading`: deep slate-green for strong contrast
- `Muted`: desaturated green-gray for supporting text

Functional palette:

- `Success`: green
- `Danger`: red
- `Draft / muted state`: warm neutral or gray

## Typography

- Display typography is reserved for page titles and metric emphasis
- Sans typography is used for body copy, labels, forms, and navigation
- Uppercase eyebrow labels create hierarchy without adding visual noise

## Core Layout Patterns

### 1. Shared Shell

- fixed left sidebar on desktop
- collapsible sidebar on smaller screens
- centered main content region
- large topbar for page identity and role context

### 2. Card System

- soft glass-like white surfaces
- subtle border plus shadow depth
- rounded corners
- consistent padding rhythm

### 3. Navigation Language

- role-specific sidebar items
- active item receives stronger contrast and lift
- descriptive secondary text explains each section

### 4. Page Entry Pattern

Every major protected page follows:

1. eyebrow label
2. large page title
3. short explanatory subtitle
4. contextual actions on the right

## Component Foundations

- `AppShell`: shared frame
- `topbar`: page identity and actions
- `sidebarIdentity`: signed-in user context
- `navItem`: role navigation tile
- `surfaceCard`: generic content card
- `summaryCard`: small metric summary block
- `metricCard`: dashboard KPI tile
- `resourceCard`: exam/workspace content preview

## Logo Direction

The logo uses:

- rounded app-icon shape
- white exam/document center
- approval/check indicator
- system-aligned teal and accent colors

This keeps the icon readable at favicon size while still looking product-specific.

## Responsive Foundations

- desktop: full sidebar + centered main content
- tablet: stacked grids where needed
- mobile: sidebar overlay with menu trigger
- actions wrap instead of overflow

## Sprint 1 Relevance

This document supports Alma's Sprint 1 deliverables:

- professional app shell
- role-aware entry UX
- English UI system
- design system foundations
