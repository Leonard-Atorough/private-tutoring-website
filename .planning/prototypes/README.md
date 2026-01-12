# Prototypes

This folder contains design mockups, wireframes, and interactive prototypes for proposed features and design changes.

## Folder Contents

### Wireframes
- **`wireframes/`** - Low-fidelity sketches and layouts
  - Mobile layouts
  - Desktop layouts
  - User flow diagrams

### Mockups
- **`mockups/`** - High-fidelity visual designs
  - Component designs
  - Full page designs
  - Style guide samples

### Interactive Prototypes
- **`prototypes/`** - Clickable prototypes (Figma, Adobe XD, etc.)
  - Link to prototype tools
  - Exported HTML/CSS demos

### Design Assets
- **`assets/`** - Source files for designs
  - Figma files (links)
  - Sketch files
  - Adobe XD files
  - Icon sets
  - Illustration files

## Design Tools

Recommended tools for creating prototypes:

### Free Tools
- **Figma** (free tier, collaborative, browser-based)
- **Penpot** (open-source Figma alternative)
- **Excalidraw** (quick sketches and diagrams)
- **Canva** (quick mockups, non-technical)

### Paid Tools
- **Adobe XD** (industry standard, part of Creative Cloud)
- **Sketch** (Mac only, industry standard)
- **InVision** (prototyping and collaboration)

### Code-Based Prototypes
- **CodePen** - Quick HTML/CSS/JS demos
- **CodeSandbox** - Full React/Vue/Vanilla JS prototypes
- **Stackblitz** - Browser-based development environment

## Prototype Workflow

### 1. Wireframe (Low-Fidelity)
**Goal**: Quickly explore layout and information architecture  
**Tools**: Excalidraw, pen & paper, Figma  
**Output**: Simple boxes and text, no colors/styles

**Example**: Mobile navigation menu layout (hamburger menu vs. bottom nav)

### 2. Mockup (High-Fidelity)
**Goal**: Apply brand colors, typography, and visual design  
**Tools**: Figma, Sketch, Adobe XD  
**Output**: Pixel-perfect designs ready for development

**Example**: Fully designed contact form with colors, shadows, buttons

### 3. Interactive Prototype
**Goal**: Simulate user interactions and test flows  
**Tools**: Figma (prototype mode), CodePen, CodeSandbox  
**Output**: Clickable demo showing how features work

**Example**: Booking modal with form validation states

### 4. User Testing
**Goal**: Get feedback before development  
**Method**: Share prototype with users, observe and gather feedback  
**Output**: Testing notes and iteration plan

### 5. Handoff to Development
**Goal**: Developers implement the approved design  
**Deliverables**:
- Design specs (spacing, colors, fonts)
- Assets (images, icons, logos)
- Interaction notes (hover states, animations)
- Prototype link for reference

## Current Prototype Priorities

### Phase 1: Quick Wins (Q1 2026)
- [ ] Enhanced contact form (validation states, success/error messages)
- [ ] Dynamic content rendering (testimonials, services layout)
- [ ] Mobile navigation improvements (animated hamburger, backdrop)

### Phase 2: Growth Features (Q2-Q3 2026)
- [ ] Student portal dashboard
- [ ] Booking calendar integration UI
- [ ] Session notes/feedback interface
- [ ] Payment checkout flow

### Phase 3: Advanced Features (Q4 2026+)
- [ ] Multi-tutor browsing and filtering
- [ ] Admin dashboard
- [ ] Video conferencing integration UI

## Design System Preview

As prototypes are created, extract reusable patterns into a design system:

### Components to Design
- **Buttons** (primary, secondary, tertiary, sizes, states)
- **Forms** (inputs, textareas, selects, validation states)
- **Cards** (service card, testimonial card, tutor profile card)
- **Modals** (booking modal, success modal, confirmation dialog)
- **Navigation** (header, mobile menu, footer)
- **Feedback** (toasts, alerts, banners, loading spinners)

### Design Tokens
- **Colors** (already defined in CSS)
- **Typography** (already defined in CSS)
- **Spacing** (needs formalization)
- **Shadows** (already defined in CSS)
- **Border Radius** (needs formalization)
- **Transitions** (needs formalization)

## Prototype Naming Convention

Use descriptive names with version numbers:

```
[feature]-[type]-[version]-[date].ext

Examples:
- contact-form-wireframe-v1-2026-01-15.fig
- student-portal-mockup-v2-2026-03-20.fig
- booking-modal-prototype-v1-2026-02-10.html
```

## Prototype Documentation Template

For each prototype, create a README or description:

```markdown
# [Feature Name] Prototype

**Version**: v1  
**Date**: 2026-XX-XX  
**Designer**: Name  
**Status**: Draft / Review / Approved / Implemented  

## Purpose
What problem does this design solve?

## User Story
As a [user type], I want to [goal] so that [benefit].

## Design Decisions
- Decision 1 and rationale
- Decision 2 and rationale
- Decision 3 and rationale

## Prototype Link
[Figma link / CodePen link / etc.]

## Feedback Received
- Feedback 1 (from user testing)
- Feedback 2 (from stakeholder review)

## Next Steps
- [ ] Address feedback
- [ ] Create high-fidelity mockup
- [ ] Get final approval
- [ ] Hand off to development

## Implementation Notes
Technical considerations for developers:
- Animation timing: 300ms ease-out
- Breakpoint: 768px (mobile → desktop)
- Accessibility: Ensure focus states are visible
```

## Resources

### Inspiration
- **Dribbble** - Design inspiration
- **Behance** - Portfolio showcases
- **Awwwards** - Award-winning web design
- **SiteInspire** - Curated website gallery

### UI Kits & Templates
- **Figma Community** - Free UI kits and templates
- **UI8** - Premium design resources
- **Mobbin** - Mobile app design patterns

### Learning
- **Figma YouTube Channel** - Tutorials and tips
- **Refactoring UI** - Design tips for developers
- **Laws of UX** - Psychology-based design principles

---

**Note**: Always save source files and maintain version history. Use collaborative tools (like Figma) to enable feedback and iteration.
