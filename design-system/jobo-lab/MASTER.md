# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** JOBO Lab
**Updated:** 2026-09-02
**Category:** Portfolio/Personal
**Design Dials:** Variance 2/10 (Centered / Minimal) | Motion 2/10 (Subtle) | Density 3/10 (Spacious)

---

## Global Rules

### Color Palette

| Role        | Hex       | CSS Variable          |
| ----------- | --------- | --------------------- |
| Primary     | `#3C3C43` | `--color-primary`     |
| On Primary  | `#FFFFFF` | `--color-on-primary`  |
| Secondary   | `#67676C` | `--color-secondary`   |
| Accent/CTA  | `#3451B2` | `--color-accent`      |
| Background  | `#FFFFFF` | `--color-background`  |
| Foreground  | `#3C3C43` | `--color-foreground`  |
| Muted       | `#F6F6F7` | `--color-muted`       |
| Border      | `#E2E2E3` | `--color-border`      |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring        | `#3451B2` | `--color-ring`        |

**Color Notes:** Reference-inspired documentation palette: white canvas, soft gray surfaces, restrained blue accent.

### Typography

- **Heading Font:** Inter, with Noto Sans SC and system fallbacks for Chinese
- **Body Font:** Inter, with Noto Sans SC and system fallbacks for Chinese
- **Mood:** restrained, editorial, clear, efficient
- **Performance:** Use local/system font stacks; do not add a remote font import.

### Spacing Variables

_Density: 3/10 — Spacious_

| Token         | Value             | Usage                     |
| ------------- | ----------------- | ------------------------- |
| `--space-xs`  | `4px` / `0.25rem` | Tight gaps                |
| `--space-sm`  | `8px` / `0.5rem`  | Icon gaps, inline spacing |
| `--space-md`  | `24px` / `1.5rem` | Standard padding          |
| `--space-lg`  | `32px` / `2rem`   | Section padding           |
| `--space-xl`  | `48px` / `3rem`   | Large gaps                |
| `--space-2xl` | `64px` / `4rem`   | Section margins           |
| `--space-3xl` | `96px` / `6rem`   | Hero padding              |

### Shadow Depths

| Level         | Value                          | Usage                       |
| ------------- | ------------------------------ | --------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift                 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons              |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns           |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #3451b2;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #3c3c43;
  border: 1px solid #e2e2e3;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #f6f6f7;
  border-radius: 12px;
  padding: 24px;
  box-shadow: none;
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  border-color: #e2e2e3;
  box-shadow: 0 8px 24px rgb(60 60 67 / 8%);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #e2e2e3;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #3451b2;
  outline: none;
  box-shadow: 0 0 0 3px #3451b220;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Restrained documentation minimalism

**Keywords:** White canvas, soft gray cards, blue accent, editorial type scale, useful whitespace

**Best For:** Personal labs, documentation, product portfolios, small studios

**Key Effects:** Clear hierarchy, restrained contrast, rounded cards, no decorative UI

### Page Pattern

**Pattern Name:** Flat portfolio landing page

- **Conversion Strategy:** State the work clearly, then expose the one relevant project and contact paths.
- **CTA Placement:** External project link and fixed navigation contacts
- **Section Order:** 1. Hero, 2. Project card, 3. Product/service cards

---

## Motion

**Scroll Reveal** (Subtle) — Trigger: scroll (viewport enter) | Duration: 300-400ms | Easing: `power1.out`

```js
gsap.from(el, {
  opacity: 0,
  y: 12,
  duration: 0.35,
  ease: "power1.out",
  scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
})
```

**Framework notes:** Requires the ScrollTrigger plugin registered once via gsap.registerPlugin(ScrollTrigger)

- ✅ Keep the y offset small (8-16px) so it reads as a fade, not a slide
- ❌ Don't reveal below-the-fold content needed for SEO/crawlers as invisible-by-default without a no-JS fallback
- ⚡ toggleActions 'play none none reverse' avoids re-triggering on every scroll direction change

---

## Anti-Patterns (Do NOT Use)

- ❌ Corporate templates
- ❌ Generic layouts

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
