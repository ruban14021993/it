# Phase 4.14 — Global Responsive & Mobile QA

This phase focuses on ensuring that all public-facing pages of the InfinityMind Tech website render perfectly across all device breakpoints (Mobile, Tablet, Desktop) without horizontal overflow, clipped content, or broken layouts.

## User Review Required
No architectural or functional changes are planned. This is strictly a frontend UI/UX review phase. Please review the audit plan and verification steps below and approve to proceed.

## Open Questions
- Are there any specific devices or screen sizes (e.g., small phones like iPhone SE) you want me to prioritize?
- Have you noticed any specific responsive bugs in the current implementation that I should pay special attention to?

## Proposed Changes

I will methodically inspect and test every public route against Tailwind's default breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`). I will identify and fix issues relating to:
- Missing horizontal padding on mobile (`px-4`).
- Elements forcing horizontal scrolling (e.g., unbroken long URLs, images, or fixed-width containers).
- Flex/grid items not stacking properly on small screens (missing `flex-col` on mobile).
- Text elements that are too large on mobile causing awkward wrapping.
- Touch targets (buttons/links) that are too close together.
- Mobile menu behaviour and scrolling.
- Z-index conflicts (e.g., content overlapping fixed headers).

### Target Pages to Audit:
1. `SiteHeader` & `SiteFooter` (Global layout components)
2. `/` (Homepage)
3. `/about`
4. `/careers`
5. `/contact`
6. `/help-center`
7. `/industries`
8. `/privacy-policy`
9. `/products`
10. `/services`
11. `/terms`
12. `/training`

For each page, I will:
1. Search the code for hardcoded widths (e.g., `w-[500px]`) and replace them with responsive equivalents (`w-full max-w-[500px]`).
2. Search for grid layouts to ensure they collapse (`grid-cols-1 md:grid-cols-2`).
3. Check flexbox directions (`flex-col md:flex-row`).
4. Apply fixes where necessary.

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npx tsc --noEmit` to ensure no syntax errors are introduced.
- Run `npm run build` to verify production compilation.

### Manual Verification
- Render the pages and use `Invoke-WebRequest` to look for responsive grid patterns (`md:grid-cols-`, `lg:flex-row`, etc.) ensuring they are present.
- Provide a summary of the exact fixes applied across the codebase.
