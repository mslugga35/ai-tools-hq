# AI Tools HQ — Design Tokens
> Single source of truth. Defined in `src/layouts/Layout.astro` `:root`.

## Colors

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0b` | Page background |
| `--bg-secondary` | `#111113` | Footer, alternate sections |
| `--bg-card` | `rgba(255,255,255,0.03)` | Card surfaces, nav |
| `--bg-card-hover` | `rgba(255,255,255,0.06)` | Card hover state |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#fafafa` | Headings, primary copy |
| `--text-secondary` | `#a0a0a0` | Descriptions, secondary info |
| `--text-muted` | `#666666` | Captions, meta text |

### Accent
| Token | Value | Usage |
|-------|-------|-------|
| `--accent-primary` | `#f5a623` | CTAs, highlights, active states |
| `--accent-secondary` | `#ff6b35` | Hover accents, gradients |
| `--accent-glow` | `rgba(245,166,35,0.15)` | Box shadows, glow effects |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `--border-subtle` | `rgba(255,255,255,0.08)` | Default borders |
| `--border-accent` | `rgba(255,255,255,0.15)` | Emphasized borders |

### Category Colors (PLANNED — not yet in :root)
> These are currently hardcoded in `ToolCard.astro` lines 27-34.
> Migration: add to `:root` in Layout.astro, then replace hardcoded values.

| Category | Planned Token | Current Hardcoded Value |
|----------|--------------|------------------------|
| Writing | `--cat-writing` | `#10b981` |
| Image | `--cat-image` | `#8b5cf6` |
| Video | `--cat-video` | `#ec4899` |
| Audio | `--cat-audio` | `#06b6d4` |
| Coding | `--cat-coding` | `#f59e0b` |
| Productivity | `--cat-productivity` | `#3b82f6` |
| Marketing | `--cat-marketing` | `#ef4444` |
| Data | `--cat-data` | `#84cc16` |

### Semantic Colors (PLANNED — not yet in :root)
> Migration: add to `:root` in Layout.astro when needed.

| Planned Token | Value | Usage |
|--------------|-------|-------|
| `--success` | `#10b981` | Success states, confirmations |
| `--error` | `#ef4444` | Error states, warnings |

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | `'Instrument Serif', Georgia, serif` | Headings, brand text, section titles |
| `--font-body` | `'DM Sans', -apple-system, sans-serif` | Everything else |

### Font Weights
| Weight | Usage |
|--------|-------|
| 400 | Body text, descriptions |
| 500 | Badges, metadata |
| 600 | Buttons, nav labels, emphasis |
| 700 | Hero headings (rare) |

## Animation

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary transitions (hover, open) |
| `--ease-out-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy entrances (pop-in) |

### Standard Durations
| Duration | Usage |
|----------|-------|
| `0.2s` | Micro-interactions (color change) |
| `0.3s` | Standard transitions (hover, focus) |
| `0.5s` | Larger transitions (expand, slide) |
| `0.8s` | Page-level animations (header fade) |

## Breakpoints

| Name | Value | Usage |
|------|-------|-------|
| Tablet | `1024px` | Nav collapse, grid reflow |
| Small tablet | `768px` | Content reflow |
| Mobile | `640px` | Single column, smaller type |
