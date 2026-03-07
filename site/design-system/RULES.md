# AI Tools HQ — Design Rules
> Hard policies. If it says NEVER, the linter will catch it.

## Colors

- **DO** use CSS custom properties from `:root` (e.g., `var(--accent-primary)`)
- **DO** use category color tokens from `TOKENS.md` for category-specific styling
- **NEVER** hardcode hex values (`#f5a623`, `#10b981`, etc.) outside of `:root` definitions
- **NEVER** hardcode `rgba()` / `rgb()` / `hsl()` outside of `:root` definitions
- **EXCEPTION:** `#fff` and `#000` in CSS gradient masks (`linear-gradient(#fff 0 0)`) are allowed with `/* ds-exception: gradient-mask */`

## Typography

- **DO** use `var(--font-display)` for headings and brand text
- **DO** use `var(--font-body)` for body text (inherited from `body` rule)
- **NEVER** hardcode font-family values in component styles
- **DO** use `clamp()` for fluid font sizing on hero/display text

## Spacing

- **DO** use `rem` units for spacing and sizing
- **NEVER** use `px` for spacing (padding, margin, gap) — exception: borders (`1px solid`), tiny decorative elements (`6px` dots)
- **EXCEPTION:** `px` allowed for `border-width`, `border-radius` on small decorative elements, `box-shadow` offsets

## Layout

- **DO** use `max-width: 1400px` for content containers
- **DO** use CSS Grid or Flexbox — never floats
- **DO** use `auto-fill` or `auto-fit` with `minmax()` for responsive grids

## Animations

- **DO** use `var(--ease-out-expo)` or `var(--ease-out-back)` for transitions
- **DO** keep transition durations between 0.2s and 0.5s
- **NEVER** use `ease` or `linear` for UI transitions (only for infinite animations like pulses)

## Borders & Surfaces

- **DO** use `var(--border-subtle)` or `var(--border-accent)` for borders
- **DO** use `var(--bg-card)` / `var(--bg-card-hover)` for card surfaces
- **DO** use `backdrop-filter: blur()` for glass effects

## Responsive

- **DO** use breakpoints: `1024px` (tablet), `768px` (small tablet), `640px` (mobile)
- **DO** use mobile-first approach where practical
- **NEVER** add breakpoints outside the standard set without documenting why

## Machine Enforcement

```bash
# Check all files
npm run lint:design-system

# Check staged files only (pre-commit)
npm run lint:design-system:staged
```

Violations block commits via pre-commit hook.
