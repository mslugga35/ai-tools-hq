# AI Tools HQ — Interaction Patterns
> How components behave and are composed.

## Card Pattern
Used for: ToolCard, comparison cards, category cards

```
Structure:
- Container with `var(--bg-card)` background
- 1px `var(--border-subtle)` border
- Border-radius: 1rem (16px)
- Hover: background shifts to `var(--bg-card-hover)`, subtle translateY(-2px)
- Optional: accent glow on hover via box-shadow with `var(--accent-glow)`
```

## Button Pattern
Two variants:

### Primary (CTA)
```
- Background: var(--accent-primary)
- Text: var(--bg-primary) (dark on orange)
- Border-radius: 50px (pill)
- Hover: background to var(--accent-secondary), scale(1.05), glow shadow
- Transition: all 0.3s var(--ease-out-expo)
```

### Ghost
```
- Background: transparent or var(--bg-card)
- Border: 1px solid var(--border-accent)
- Text: var(--text-primary)
- Hover: background to var(--bg-card-hover)
- Transition: all 0.3s var(--ease-out-expo)
```

## Badge Pattern
Used for: Editor's Pick, Popular, pricing tier, category labels

```
- Small text (0.7-0.8rem), font-weight 500-600
- Padding: 0.25rem 0.75rem
- Border-radius: 50px (pill)
- Background: semi-transparent accent or category color
- Text: matching accent color
```

## Glass Surface Pattern
Used for: nav bar, modal overlays

```
- Background: var(--bg-card) or rgba with low alpha
- backdrop-filter: blur(20px)
- Border: 1px solid var(--border-subtle)
- Border-radius: contextual (100px for nav, 1rem for panels)
```

## Form Input Pattern
Used for: search, newsletter, admin forms

```
- Background: var(--bg-card) (or create a --bg-input token if needed)
- Border: 1px solid var(--border-subtle)
- Border-radius: 50px (pill for single-line), 1rem (for textareas)
- Focus: border-color to var(--accent-primary), glow shadow
- Text: var(--text-primary)
- Placeholder: var(--text-muted)
```

## Hover State Contract
All interactive elements must have:
1. A visible hover state change (color, background, or transform)
2. Transition using `var(--ease-out-expo)` at 0.3s
3. No jarring jumps — prefer subtle transforms over color-only changes

## Responsive Grid Pattern
```
Desktop: repeat(auto-fill, minmax(320px, 1fr)) — typically 3-4 columns
Tablet (1024px): 2 columns or reduce minmax
Mobile (640px): 1 column, full width
```

## Animation Entry Pattern
New page sections use staggered fade-up:
```
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

- Each child gets animation-delay: calc(index * 0.1s)
- Duration: 0.6s-0.8s
- Easing: var(--ease-out-expo)
```

## Page Layout Contract
```
- Max content width: 1400px, centered with margin: 0 auto
- Side padding: 2rem (desktop), 1rem (mobile)
- Section spacing: 4-6rem between major sections
- Header: fixed, z-index 100, gradient fade background
- Footer: var(--bg-secondary), border-top var(--border-subtle)
```
