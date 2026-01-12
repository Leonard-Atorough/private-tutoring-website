# UX Improvements Planning

**Last Updated**: December 17, 2025  
**Status**: Research & Design Phase

---

## Overview

This document outlines user experience enhancements focused on improving conversion rates, accessibility, interaction design, and overall user satisfaction. Improvements are prioritized based on user research findings, analytics insights, and UX best practices.

---

## Current UX Audit Findings

### Strengths ✅
1. **Clean, professional design** - Cohesive green color scheme
2. **Strong accessibility foundation** - ARIA attributes, keyboard navigation
3. **Mobile-responsive** - Works on all device sizes
4. **Fast performance** - Vanilla JS, no framework overhead
5. **Clear value proposition** - Hero section communicates purpose

### Pain Points ⚠️
1. **No loading states** - Forms/modals appear instantly (no feedback)
2. **Generic error handling** - Console errors not user-facing
3. **Form validation** - No real-time feedback on input errors
4. **Limited micro-interactions** - Static experience
5. **No empty states** - What if there are no testimonials?
6. **Unclear CTAs on mobile** - Buttons may be too small
7. **No progress indicators** - Multi-step processes lack context

---

## Priority 1: Critical UX Fixes

### 1.1 Form UX Enhancements 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: Medium  
**MoSCoW**: Must

#### Current Problems
- No client-side validation (only HTML5 `required`)
- No helpful error messages
- No success confirmation
- Form state lost on error
- No indication submission is in progress

#### Proposed Improvements

##### A. Real-time Validation
```javascript
// Show errors as user types (with debounce)
const validateField = (field) => {
  const errors = {
    email: 'Please enter a valid email address',
    phone: 'Phone number should be 10+ digits',
    message: 'Message must be at least 20 characters'
  };
  
  // Show error inline
  if (!field.checkValidity()) {
    showError(field, errors[field.name]);
  } else {
    clearError(field);
  }
};
```

**Visual Design**:
```css
/* Error state */
.form-field.-error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px var(--error-color-light);
}

/* Success state */
.form-field.-valid {
  border-color: var(--success-color);
}

/* Error message */
.error-message {
  color: var(--error-color);
  font-size: var(--font-size-1);
  margin-top: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

##### B. Loading State
```javascript
// Disable form during submission
const submitForm = async (form) => {
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Show loading state
  submitButton.disabled = true;
  submitButton.classList.add('-loading');
  submitButton.innerHTML = '<span class="spinner"></span> Sending...';
  
  try {
    await sendFormData(form);
    showSuccessMessage();
  } catch (error) {
    showErrorMessage(error);
  } finally {
    // Reset button
    submitButton.disabled = false;
    submitButton.classList.remove('-loading');
    submitButton.innerHTML = 'Send Message';
  }
};
```

##### C. Success State
```html
<!-- Replace form with success message -->
<div class="form-success">
  <svg class="success-icon" aria-hidden="true">
    <!-- Checkmark icon -->
  </svg>
  <h3>Message Sent!</h3>
  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
  <p class="text-muted">We've sent a confirmation to your email.</p>
  <button type="button" onclick="resetForm()">Send Another Message</button>
</div>
```

##### D. Error State
```html
<!-- Show error banner -->
<div class="form-error" role="alert">
  <svg class="error-icon" aria-hidden="true">
    <!-- Error icon -->
  </svg>
  <div>
    <strong>Oops! Something went wrong.</strong>
    <p>Please check your connection and try again.</p>
  </div>
  <button type="button" class="dismiss-button" aria-label="Dismiss error">×</button>
</div>
```

**User Stories**:
- As a user, I want to know if my email address is valid before submitting
- As a parent, I want confirmation that my message was sent successfully
- As anyone, I want to know what went wrong if submission fails

**Success Metrics**:
- Form completion rate increases from ~50% → 70%
- Form submission errors decrease by 80%
- User frustration signals (rapid clicking) decrease

**Timeline**: 2 weeks

---

### 1.2 Loading & Skeleton States 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Low  
**MoSCoW**: Should

#### A. Skeleton Screens
Replace loading spinners with content-aware skeletons

**For Testimonials Carousel**:
```html
<div class="testimonial-skeleton">
  <div class="skeleton-avatar"></div>
  <div class="skeleton-text skeleton-line"></div>
  <div class="skeleton-text skeleton-line"></div>
  <div class="skeleton-text skeleton-line -short"></div>
</div>
```

```css
.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### B. Progressive Enhancement
Show basic content immediately, enhance progressively:

1. **HTML loads** → Show static content
2. **CSS loads** → Apply styles
3. **JS loads** → Add interactivity
4. **Images load** → Fade in with blur-up effect

**Image Loading UX**:
```html
<!-- Low-quality placeholder (LQIP) -->
<img 
  src="hero-tiny.jpg" 
  data-src="hero-full.webp"
  class="lazy-image -loading"
  alt="Student studying"
>
```

```javascript
// Lazy load with intersection observer
const lazyLoad = (image) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('-loading');
        img.classList.add('-loaded');
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(image);
};
```

**Timeline**: 1 week

---

### 1.3 Micro-interactions & Feedback 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Medium  
**MoSCoW**: Should

#### A. Button Interactions
**Current**: Basic hover opacity change  
**Enhanced**: Multi-state feedback

```css
.button {
  transition: all var(--duration-base) var(--ease-out);
  position: relative;
  overflow: hidden;
}

/* Hover state */
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* Active state (click) */
.button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-low);
}

/* Ripple effect on click */
.button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.button:active::after {
  width: 300px;
  height: 300px;
}
```

#### B. Input Focus Animations
```css
.form-field {
  transition: all var(--duration-base) var(--ease-out);
}

.form-field:focus {
  transform: scale(1.02);
  box-shadow: 0 0 0 3px var(--primary-100);
}
```

#### C. Smooth Scrolling with Progress
```javascript
// Show scroll progress bar
const updateScrollProgress = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;
  document.querySelector('.scroll-progress').style.width = `${scrolled}%`;
};

window.addEventListener('scroll', updateScrollProgress);
```

#### D. Toast Notifications
Replace alerts with elegant toasts:

```html
<div class="toast -success" role="alert" aria-live="polite">
  <svg class="toast-icon"><!-- Icon --></svg>
  <div class="toast-content">
    <strong>Success!</strong>
    <p>Your message has been sent.</p>
  </div>
  <button class="toast-close" aria-label="Close">×</button>
</div>
```

```css
.toast {
  position: fixed;
  bottom: var(--space-lg);
  right: var(--space-lg);
  background: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-high);
  animation: slide-in-bottom 0.3s var(--ease-out);
  z-index: var(--z-toast);
}

@keyframes slide-in-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**Timeline**: 2 weeks

---

## Priority 2: Mobile UX Optimization

### 2.1 Touch Target Sizing 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: Low  
**MoSCoW**: Must

**Problem**: Some interactive elements may be too small for touch

**WCAG Guidelines**: Minimum 44×44px for touch targets

**Audit Checklist**:
- [ ] All buttons are at least 44px tall
- [ ] Navigation links have adequate spacing (min 8px gap)
- [ ] Form inputs are at least 44px tall
- [ ] Close buttons on modals are at least 44×44px

**Fix Example**:
```css
/* Increase touch target size */
.button {
  min-height: 44px;
  padding: var(--space-3) var(--space-6);
}

/* Add spacing between nav links */
.header > .nav > .link {
  padding: var(--space-3);
  margin: var(--space-2);
}

/* Larger tap area with pseudo-element */
.icon-button {
  position: relative;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
}
```

**Timeline**: 3 days

---

### 2.2 Mobile Navigation Improvements 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Medium  
**MoSCoW**: Should

#### Current State
- Hamburger menu works but could be smoother
- No visual feedback during transition
- Menu instantly appears/disappears

#### Enhancements

##### A. Animated Hamburger Icon
```css
/* Hamburger transforms into X */
.hamburger {
  width: 30px;
  height: 20px;
  position: relative;
}

.hamburger > span {
  display: block;
  height: 3px;
  background: var(--primary);
  transition: all 0.3s;
}

.hamburger.-active > span:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.hamburger.-active > span:nth-child(2) {
  opacity: 0;
}

.hamburger.-active > span:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}
```

##### B. Slide-in Animation with Backdrop
```css
/* Navigation slides in from right */
.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 80%;
  max-width: 320px;
  background: white;
  transform: translateX(100%);
  transition: transform 0.3s var(--ease-out);
  box-shadow: var(--shadow-high);
}

.mobile-nav.-active {
  transform: translateX(0);
}

/* Backdrop overlay */
.nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.nav-backdrop.-active {
  opacity: 1;
  visibility: visible;
}
```

##### C. Staggered Link Animation
```css
.mobile-nav.-active > .link {
  animation: slide-in-left 0.3s var(--ease-out) backwards;
}

.mobile-nav.-active > .link:nth-child(1) { animation-delay: 0.05s; }
.mobile-nav.-active > .link:nth-child(2) { animation-delay: 0.1s; }
.mobile-nav.-active > .link:nth-child(3) { animation-delay: 0.15s; }
/* ... */

@keyframes slide-in-left {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

**Timeline**: 1 week

---

### 2.3 Thumb-Friendly Layout 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Low  
**MoSCoW**: Could

**Problem**: Important actions may be hard to reach on large phones

**Solution**: Place primary CTAs in thumb zone (bottom 1/3 of screen)

```css
/* Sticky CTA button on mobile */
@media (max-width: 768px) {
  .cta-button.-sticky {
    position: fixed;
    bottom: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - var(--space-lg) * 2);
    max-width: 400px;
    z-index: var(--z-sticky);
    box-shadow: var(--shadow-high);
  }
}
```

**Timeline**: 2 days

---

## Priority 3: Accessibility Enhancements

### 3.1 Keyboard Navigation Improvements 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: Low  
**MoSCoW**: Must

#### Current State
- Basic keyboard support exists
- Focus styles are minimal
- No skip links

#### Enhancements

##### A. Enhanced Focus Indicators
```css
:root {
  --focus-ring-color: var(--primary);
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
}

*:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-sm);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: 4px;
    outline-color: currentColor;
  }
}
```

##### B. Skip Links
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#contact-form" class="skip-link">Skip to contact form</a>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  z-index: var(--z-modal);
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}
```

##### C. Focus Trapping in Modal (Complete Implementation)
```javascript
const trapFocus = (modal) => {
  const focusableElements = modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};
```

**Timeline**: 1 week

---

### 3.2 Screen Reader Optimizations 🟡 HIGH
**Priority**: Should Have | Impact: High | Effort: Low  
**MoSCoW**: Should

#### A. Better ARIA Labels
```html
<!-- Generic -->
<button>Book Now</button>

<!-- Specific (better for screen readers) -->
<button aria-label="Book a tutoring session with Kaili">Book Now</button>

<!-- Form inputs -->
<label for="email">Email Address</label>
<input 
  id="email" 
  type="email" 
  aria-describedby="email-help"
  aria-required="true"
>
<span id="email-help" class="help-text">
  We'll never share your email with anyone else.
</span>
```

#### B. Live Region Announcements
```html
<!-- Announce dynamic changes -->
<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
  <!-- JavaScript updates this when form submits -->
</div>
```

```javascript
const announceToScreenReader = (message) => {
  const liveRegion = document.querySelector('[role="status"]');
  liveRegion.textContent = message;
  
  // Clear after 5 seconds
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 5000);
};

// Usage
announceToScreenReader('Form submitted successfully');
```

#### C. Semantic HTML Improvements
```html
<!-- Add landmarks -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main id="main-content" role="main">
  <section aria-labelledby="services-heading">
    <h2 id="services-heading">Our Services</h2>
    <!-- Services content -->
  </section>
</main>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

**Timeline**: 3 days

---

### 3.3 Color Contrast Audit 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: Medium  
**MoSCoW**: Must

**Audit Process**:
1. Test all text/background combinations with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
3. Document contrast ratios in `_palette.css`

**Example Issues & Fixes**:
```css
/* ❌ Poor contrast */
.service-card > .description {
  color: #86c6a7; /* Light green on white = 2.1:1 (fails) */
}

/* ✅ Fixed */
.service-card > .description {
  color: #305a47; /* Dark green on white = 6.8:1 (passes AAA) */
}
```

**Action Items**:
- [ ] Test hero text on background image
- [ ] Test button text colors
- [ ] Test link colors (normal and hover)
- [ ] Test form placeholder text
- [ ] Test testimonial text on colored background

**Timeline**: 2 days

---

## Priority 4: Conversion Rate Optimization (CRO)

### 4.1 Clearer CTAs 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: Low  
**MoSCoW**: Must

#### Current Issues
- Multiple CTAs compete for attention
- CTA copy is generic ("Book Now", "Contact Us")
- No urgency or value proposition

#### Improvements

##### A. Hierarchical CTAs
```html
<!-- Primary CTA (one per section) -->
<button class="button -primary -large">
  Schedule Your Free Consultation
</button>

<!-- Secondary CTA -->
<button class="button -secondary">
  Learn More About Our Services
</button>

<!-- Tertiary CTA (text link) -->
<a href="#faq" class="text-link">View Pricing & FAQ</a>
```

##### B. Value-Driven Copy
```
❌ Generic:
- "Book Now"
- "Contact Us"
- "Learn More"

✅ Specific:
- "Get Your Free 30-Minute Consultation"
- "See How We've Helped 50+ Students Improve"
- "Find the Perfect Tutoring Plan for Your Child"
```

##### C. Social Proof Near CTAs
```html
<div class="cta-section">
  <h2>Ready to Get Started?</h2>
  
  <!-- Social proof -->
  <div class="trust-badges">
    <div class="badge">
      <strong>50+</strong>
      <span>Happy Students</span>
    </div>
    <div class="badge">
      <strong>4.9/5</strong>
      <span>Average Rating</span>
    </div>
    <div class="badge">
      <strong>98%</strong>
      <span>Grade Improvement</span>
    </div>
  </div>
  
  <button class="button -primary">Schedule Free Consultation</button>
  <p class="text-muted">No credit card required. Cancel anytime.</p>
</div>
```

**Timeline**: 3 days

---

### 4.2 Exit-Intent Popup 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Low  
**MoSCoW**: Could

**Goal**: Capture leads before users leave

**Implementation**:
```javascript
let exitIntentShown = false;

const detectExitIntent = (e) => {
  // Mouse leaves viewport from top
  if (e.clientY < 10 && !exitIntentShown) {
    showExitPopup();
    exitIntentShown = true;
  }
};

document.addEventListener('mouseout', detectExitIntent);
```

**Popup Content**:
```html
<div class="exit-popup" role="dialog" aria-modal="true">
  <button class="close-button" aria-label="Close">×</button>
  <h3>Wait! Before You Go...</h3>
  <p>Get a free study guide when you schedule your first session.</p>
  <form class="quick-contact-form">
    <input type="email" placeholder="Enter your email" required>
    <button type="submit">Get My Free Guide</button>
  </form>
  <p class="text-muted">No spam. Unsubscribe anytime.</p>
</div>
```

**Best Practices**:
- Only show once per session
- Easy to dismiss
- Provide real value (not just "don't leave")
- Respect user choice (don't show if they dismissed before)

**Timeline**: 2 days

---

### 4.3 Testimonials Optimization 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Low  
**MoSCoW**: Should

#### A. Star Ratings
```html
<div class="testimonial">
  <div class="rating" role="img" aria-label="5 out of 5 stars">
    <span class="star -filled">★</span>
    <span class="star -filled">★</span>
    <span class="star -filled">★</span>
    <span class="star -filled">★</span>
    <span class="star -filled">★</span>
  </div>
  <blockquote>
    <!-- Testimonial text -->
  </blockquote>
  <cite>
    <strong>Sarah J.</strong>
    <span>Parent of 10th grader</span>
  </cite>
</div>
```

#### B. Photos/Avatars
```html
<div class="testimonial-author">
  <img 
    src="avatar.jpg" 
    alt="Sarah J. profile picture" 
    class="avatar"
    loading="lazy"
  >
  <div>
    <strong>Sarah J.</strong>
    <span class="text-muted">Parent of 10th grader</span>
  </div>
</div>
```

#### C. Verifiable Testimonials
```html
<!-- Link to Google Review or other source -->
<a href="https://google.com/review/..." 
   class="verify-link"
   target="_blank"
   rel="noopener noreferrer">
  Verified on Google ✓
</a>
```

**Timeline**: 1 week

---

## Priority 5: Performance & Perceived Performance

### 5.1 Optimistic UI Updates 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Medium  
**MoSCoW**: Could

**Concept**: Update UI immediately, sync with server in background

**Example: Testimonial Submission**
```javascript
const submitTestimonial = async (formData) => {
  // 1. Immediately show success state
  const newTestimonial = createTestimonialElement(formData);
  testimonialContainer.prepend(newTestimonial);
  showToast('Thank you for your feedback!');
  
  try {
    // 2. Send to server in background
    await fetch('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    // 3. Mark as synced
    newTestimonial.classList.add('-synced');
    
  } catch (error) {
    // 4. Revert on error
    newTestimonial.remove();
    showToast('Failed to submit. Please try again.', 'error');
  }
};
```

**Timeline**: 1 week

---

### 5.2 Prefetching & Preloading 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Low  
**MoSCoW**: Should

#### A. Preload Critical Resources
```html
<head>
  <!-- Preload fonts -->
  <link rel="preload" href="/fonts/noto-sans.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Preload hero image -->
  <link rel="preload" href="/assets/hero.webp" as="image">
  
  <!-- Preload critical CSS -->
  <link rel="preload" href="/styles/index.css" as="style">
</head>
```

#### B. Prefetch Next Likely Pages
```javascript
// Prefetch contact form when user hovers over CTA
ctaButton.addEventListener('mouseenter', () => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/contact-form-data.json';
  document.head.appendChild(link);
}, { once: true });
```

#### C. Lazy Load Below-the-Fold Content
```html
<!-- Native lazy loading -->
<img src="service-image.jpg" loading="lazy" alt="...">

<!-- Lazy load components -->
<div class="testimonials" data-lazy-component="carousel">
  <!-- Loaded when scrolled into view -->
</div>
```

**Timeline**: 3 days

---

## Analytics & Testing Plan

### Metrics to Track

#### Conversion Metrics
- **Form submission rate**: (Submissions / Page Views)
- **CTA click-through rate**: (CTA Clicks / Impressions)
- **Bounce rate**: Visitors leaving without interaction
- **Time to conversion**: Time from landing to form submission

#### Engagement Metrics
- **Average session duration**
- **Pages per session**
- **Scroll depth**: How far users scroll on homepage
- **Interaction rate**: % users who click anything

#### Performance Metrics
- **Time to Interactive (TTI)**
- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Cumulative Layout Shift (CLS)**

### A/B Testing Roadmap

**Test 1: CTA Copy**
- Control: "Book Now"
- Variant: "Schedule Free Consultation"
- Metric: Click-through rate

**Test 2: Form Length**
- Control: 5 fields (name, email, phone, grade, message)
- Variant: 3 fields (name, email, message)
- Metric: Form completion rate

**Test 3: Social Proof Placement**
- Control: Testimonials at bottom
- Variant: Testimonials near hero CTA
- Metric: Conversion rate

**Test 4: Hero CTA Color**
- Control: Primary green
- Variant: Accent orange
- Metric: Click-through rate

---

## User Research Plan

### Methods

#### 1. User Interviews (Qualitative)
**Target**: 5-10 parents and students
**Questions**:
- What brought you to the site?
- What information were you looking for?
- Was anything confusing or unclear?
- What would make you more likely to book a session?
- Did you use mobile or desktop?

#### 2. Usability Testing (Observational)
**Tasks**:
1. Find information about pricing
2. Submit a contact form inquiry
3. Book a tutoring session
4. Read testimonials and evaluate trustworthiness

**Observe**:
- Time to complete tasks
- Errors or confusion points
- Verbal feedback (think-aloud protocol)

#### 3. Heatmaps & Session Recordings
**Tools**: Hotjar, Microsoft Clarity (both free)

**Insights**:
- Where do users click?
- How far do they scroll?
- Where do they abandon the form?
- What elements attract attention?

#### 4. Surveys (Quantitative)
**On-site survey** (popup after 30 seconds):
- "What's preventing you from booking today?" (Multiple choice)
- "How easy was it to find what you needed?" (1-5 scale)
- "Any suggestions for improvement?" (Open text)

---

## Implementation Timeline

### Week 1-2: Foundation
- ✅ Form UX enhancements
- ✅ Loading states
- ✅ Touch target audit

### Week 3-4: Mobile & Accessibility
- ⚙️ Mobile navigation improvements
- ⚙️ Keyboard navigation enhancements
- ⚙️ Screen reader optimizations
- ⚙️ Color contrast audit

### Week 5-6: CRO & Polish
- 📈 CTA optimization
- 📈 Testimonials enhancements
- 📈 Micro-interactions
- 📈 Analytics setup

### Week 7-8: Testing & Iteration
- 🔬 User testing
- 🔬 A/B test setup
- 🔬 Performance optimization
- 🔬 Bug fixes based on feedback

---

## Checklist: Pre-Launch UX Review

Use before deploying major updates:

### Functionality
- [ ] All forms validate correctly
- [ ] Error messages are helpful and specific
- [ ] Success states display properly
- [ ] Loading states appear for async actions
- [ ] All links work (no 404s)

### Responsiveness
- [ ] Tested on mobile (320px, 375px, 414px)
- [ ] Tested on tablet (768px, 1024px)
- [ ] Tested on desktop (1280px, 1920px)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets are ≥44px

### Accessibility
- [ ] All images have alt text
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Focus indicators are visible
- [ ] ARIA labels are present and accurate

### Performance
- [ ] Lighthouse score >90 (all categories)
- [ ] Images are optimized (WebP, lazy-loaded)
- [ ] No console errors
- [ ] Works offline (or shows graceful error)

### Content
- [ ] No placeholder text ("Lorem ipsum", "Person")
- [ ] Spelling and grammar checked
- [ ] CTAs are clear and action-oriented
- [ ] Contact information is accurate

---

## Resources

- [Nielsen Norman Group - UX Research](https://www.nngroup.com/)
- [A11y Project - Accessibility Checklist](https://www.a11yproject.com/checklist/)
- [Web.dev - Performance Optimization](https://web.dev/fast/)
- [Baymard Institute - UX Research](https://baymard.com/)
- [Humane by Design - Ethical UX](https://humanebydesign.com/)
