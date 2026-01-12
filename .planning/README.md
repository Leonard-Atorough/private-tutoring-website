# Private Tutoring Website - Planning & Roadmap

**Last Updated**: December 17, 2025

## Overview

This directory contains strategic planning documents for the evolution and enhancement of the private tutoring website. All planning follows a data-driven, user-centered approach with careful consideration of technical feasibility and business impact.

## Document Structure

### Core Planning Documents

- **[tech-stack.md](tech-stack.md)** - Technology stack evaluation and migration strategies
- **[css-architecture.md](css-architecture.md)** - CSS methodology improvements and responsive design standards
- **[features-roadmap.md](features-roadmap.md)** - Feature prioritization and phased implementation timeline
- **[ux-improvements.md](ux-improvements.md)** - User experience enhancements and design refinements

### Supporting Folders

- **`research/`** - Competitive analysis, user research findings, and market insights
- **`prototypes/`** - Design mockups, wireframes, and interactive prototypes
- **`decisions/`** - Architectural Decision Records (ADRs) documenting key technical choices

## Prioritization Framework

All improvements are evaluated using a **MoSCoW + Impact/Effort Matrix**:

### MoSCoW Classification

- **Must Have** - Critical for site functionality or business goals
- **Should Have** - Important but not vital; has workarounds
- **Could Have** - Desirable but lower priority
- **Won't Have** - Out of scope for current planning horizon

### Impact/Effort Matrix

Each item is rated on two dimensions:

**Impact** (Business/User Value):
- 🔴 **High** - Significant improvement to conversion, UX, or maintainability
- 🟡 **Medium** - Moderate improvement to user experience or development workflow
- 🟢 **Low** - Nice-to-have enhancement with minimal measurable impact

**Effort** (Development Complexity):
- 🔴 **High** - Requires significant refactoring, new infrastructure, or external services
- 🟡 **Medium** - Moderate development time with some complexity
- 🟢 **Low** - Quick implementation with minimal technical risk

### Priority Scoring

Items are prioritized as: **Quick Wins** (High Impact, Low Effort) > **Major Projects** (High Impact, High Effort) > **Fill-ins** (Low Impact, Low Effort) > **Avoid** (Low Impact, High Effort)

## Implementation Approach

### Phased Rollout Strategy

All improvements follow an **incremental, non-disruptive approach**:

1. **Research & Planning** - Document current state, define success metrics
2. **Prototype & Test** - Build proof-of-concept in isolated environment
3. **Staged Implementation** - Deploy to development → staging → production
4. **Monitor & Iterate** - Track metrics, gather feedback, refine

### Change Management

- **Backward Compatibility** - Maintain existing functionality during migrations
- **Feature Flags** - Use conditional logic to test new features with subset of users
- **Rollback Plan** - Document reversion steps for each major change
- **Documentation** - Update technical docs and user guides alongside code changes

## Success Metrics

### Key Performance Indicators (KPIs)

**Business Metrics**:
- Booking conversion rate (form submissions → scheduled sessions)
- Bounce rate and average session duration
- Mobile vs. desktop engagement

**Technical Metrics**:
- Page load time (target: <2s on 3G)
- Lighthouse scores (Performance, Accessibility, SEO, Best Practices)
- CSS bundle size and code coverage
- Test coverage percentage

**User Experience Metrics**:
- Form completion rate
- Navigation patterns (heatmaps/analytics)
- Error rates and user frustration signals

## Current State Summary

### Tech Stack (Dec 2025)
- **Build**: Vite 7.1.7 (ES Modules)
- **Framework**: Vanilla JavaScript (zero dependencies)
- **Testing**: Vitest 3.2.4 + jsdom 27.0.0
- **Hosting**: Netlify
- **Analytics**: Plausible.io

### Strengths
✅ Excellent performance (no framework overhead)  
✅ Comprehensive accessibility (ARIA, keyboard nav)  
✅ High test coverage across components  
✅ Modern CSS with design tokens  
✅ SEO optimized (structured data, sitemap)

### Known Issues
⚠️ Content hardcoded in HTML (JSON files unused)  
⚠️ Inconsistent CSS breakpoints (600px vs 768px)  
⚠️ No formal CSS methodology (BEM/RSCSS)  
⚠️ Breakpoint variables defined but not used in media queries  
⚠️ Incomplete test coverage for focus trapping

## Review Cadence

- **Quarterly Reviews** - Reassess priorities based on business goals and user feedback
- **Monthly Updates** - Update progress on active roadmap items
- **Ad-hoc Additions** - Document new ideas in respective planning docs with priority labels

## Contributing to Planning

When adding new ideas:

1. Choose the appropriate planning document
2. Include MoSCoW classification and Impact/Effort rating
3. Provide context: What problem does this solve? Who benefits?
4. Define success criteria: How will we measure improvement?
5. Consider dependencies: What must happen first?

---

**Questions or suggestions?** Open an issue or update the relevant planning document directly.
