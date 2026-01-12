# CSS Architecture Planning

**Last Updated**: December 17, 2025  
**Status**: Research & Design Phase

## Current State Analysis

### Organization Structure

```
src/styles/
├── index.css              # Main entry point (imports all others)
├── base/                  # Foundation layer
│   ├── _reset.css         # CSS reset
│   ├── _typography.css    # Type scale & font stack
│   ├── _palette.css       # Color design tokens
│   ├── _layout.css        # Layout utilities & breakpoints
│   └── _shadows.css       # Elevation system
└── components/            # Component-specific styles
    ├── header.css
    ├── hero.css
    ├── services.css
    ├── testimonials.css
    ├── about.css
    ├── contact-form.css
    ├── modal.css
    ├── button.css
    └── footer.css
```

### Current Approach
- **No formal methodology** (not BEM, not RSCSS)
- **Component-based file organization** ✅
- **CSS custom properties for theming** ✅
- **Import-based composition** (via `@import`)

---

## Pain Points & Inconsistencies

### 1. Breakpoint Inconsistency
**Priority**: 🔴 Must Fix | Impact: High | Effort: Low

**Problem**: Mixed breakpoint values across components
- Some use `600px` for tablet
- Others use `768px` for tablet
- Breakpoint variables **defined but unused**

```css
/* _layout.css DEFINES these but they're NOT used */
:root {
  --mobile-breakpoint: 480px;
  --tablet-breakpoint: 768px;
  --desktop-breakpoint: 1024px;
}

/* But actual media queries use hardcoded values */
@media (max-width: 600px) { } /* ❌ Should use var */
@media (max-width: 768px) { } /* ❌ Different values */
```

**Solution**: Use PostCSS Custom Media or standardize manually

---

### 2. No Formal Naming Convention
**Priority**: 🟡 Should Have | Impact: Medium | Effort: Medium

**Current Naming** (examples):
```css
.banner-text           /* Component + element */
.service-card          /* Component + variant */
.testimonial-carousel  /* Component + type */
.cta-button            /* Abbreviation + component */
```

**Inconsistencies**:
- No clear parent-child relationship in names
- Mix of `kebab-case` conventions
- Unclear scope boundaries

---

### 3. Media Query Syntax Inconsistency
**Priority**: 🟢 Nice to Have | Impact: Low | Effort: Low

**Three different styles found**:
```css
@media screen and (max-width: 1024px) { }
@media only screen and (max-width: 768px) { }
@media (max-width: 600px) { }
```

**Recommendation**: Standardize on `@media (min/max-width)` (simplest, most modern)

---

### 4. Hardcoded Spacing Values
**Priority**: 🟡 Should Have | Impact: Medium | Effort: Medium

**Problem**: Magic numbers without systematic spacing scale

```css
padding: 2rem;
margin-bottom: 4rem;
gap: 1rem;
padding: 0.75rem 1.5rem;
```

**Solution**: Define spacing scale in `:root`

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 4rem;      /* 64px */
  --space-2xl: 8rem;     /* 128px */
}
```

---

## Proposed: RSCSS Methodology

**RSCSS** = Reasonable System for CSS Stylesheet Structure

### Why RSCSS?

| Criteria | BEM | RSCSS | Current |
|----------|-----|-------|---------|
| **Learning Curve** | Medium | Low | N/A |
| **Verbosity** | High | Low | Medium |
| **Scoping** | Class-based | Element + class | Mixed |
| **Nesting** | Discouraged | Encouraged | Used |
| **Flexibility** | Rigid | Flexible | Too flexible |

**Key RSCSS Principles**:
1. **Components** are named with at least two words (`contact-form`, `service-card`)
2. **Elements** use direct child selectors and single-word classes (`> .title`, `> .description`)
3. **Variants** use dash prefixes (`-primary`, `-large`, `-active`)
4. **Helpers** use underscores (`_text-center`, `_mt-large`)

### RSCSS Example

#### Before (Current)
```css
.service-card {
  background: white;
  padding: 2rem;
}

.service-card-title {
  font-size: var(--font-size-4);
}

.service-card-description {
  color: var(--text-light);
}

.service-card.featured {
  border: 2px solid var(--primary);
}
```

#### After (RSCSS)
```css
.service-card {
  background: white;
  padding: var(--space-lg);
}

.service-card > .title {
  font-size: var(--font-size-4);
}

.service-card > .description {
  color: var(--text-light);
}

.service-card.-featured {
  border: 2px solid var(--primary);
}
```

**Benefits**:
- ✅ Clearer parent-child relationships
- ✅ Less verbose class names
- ✅ Easier to understand component boundaries
- ✅ Variants are visually distinct (`-prefix`)

---

## Migration Plan to RSCSS

### Phase 1: Establish Guidelines (Week 1)
1. Document RSCSS standards in style guide
2. Create component audit checklist
3. Set up linting rules (if using Stylelint)

### Phase 2: Refactor Base Styles (Week 2)
**Priority Order**:
1. Update `_layout.css` with proper spacing scale
2. Standardize media query syntax
3. Create helper classes (`_mt-large`, `_text-center`)

### Phase 3: Migrate Components One-by-One (Weeks 3-6)
**Suggested Order** (lowest risk → highest risk):
1. ✅ `button.css` - Simple, isolated
2. ✅ `modal.css` - Low page presence
3. ✅ `footer.css` - Static, simple
4. ⚠️ `hero.css` - High visibility
5. ⚠️ `header.css` - Complex state (mobile menu)
6. ⚠️ `services.css` - Many elements
7. ⚠️ `testimonials.css` - Carousel integration
8. ⚠️ `contact-form.css` - Form validation states
9. ⚠️ `about.css` - Layout complexity

**Migration Checklist per Component**:
- [ ] Identify all class names used
- [ ] Map to RSCSS structure (component > element, variants)
- [ ] Update CSS file
- [ ] Update HTML/JS references
- [ ] Test across all breakpoints
- [ ] Update component tests (if class names change)
- [ ] Visual regression test (screenshot comparison)

---

## Responsive Design Standards

### Breakpoint Strategy

**Standardized Breakpoints** (Mobile-First):

```css
/* _layout.css */
:root {
  --breakpoint-sm: 480px;   /* Large phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Small laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
}
```

**Usage Pattern** (with PostCSS Custom Media):

```css
/* Define once in _layout.css */
@custom-media --sm (min-width: 480px);
@custom-media --md (min-width: 768px);
@custom-media --lg (min-width: 1024px);
@custom-media --xl (min-width: 1280px);

/* Use everywhere */
.service-card {
  grid-template-columns: 1fr;
  
  @media (--md) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (--lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Without PostCSS** (Manual approach):

```css
.service-card {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .service-card {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .service-card {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

### Responsive Typography

**Current**: Using `clamp()` for fluid typography ✅

```css
--font-size-1: clamp(14px, 1.6rem, 16px);
--font-size-5: clamp(2rem, 5vw, 2.95rem);
```

**Enhancement**: Responsive line-height and spacing

```css
:root {
  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
}

h1, h2, h3 {
  line-height: var(--line-height-tight);
}

p, li {
  line-height: var(--line-height-base);
  
  @media (--md) {
    line-height: var(--line-height-relaxed); /* More comfortable reading on larger screens */
  }
}
```

---

### Container Queries (Future Enhancement)

**Priority**: 🟢 Nice to Have | Impact: Low | Effort: Medium

**Use Case**: Component adapts to container width, not viewport width

**Browser Support**: Chrome 105+, Safari 16+, Firefox 110+ (as of 2024)

```css
.service-card {
  container-type: inline-size;
}

.service-card > .title {
  font-size: var(--font-size-3);
}

@container (min-width: 500px) {
  .service-card > .title {
    font-size: var(--font-size-5);
  }
}
```

**When to Implement**: After browser support reaches >95% (check caniuse.com)

---

## Design Token System

### Current Tokens ✅

**Color Palette** (`_palette.css`):
- ✅ Full spectrum (50-950 scale)
- ✅ Semantic naming (`--primary`, `--secondary`, `--accent`)
- ✅ Background and text colors

**Typography** (`_typography.css`):
- ✅ Modular scale (1.333 ratio)
- ✅ 10-step font size scale
- ✅ Font family variables

**Shadows** (`_shadows.css`):
- ✅ Three elevation levels

### Missing Tokens

#### 1. Spacing Scale
**Priority**: 🔴 Must Have | Impact: High | Effort: Low

```css
/* Add to _layout.css */
:root {
  /* Base unit: 4px */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  
  /* Semantic aliases */
  --space-xs: var(--space-2);
  --space-sm: var(--space-4);
  --space-md: var(--space-6);
  --space-lg: var(--space-8);
  --space-xl: var(--space-12);
  --space-2xl: var(--space-16);
  --space-3xl: var(--space-24);
}
```

#### 2. Border Radius Scale
**Priority**: 🟡 Should Have | Impact: Low | Effort: Low

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Pills/circles */
}
```

#### 3. Transition Durations
**Priority**: 🟡 Should Have | Impact: Low | Effort: Low

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
  
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Usage**:
```css
.button {
  transition: all var(--duration-base) var(--ease-out);
}
```

#### 4. Z-Index Scale
**Priority**: 🟡 Should Have | Impact: Medium | Effort: Low

**Problem**: Avoid magic numbers like `z-index: 999`

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
}
```

---

## PostCSS Integration

**Priority**: 🔴 Should Have | Impact: High | Effort: Low

### Recommended Plugins

```bash
npm install -D postcss autoprefixer postcss-preset-env postcss-custom-media cssnano
```

### Configuration

```javascript
// postcss.config.js
export default {
  plugins: {
    'postcss-preset-env': {
      stage: 3, // Modern CSS features (nesting, custom media)
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
      }
    },
    'autoprefixer': {},
    'cssnano': {
      preset: ['default', {
        discardComments: { removeAll: true }
      }]
    }
  }
}
```

### Benefits
- ✅ **Custom Media Queries**: Use `@media (--md)` instead of hardcoded breakpoints
- ✅ **CSS Nesting**: Native nesting support (like Sass)
- ✅ **Autoprefixer**: Automatic vendor prefixes
- ✅ **Minification**: Smaller bundle size

---

## CSS Organization Best Practices

### Import Order (index.css)

```css
/* 1. Base layer (no specificity) */
@import 'base/_reset.css';
@import 'base/_palette.css';
@import 'base/_typography.css';
@import 'base/_layout.css';
@import 'base/_shadows.css';

/* 2. Helpers (single-purpose utilities) */
@import 'helpers/_spacing.css';
@import 'helpers/_text.css';
@import 'helpers/_visibility.css';

/* 3. Components (specific styles) */
@import 'components/button.css';
@import 'components/header.css';
@import 'components/hero.css';
@import 'components/services.css';
@import 'components/testimonials.css';
@import 'components/about.css';
@import 'components/contact-form.css';
@import 'components/modal.css';
@import 'components/footer.css';
```

### File Naming Conventions

- **Base files**: Prefix with `_` (e.g., `_reset.css`, `_palette.css`)
- **Component files**: No prefix (e.g., `button.css`, `modal.css`)
- **Helper files**: Prefix with `_` (e.g., `_spacing.css`, `_text.css`)

### Selector Specificity Guidelines

**Keep specificity low** for easier overrides:

```css
/* ❌ Too specific */
.header .nav .nav-list .nav-item a.nav-link { }

/* ✅ Better (RSCSS) */
.header > .nav > .link { }

/* ✅ Even better (single class) */
.nav-link { }
```

**Specificity Order** (lowest to highest):
1. Element selectors: `div`, `p`, `a`
2. Class selectors: `.button`, `.header`
3. ID selectors: `#main` (avoid for styling)
4. Inline styles: `style=""` (avoid)

---

## Accessibility Considerations

### 1. Focus Styles
**Priority**: 🔴 Must Have | Impact: High | Effort: Low

**Current**: Basic focus outline

**Enhancement**: Custom focus ring with `focus-visible`

```css
:root {
  --focus-ring: 0 0 0 3px var(--primary-200);
}

/* Remove default outline */
*:focus {
  outline: none;
}

/* Custom focus ring (keyboard only) */
*:focus-visible {
  box-shadow: var(--focus-ring);
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 2. Motion Preferences
**Priority**: 🔴 Must Have | Impact: High | Effort: Low

**Current**: Basic `prefers-reduced-motion` in reset ✅

**Enhancement**: Apply to all animations

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Color Contrast
**Priority**: 🔴 Must Have | Impact: High | Effort: Medium

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Action Items**:
- [ ] Audit all text/background combinations
- [ ] Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- [ ] Document contrast ratios in `_palette.css` comments

---

## Performance Optimizations

### 1. Critical CSS Extraction
**Priority**: 🟡 Could Have | Impact: Medium | Effort: Medium

**Tool**: `vite-plugin-critical` or manual extraction

**Goal**: Inline above-the-fold CSS, defer the rest

### 2. CSS Bundle Analysis
**Priority**: 🟡 Could Have | Impact: Low | Effort: Low

**Tool**: `bundle-analyzer` or manual inspection

**Questions**:
- What's the current CSS bundle size?
- Which components contribute most to size?
- Are there unused styles?

### 3. Font Loading Strategy
**Priority**: 🟡 Should Have | Impact: Medium | Effort: Low

**Current**: Google Fonts (`Noto Sans`)

**Enhancement**: Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## Component Audit Checklist

Use this checklist when refactoring each component:

### Structure
- [ ] Follows RSCSS naming (component-name, > .element, .-variant)
- [ ] Uses design tokens (no magic numbers)
- [ ] Mobile-first media queries
- [ ] Consistent breakpoint usage

### Responsiveness
- [ ] Tested at 320px (small mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1024px (desktop)
- [ ] Tested at 1920px (large desktop)
- [ ] No horizontal scroll at any size

### Accessibility
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Clear focus states
- [ ] Respects `prefers-reduced-motion`
- [ ] Text remains readable when zoomed to 200%

### Performance
- [ ] No complex selectors (specificity < 0-3-0)
- [ ] Minimal use of expensive properties (box-shadow, filter)
- [ ] Uses hardware-accelerated properties for animations (transform, opacity)

### Maintainability
- [ ] Clear comments for complex logic
- [ ] Consistent formatting (Prettier)
- [ ] No `!important` (except for helpers)
- [ ] Follows file organization standards

---

## Timeline & Priorities

### Immediate (This Quarter)
1. ✅ **Standardize breakpoints** - Replace all hardcoded values
2. ✅ **Add spacing scale** - Eliminate magic numbers
3. ✅ **PostCSS setup** - Enable modern CSS features
4. ✅ **Create style guide document** - Reference for team

### Short-term (Next Quarter)
5. ⚙️ **Migrate to RSCSS** - One component per week
6. ⚙️ **Add missing design tokens** (border-radius, transitions, z-index)
7. ⚙️ **Audit accessibility** - Contrast, focus states, motion

### Long-term (6+ months)
8. 🔮 **Container queries** - When browser support improves
9. 🔮 **CSS-in-JS evaluation** - If moving to React/Vue
10. 🔮 **Design system library** - If building multiple sites

---

## Resources

- [RSCSS Documentation](https://rscss.io/)
- [PostCSS Custom Media](https://github.com/postcss/postcss-custom-media)
- [Modern CSS Reset](https://piccalil.li/blog/a-more-modern-css-reset/)
- [Inclusive Components](https://inclusive-components.design/)
- [Smashing Magazine: CSS Architecture](https://www.smashingmagazine.com/2016/06/css-architecture-topics/)
