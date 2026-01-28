# Tech Stack Planning

**Last Updated**: December 17, 2025  
**Status**: Research Phase

## Current Architecture

### Build & Development
- **Bundler**: Vite 7.1.7
- **Language**: Vanilla JavaScript (ES Modules)
- **Package Manager**: npm
- **Runtime Dependencies**: None (zero-dependency approach)

### Testing
- **Framework**: Vitest 3.2.4
- **Environment**: jsdom 27.0.0
- **Coverage**: @vitest/coverage-v8
- **Coverage Target**: >80% across all components

### Hosting & Infrastructure
- **Platform**: Netlify
- **Domain**: kailistacey.com
- **Analytics**: Plausible.io
- **SEO**: Google Search Console, structured data (JSON-LD)

### Current Pain Points
1. **Content Management** - No CMS; content changes require code deployment
2. **JSON Files Unused** - About/Services/Testimonials JSON exist but aren't rendered dynamically
3. **No Type Safety** - Pure JavaScript without TypeScript
4. **Manual Deployment** - No preview environments for testing changes

---

## Proposed Improvements

### 1. Dynamic Content Rendering System

**Priority**: 🔴 Must Have | Impact: High | Effort: Low

**Problem**: Content files (`about.json`, `services.json`, `testimonials.json`) exist but are unused. All content is hardcoded in HTML, making updates cumbersome.

**Solution Options**:

#### Option A: Vanilla JS Rendering (Recommended for Now)
```javascript
// src/lib/content/renderer.js
export async function renderServices(containerSelector) {
  const response = await fetch('/content/services.json');
  const services = await response.json();
  // Generate DOM elements dynamically
}
```

**Pros**:
- Zero additional dependencies
- Maintains current performance
- Simple to implement (<2 hours)
- Keeps existing build pipeline

**Cons**:
- Manual JSON editing still required
- No validation beyond JSON syntax
- No content preview

**Migration Path**:
1. Create rendering functions for each content type
2. Update HTML to use content containers (data attributes)
3. Initialize renderers on page load
4. Test with existing JSON files
5. Remove hardcoded content from HTML

---

#### Option B: Headless CMS Integration
**Tools to Evaluate**: Sanity.io, Contentful, Strapi (self-hosted)

**Priority**: 🟡 Should Have | Impact: High | Effort: High

**Benefits**:
- Non-technical content editing (client can update testimonials, services)
- Content versioning and drafts
- Media management (optimized images)
- Multi-user collaboration
- Structured content with validation

**Trade-offs**:
- Monthly cost ($0-99/mo depending on CMS)
- Build time increases (static generation)
- New dependency to manage
- Learning curve for content editors

**Recommended**: **Sanity.io**
- **Free tier**: Generous limits for small sites
- **Developer experience**: Excellent (GROQ queries)
- **React-based Studio**: Can be self-hosted
- **Image CDN**: Automatic optimization
- **TypeScript support**: Built-in

**Implementation Estimate**: 2-3 weeks
- Week 1: Schema design, Sanity setup, content migration
- Week 2: Frontend integration, build pipeline updates
- Week 3: Testing, client training, deployment

**ADR Needed**: Yes → `decisions/001-headless-cms-selection.md`

---

### 2. Framework Evaluation: Stay Vanilla vs. Adopt Framework

**Priority**: 🟡 Could Have | Impact: Medium | Effort: High

**Current Vanilla JS Strengths**:
- ✅ Zero runtime overhead (faster page loads)
- ✅ No framework lock-in
- ✅ Simple mental model
- ✅ Excellent for SEO (static HTML)

**When to Consider a Framework**:
- Site grows beyond 10 interactive components
- Need complex state management across components
- Want component reusability and composition
- Team prefers modern DX (hot reload, dev tools)

#### Framework Options Analysis

| Framework | Bundle Size | Learning Curve | SSR/SSG | Best For |
|-----------|-------------|----------------|---------|----------|
| **React** | ~42KB (gzipped) | Medium | Yes (Next.js) | Large apps, rich ecosystem |
| **Vue 3** | ~33KB (gzipped) | Low-Medium | Yes (Nuxt) | Progressive enhancement |
| **Svelte** | ~2KB (compiled) | Low | Yes (SvelteKit) | Performance-critical sites |
| **Astro** | ~0KB (partial hydration) | Low | Yes (built-in) | Content-heavy sites |

**Recommendation**: **Stay Vanilla for Now, Evaluate Astro in 2026**

**Reasoning**:
1. Current site is simple (6 components, minimal state)
2. Performance is excellent (no bundle penalty)
3. **Astro** offers best of both worlds:
   - Write components in React/Vue/Svelte (optional)
   - Ships zero JS by default (partial hydration)
   - Excellent for content-driven sites
   - Can integrate with Sanity/Contentful easily

**When to Revisit**:
- Adding student portal with authentication
- Building admin dashboard
- Need for complex form wizards
- Real-time features (chat, live updates)

---

### 3. TypeScript Migration

**Priority**: 🟢 Could Have | Impact: Medium | Effort: Medium

**Benefits**:
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code (types as documentation)
- Safer refactoring

**Migration Strategy** (Incremental):
1. Rename `vite.config.js` → `vite.config.ts`
2. Add `tsconfig.json` with `"allowJs": true`
3. Convert test files first (`.test.js` → `.test.ts`)
4. Convert utility files (`storeManager.js`, `formStateManager.js`)
5. Convert components one-by-one
6. Enable strict mode gradually

**Estimated Timeline**: 1-2 weeks (can be done incrementally)

**Trade-offs**:
- Build time increases slightly
- Initial learning curve for TS syntax
- May need type definitions for external libraries

**Recommendation**: **Low priority unless team has TS experience**

---

### 4. Build & Performance Optimizations

#### A. Image Optimization Pipeline

**Priority**: 🔴 Should Have | Impact: High | Effort: Low

**Current State**: Manual WebP conversion, both formats committed to repo

**Solution**: **Vite Image Plugin** or **Netlify Image CDN**

**Option 1: vite-plugin-imagemin**
```javascript
// vite.config.js
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  plugins: [
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 }
    })
  ]
}
```

**Option 2: Netlify Image CDN** (Recommended)
```html
<!-- Automatic format selection, lazy loading -->
<img src="/.netlify/images?url=/assets/hero.jpg&w=1200&fit=cover" alt="Hero">
```

**Benefits**:
- Automatic format selection (WebP, AVIF)
- Responsive image sizes
- Lazy loading built-in
- CDN caching

---

#### B. CSS Optimization

**Priority**: 🟡 Should Have | Impact: Medium | Effort: Low

**Tools to Add**:
1. **PostCSS** with plugins:
   - `autoprefixer` - Browser compatibility
   - `cssnano` - Minification
   - `postcss-preset-env` - Modern CSS features

2. **PurgeCSS** - Remove unused CSS (optional if bundle is already small)

**Implementation**:
```javascript
// vite.config.js
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({ preset: 'default' })
      ]
    }
  }
}
```

**Expected Impact**: 20-30% reduction in CSS bundle size

---

#### C. Code Splitting & Lazy Loading

**Priority**: 🟢 Could Have | Impact: Low | Effort: Low

**Current**: All JS loaded upfront (~50KB total)

**Opportunity**: Lazy-load non-critical components

```javascript
// Lazy load modal only when needed
const openBookingModal = async () => {
  const { Modal } = await import('./components/modal/modal.js');
  const modal = new Modal();
  modal.open();
};
```

**Recommended for**:
- Modal (only needed on CTA click)
- Carousel (below fold, can defer)

**Not recommended for**:
- Header (critical for navigation)
- Form handler (needed immediately)

---

### 5. Testing Infrastructure Enhancements

**Priority**: 🟡 Should Have | Impact: Medium | Effort: Low

#### A. Visual Regression Testing

**Tool**: Playwright + Chromatic or Percy

**Use Case**: Catch unintended CSS changes

**Setup**:
```bash
npm install -D @playwright/test
```

**Example Test**:
```javascript
test('homepage matches screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

#### B. E2E Testing

**Priority**: 🟡 Should Have | Impact: Medium | Effort: Medium

**Current Gap**: No end-to-end tests for user flows

**Critical Flows to Test**:
1. Contact form submission
2. Booking modal interaction
3. Mobile navigation menu
4. Carousel auto-advance

**Tool**: Playwright (already evaluating for visual tests)

---

### 6. CI/CD Pipeline

**Priority**: 🔴 Should Have | Impact: High | Effort: Medium

**Current**: Manual git push triggers Netlify build

**Proposed GitHub Actions Workflow**:

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
  
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://deploy-preview-${{ github.event.number }}--kailistacey.netlify.app
          uploadArtifacts: true
```

**Benefits**:
- Prevent broken builds from merging
- Catch performance regressions
- Enforce test coverage thresholds
- Automated accessibility audits

---

### 7. Analytics & Monitoring

**Priority**: 🟡 Should Have | Impact: Medium | Effort: Low

#### Current Setup
- Plausible.io for page views

#### Gaps
- No error tracking
- No performance monitoring
- No user behavior insights (heatmaps)

#### Proposed Additions

**A. Error Tracking**: Sentry (Free tier: 5K errors/month)
```javascript
// main.js
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1
});
```

**B. Performance Monitoring**: Sentry Performance or Web Vitals
```javascript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

**C. User Behavior**: Hotjar or Microsoft Clarity (both free)
- Heatmaps show where users click
- Session recordings reveal UX issues
- Funnel analysis for conversion optimization

---

## Migration Strategy Summary

### Phase 1: Quick Wins (Q1 2026)
**Estimated Time**: 2-3 weeks
- ✅ Implement dynamic content rendering (vanilla JS)
- ✅ Add PostCSS pipeline
- ✅ Set up GitHub Actions CI/CD
- ✅ Integrate Netlify Image CDN
- ✅ Add error tracking (Sentry)

**Impact**: Easier content updates, better performance monitoring

### Phase 2: Infrastructure (Q2 2026)
**Estimated Time**: 4-6 weeks
- ⚙️ Evaluate and integrate headless CMS (Sanity)
- ⚙️ Add E2E tests with Playwright
- ⚙️ Implement visual regression testing
- ⚙️ Add user behavior analytics (Hotjar/Clarity)

**Impact**: Non-technical content editing, higher confidence in deployments

### Phase 3: Future Considerations (H2 2026+)
**Estimated Time**: TBD
- 🔮 TypeScript migration (if complexity increases)
- 🔮 Framework evaluation (Astro, if adding student portal)
- 🔮 Advanced features (authentication, payments)

---

## Decision Log

| Decision | Status | ADR |
|----------|--------|-----|
| Headless CMS selection | Pending | [ADR-001](decisions/001-headless-cms-selection.md) |
| Stay vanilla vs. framework | Decided: Stay vanilla | - |
| Image optimization approach | Decided: Netlify CDN | - |
| TypeScript migration | Deferred to 2026 | - |
| Testing strategy | In progress | [ADR-002](decisions/002-testing-strategy.md) |

---

## Open Questions

1. **Budget constraints**: What's the monthly budget for tools/services? (Impacts CMS, analytics choices)
2. **Content update frequency**: How often will content change? (Justifies CMS investment)
3. **Multi-tutor scaling**: Is this planned? (Would require framework + database)
4. **Client technical comfort**: Can client edit JSON files? (Determines CMS urgency)

---

## Resources

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Sanity.io Pricing](https://www.sanity.io/pricing)
- [Astro Documentation](https://docs.astro.build)
- [Web Vitals](https://web.dev/vitals/)
- [Netlify Image CDN](https://docs.netlify.com/image-cdn/)
