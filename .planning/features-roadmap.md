# Features Roadmap

**Last Updated**: December 17, 2025  
**Status**: Strategic Planning Phase

---

## Overview

This roadmap outlines feature development priorities as the tutoring business scales from single-tutor operation to a multi-user platform. Features are organized into three phases based on current business needs and anticipated growth patterns.

---

## Phase 1: Foundation & Quick Wins (Q1-Q2 2026)

**Goal**: Fix current pain points and improve content management without disrupting live site

**Target Users**: Site visitors (prospective students/parents) + Business owner (content updates)

### 1.1 Dynamic Content Rendering 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: Low  
**MoSCoW**: Must

**Problem**: Content hardcoded in HTML; requires developer intervention for updates

**Solution**: 
- Render About/Services/Testimonials from existing JSON files
- Build vanilla JS content renderer
- Update HTML to use data containers

**User Stories**:
- As a business owner, I want to update testimonials without touching code
- As a developer, I want content changes to not require redeployment

**Success Metrics**:
- Content update time reduced from 30 min → 5 min
- Zero code changes needed for content updates

**Timeline**: 1 week  
**Dependencies**: None  
**Related**: [tech-stack.md - Dynamic Content](tech-stack.md#1-dynamic-content-rendering-system)

---

### 1.2 Enhanced Contact Form 🟡 HIGH
**Priority**: Should Have | Impact: High | Effort: Medium  
**MoSCoW**: Should

**Current State**: Basic form with formsubmit.co integration

**Enhancements**:
1. **Client-side validation** with helpful error messages
2. **Success/error states** with visual feedback
3. **Loading state** during submission
4. **Email preview** before sending
5. **CAPTCHA** to prevent spam (hCaptcha or reCAPTCHA)

**User Stories**:
- As a parent, I want immediate feedback if I fill the form incorrectly
- As a business owner, I want to reduce spam submissions
- As a user, I want confirmation that my message was sent

**Success Metrics**:
- Form completion rate increases by 20%
- Spam submissions reduced by 90%
- User satisfaction score improves

**Timeline**: 2 weeks  
**Technical Approach**:
```javascript
// Enhanced validation
const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^\+?[\d\s\-()]+$/.test(value),
  message: (value) => value.length >= 20
};
```

---

### 1.3 Booking Calendar Integration 🟡 HIGH
**Priority**: Should Have | Impact: High | Effort: Medium  
**MoSCoW**: Should

**Current State**: Modal opens Google Calendar page (external navigation)

**Enhancement Options**:

#### Option A: Calendly Embed (Recommended)
**Pros**: 
- Easy integration (iframe)
- Automatic reminders
- Payment integration
- Timezone handling
- Free tier available

**Cons**:
- Monthly cost after free tier ($10+/mo)
- External dependency
- Calendly branding (unless paid)

```html
<!-- Calendly inline widget -->
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/your-tutor/session"
     style="min-width:320px;height:630px;">
</div>
```

#### Option B: Custom Calendar System
**Pros**: 
- Full control
- No recurring costs
- Branded experience

**Cons**:
- Complex to build (2-3 weeks)
- Maintenance burden
- Need backend (availability management)

**Recommendation**: Start with Calendly, build custom later if needed

**User Stories**:
- As a parent, I want to book a session without leaving the site
- As a tutor, I want to manage my availability easily
- As both, I want automatic email confirmations

**Success Metrics**:
- Booking completion rate increases by 40%
- Time-to-book reduced from 5 min → 2 min
- Reduced booking-related emails

**Timeline**: 1 week (Calendly) or 3 weeks (custom)

---

### 1.4 FAQ Section 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Low  
**MoSCoW**: Could

**Rationale**: Reduce repetitive inquiry emails

**Features**:
- Accordion-style Q&A
- Search/filter functionality
- Categories (Pricing, Schedule, Subjects, Process)
- "Still have questions?" CTA to contact form

**Content Examples**:
- What subjects do you tutor?
- What are your rates?
- Do you offer online or in-person sessions?
- How long are sessions?
- What's your cancellation policy?

**User Stories**:
- As a parent, I want quick answers to common questions
- As a business owner, I want to reduce repetitive emails

**Success Metrics**:
- 30% reduction in inquiry emails
- Average session duration increases by 1 minute
- FAQ section gets 50+ views per week

**Timeline**: 1 week  
**Technical Approach**: Vanilla JS accordion + JSON data file

---

### 1.5 Testimonials Management 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Low  
**MoSCoW**: Could

**Current Issues**:
- Placeholder content ("Person" instead of real names)
- Only 4 testimonials
- No star ratings
- No photos

**Enhancements**:
1. **Rich testimonials** with:
   - Student name + grade level
   - Parent name (optional)
   - Star rating (1-5)
   - Photo (avatar)
   - Date received
   - Subject/topic

2. **Filtering**: By grade level, subject
3. **Social proof**: "Join 50+ happy students"

**User Stories**:
- As a parent, I want to see testimonials from students similar to my child
- As a business owner, I want to showcase success stories easily

**Success Metrics**:
- Conversion rate increases by 15%
- More testimonials collected (email campaign)

**Timeline**: 1 week

---

## Phase 2: Growth Features (Q3-Q4 2026)

**Goal**: Support business scaling with better client management and revenue features

**Target Users**: Returning students + Business owner (operations)

### 2.1 Student Portal 🔴 CRITICAL
**Priority**: Must Have | Impact: High | Effort: High  
**MoSCoW**: Must (for scaling)

**Features**:

#### Authentication
- Email/password login
- "Forgot password" flow
- Email verification
- Social login (Google) optional

#### Student Dashboard
- Upcoming sessions calendar
- Session history
- Resource library (notes, practice problems uploaded by tutor)
- Progress tracking (mock test scores, grade improvements)
- Billing/payment history

#### Parent Dashboard (if separate accounts)
- View child's progress
- Communication with tutor
- Payment management

**User Stories**:
- As a student, I want to see my upcoming sessions and access study materials
- As a parent, I want to track my child's progress over time
- As a tutor, I want to share resources without emailing files

**Success Metrics**:
- 80% of students use portal monthly
- Reduced administrative emails by 50%
- Session no-show rate decreases by 30%

**Timeline**: 6-8 weeks  
**Tech Requirements**:
- Backend needed (Node.js/Express or Firebase)
- Database (PostgreSQL or Firestore)
- Authentication service (Auth0, Firebase Auth, or custom)
- File storage (AWS S3 or Firebase Storage)

**Architecture Decision**: See [decisions/003-student-portal-architecture.md](decisions/003-student-portal-architecture.md)

---

### 2.2 Payment Processing 🟡 HIGH
**Priority**: Should Have | Impact: High | Effort: Medium  
**MoSCoW**: Should

**Current State**: Manual payment collection (Venmo, Zelle, cash)

**Problems**:
- Payment tracking is manual
- No automated invoicing
- Difficult to scale

**Solution Options**:

#### Option A: Stripe Integration (Recommended)
**Features**:
- One-time payments
- Subscription billing (monthly packages)
- Automated invoicing
- Payment links (no website integration required to start)

**Pricing**: 2.9% + $0.30 per transaction

**Implementation Phases**:
1. **Phase 2A** (Easy): Stripe Payment Links
   - Generate links for different session packages
   - Share via email/portal
   - No coding required

2. **Phase 2B** (Advanced): Embedded checkout
   - Custom checkout in student portal
   - Saved payment methods
   - Automatic receipts

#### Option B: PayPal Business
**Pros**: Familiar to users, easy setup  
**Cons**: Higher fees (3.49% + $0.49), less developer-friendly

**User Stories**:
- As a parent, I want to pay for sessions online with a credit card
- As a student, I want to purchase session packages easily
- As a business owner, I want automated invoicing and payment tracking

**Success Metrics**:
- 70% of payments collected online (vs. manual)
- Payment collection time reduced from 7 days → 1 day
- Invoicing time reduced from 30 min → automated

**Timeline**: 
- Payment links: 1 day
- Full integration: 2-3 weeks

---

### 2.3 Session Notes & Feedback 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Medium  
**MoSCoW**: Should

**Features**:
- Tutor fills out after each session:
  - Topics covered
  - Student performance notes
  - Homework assigned
  - Areas to focus on next time
- Auto-emailed to parent/student
- Stored in student portal
- Optional parent feedback form

**User Stories**:
- As a parent, I want to know what was covered in each session
- As a student, I want to review session notes when studying
- As a tutor, I want to remember where we left off

**Success Metrics**:
- 90% of sessions have notes added
- Parent satisfaction increases (surveys)
- Reduced "What did you work on?" emails

**Timeline**: 3 weeks  
**Dependencies**: Student portal (2.1)

---

### 2.4 Package & Subscription Plans 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Medium  
**MoSCoW**: Could

**Current Model**: Pay-per-session

**Proposed Models**:
1. **Session packages**:
   - 5 sessions: 5% discount
   - 10 sessions: 10% discount
   - 20 sessions: 15% discount

2. **Monthly subscriptions**:
   - 4 sessions/month
   - 8 sessions/month
   - Unlimited sessions (premium tier)

3. **Sibling discounts**: 10% off for second child, 15% for third+

**User Stories**:
- As a parent, I want to save money by buying session packages
- As a business owner, I want predictable monthly revenue

**Success Metrics**:
- 40% of clients opt for packages/subscriptions
- Customer lifetime value increases by 30%
- Revenue predictability improves (recurring revenue)

**Timeline**: 2 weeks  
**Dependencies**: Payment processing (2.2)

---

### 2.5 Email Automation 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: Low  
**MoSCoW**: Could

**Use Cases**:
1. **Session reminders** (24 hours before)
2. **Welcome email** (new student onboarding)
3. **Session feedback request** (after session)
4. **Re-engagement** (inactive students)
5. **Birthday messages** (personal touch)
6. **Package expiration warnings** (sessions running low)

**Tools**: 
- **Mailgun** (transactional emails, developer-friendly)
- **SendGrid** (similar to Mailgun)
- **Customer.io** (advanced automation, more expensive)

**User Stories**:
- As a parent, I want automatic reminders so we don't miss sessions
- As a business owner, I want to automate routine communications

**Success Metrics**:
- No-show rate reduced by 40%
- Time spent on emails reduced by 5 hours/week
- Student retention increases by 20%

**Timeline**: 2 weeks

---

## Phase 3: Scale & Optimization (2027+)

**Goal**: Expand beyond single-tutor operation, add advanced features

**Target Users**: Multi-tutor team + Advanced students + Business administrator

### 3.1 Multi-Tutor Platform 🔴 CRITICAL (if scaling)
**Priority**: Must Have (for expansion) | Impact: High | Effort: Very High  
**MoSCoW**: Must (for multi-tutor model)

**Features**:

#### Tutor Profiles
- Individual tutor pages with:
  - Bio, education, specialties
  - Availability calendar
  - Ratings/reviews
  - Pricing (if varies)

#### Admin Dashboard
- Tutor management (onboard, offboard)
- Session assignment
- Revenue tracking per tutor
- Performance analytics

#### Advanced Booking
- Filter by subject, grade level, tutor
- Request preferred tutor
- Automatic tutor matching

**User Stories**:
- As a parent, I want to choose a tutor specializing in AP Chemistry
- As an admin, I want to onboard new tutors without custom development
- As a tutor, I want my own profile and availability management

**Success Metrics**:
- Support 5+ tutors without performance issues
- Tutor onboarding time: <2 hours
- Student-tutor matching satisfaction: >90%

**Timeline**: 12-16 weeks  
**Tech Requirements**:
- Major refactor to multi-tenant architecture
- Role-based access control (RBAC)
- Complex scheduling system

---

### 3.2 Analytics Dashboard 🟡 HIGH
**Priority**: Should Have | Impact: Medium | Effort: Medium  
**MoSCoW**: Should

**Metrics to Track**:

#### Business Metrics
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Customer lifetime value (LTV)
- Conversion rates (website → inquiry → booking → paid)

#### Operational Metrics
- Sessions per week/month
- Average session duration
- Tutor utilization rate
- No-show rate

#### Student Metrics
- Active students
- Retention rate
- Average sessions per student
- Subject distribution

**Visualizations**:
- Revenue trends (line chart)
- Student growth (area chart)
- Subject breakdown (pie chart)
- Geographic heatmap (where students are located)

**Tools**:
- Custom dashboard (Chart.js or Recharts)
- Google Data Studio (free, powerful)
- Metabase (open-source BI tool)

**User Stories**:
- As a business owner, I want to see monthly revenue trends
- As a tutor, I want to track my teaching load
- As both, I want data-driven insights for business decisions

**Timeline**: 4 weeks

---

### 3.3 Video Conferencing Integration 🟡 HIGH
**Priority**: Should Have | Impact: High | Effort: Medium  
**MoSCoW**: Should

**Current State**: Zoom links sent manually

**Integration Options**:

#### Option A: Zoom API
- Auto-generate meeting links
- Create recurring meetings for regular students
- Embed join button in student portal

#### Option B: Custom Solution (Daily.co, Agora)
- In-app video (no external app needed)
- Recording capabilities
- Interactive whiteboard
- Screen sharing

**User Stories**:
- As a student, I want one-click join for sessions from my portal
- As a tutor, I want automatic meeting creation when sessions are booked
- As both, I want session recordings for review

**Success Metrics**:
- 100% of online sessions use integrated video
- "Can't find meeting link" issues reduced to zero
- Session start delays reduced by 5 minutes

**Timeline**: 2-3 weeks (Zoom) or 6 weeks (custom)

---

### 3.4 Interactive Whiteboard 🟢 MEDIUM
**Priority**: Could Have | Impact: Medium | Effort: High  
**MoSCoW**: Could

**Use Cases**:
- Math problem solving
- Diagram drawing
- Collaborative note-taking
- Real-time collaboration during sessions

**Tools**:
- **Miro** (embed existing tool)
- **Excalidraw** (open-source, embeddable)
- **Fabric.js** (custom canvas solution)

**Features**:
- Drawing tools (pen, shapes, text)
- Image/PDF upload
- Save whiteboards to student account
- Replay whiteboard session

**User Stories**:
- As a tutor, I want to draw diagrams during sessions
- As a student, I want to save whiteboard notes for studying

**Timeline**: 6-8 weeks (custom) or 1 week (embed)

---

### 3.5 Mobile App 🟢 NICE TO HAVE
**Priority**: Won't Have (for now) | Impact: Low | Effort: Very High  
**MoSCoW**: Won't

**Rationale**: 
- Responsive website covers 90% of use cases
- High development cost (iOS + Android)
- Maintenance burden

**When to Revisit**:
- Web traffic >50% mobile
- Competitors launch apps
- Need push notifications
- Budget allows ($50K+ for quality app)

**Alternative**: **Progressive Web App (PWA)**
- Install icon on home screen
- Offline capabilities
- Push notifications
- Much cheaper than native app (1-2 weeks vs 3-6 months)

---

## Feature Prioritization Matrix

### Quick Wins (High Impact, Low Effort)
1. ✅ Dynamic content rendering (1.1)
2. ✅ FAQ section (1.4)
3. ✅ Testimonials enhancement (1.5)

### Major Projects (High Impact, High Effort)
4. ⚙️ Student portal (2.1)
5. ⚙️ Payment processing (2.2)
6. ⚙️ Multi-tutor platform (3.1)

### Fill-ins (Low Impact, Low Effort)
7. 📌 Email automation (2.5)
8. 📌 Stripe payment links (2.2A - subset)

### Avoid for Now (Low Impact, High Effort)
9. ❌ Mobile app (3.5)
10. ❌ Custom video solution (3.3 Option B)

---

## Implementation Strategy

### Parallel Development Tracks

**Track A: Content & UX** (No backend required)
- Dynamic content rendering
- Enhanced contact form
- FAQ section
- Testimonials improvements

**Track B: Business Infrastructure** (Backend required)
- Student portal
- Payment processing
- Session notes

**Track C: Scaling Features** (After Track B complete)
- Multi-tutor support
- Analytics dashboard
- Advanced automations

### Release Schedule

**Q1 2026**: Phase 1 Quick Wins  
**Q2 2026**: Phase 1 Complete + Phase 2 Start  
**Q3 2026**: Student Portal & Payments Live  
**Q4 2026**: Phase 2 Complete  
**2027+**: Evaluate Phase 3 based on business growth

---

## Success Criteria

### Phase 1 Exit Criteria
- ✅ Content updates take <5 minutes (non-technical)
- ✅ Form completion rate >60%
- ✅ Booking conversion rate >30%
- ✅ FAQ reduces support emails by 25%

### Phase 2 Exit Criteria
- ✅ 80% of students use portal monthly
- ✅ 70% of payments collected online
- ✅ 90% of sessions have feedback notes
- ✅ Revenue tracking is automated

### Phase 3 Exit Criteria
- ✅ Support 5+ tutors seamlessly
- ✅ Admin can onboard new tutor in <2 hours
- ✅ Dashboard provides actionable business insights
- ✅ Video integration used for 100% of online sessions

---

## Dependencies & Risks

### Technical Dependencies
- **Backend development**: Required for Phase 2+ (currently vanilla JS only)
- **Database**: Required for user accounts, session tracking
- **Authentication**: Required for student portal
- **Payment gateway account**: Stripe/PayPal business account

### Business Dependencies
- **Budget**: CMS, payment processing, hosting upgrades
- **Time**: Owner/tutor time for content creation, testing
- **User adoption**: Features only valuable if users engage

### Risks
- **Scope creep**: Temptation to add "just one more feature"
- **Technical debt**: Rushing Phase 2 without solid foundation
- **Maintenance burden**: More features = more to maintain
- **User confusion**: Too many features can overwhelm

### Mitigation Strategies
- Strict phase-gate approach (don't start Phase 2 until Phase 1 complete)
- User testing before full rollout
- Comprehensive documentation
- Regular code reviews and refactoring

---

## Future Explorations (Backlog)

Ideas not yet prioritized but worth considering:

- **Group sessions**: Multiple students in one session
- **Self-paced courses**: Pre-recorded lessons + quizzes
- **Practice problem generator**: AI-generated problems
- **Parent community forum**: Connect parents for advice
- **Tutor marketplace**: Let external tutors list services (commission model)
- **Referral program**: Student refers friend, both get discount
- **Seasonal camps**: Intensive summer/winter programs
- **University admissions consulting**: Expand service offerings

---

## Feedback Loop

**How to update this roadmap**:
1. Quarterly business reviews (reassess priorities)
2. User feedback sessions (interview students/parents)
3. Analytics review (what features are actually used?)
4. Competitive analysis (what are others doing?)

**Document owner**: Development team + Business owner  
**Review cadence**: Monthly (progress updates), Quarterly (priority changes)
