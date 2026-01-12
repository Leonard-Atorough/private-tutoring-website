# 003. Student Portal Architecture

**Date**: 2025-12-17  
**Status**: Proposed  
**Deciders**: Development Team, Business Owner  
**Technical Story**: Related to [features-roadmap.md - Phase 2](../features-roadmap.md#21-student-portal)

---

## Context and Problem Statement

As the tutoring business scales, there's a need for a **student portal** where students and parents can:

- View upcoming and past sessions
- Access shared resources (notes, practice problems, study guides)
- Track progress (test scores, grade improvements)
- Manage billing and payments
- Communicate with the tutor

Currently, there is no backend infrastructure. The site is a **static vanilla JavaScript frontend** hosted on Netlify. Implementing a student portal requires significant architectural decisions:

1. **Backend technology**: What will handle authentication, database, API?
2. **Database**: Where will user data, sessions, and resources be stored?
3. **Authentication**: How will users log in securely?
4. **Hosting**: Where will the backend run?
5. **Scalability**: Will this architecture support 100+ students and multiple tutors?

This decision will fundamentally change the project's architecture and must be carefully considered.

---

## Decision Drivers

- **Time to market**: Need to launch portal in Q3 2026 (6-8 weeks of development)
- **Developer skill set**: Team is strongest in JavaScript; limited backend experience
- **Cost**: Monthly hosting/infrastructure costs must be reasonable (<$50/mo initially)
- **Scalability**: Must support 100+ students and 5+ tutors without major refactor
- **Security**: User data (authentication, personal info) must be secure
- **Maintenance burden**: Small team; prefer managed services over self-hosted infrastructure
- **Integration**: Must work well with existing vanilla JS frontend
- **Future features**: Should support real-time features (chat, notifications) if needed later

---

## Considered Options

1. **Firebase (Backend-as-a-Service)**
2. **Supabase (Open-source Firebase alternative)**
3. **Node.js + PostgreSQL (Custom backend on Render/Railway)**
4. **Next.js with API routes (Full-stack framework)**
5. **Serverless (AWS Lambda + DynamoDB)**

---

## Decision Outcome

**Chosen option**: **"Supabase (Backend-as-a-Service)"** (Proposed)

**Rationale**:
Supabase offers the best balance of rapid development (managed backend), PostgreSQL power (relational data), open-source flexibility, and generous free tier. It provides authentication, database, storage, and real-time features out-of-the-box, allowing the team to focus on features rather than infrastructure. The JavaScript SDK integrates seamlessly with the existing vanilla JS frontend.

### Consequences

#### Positive (Good) ✅

- **Fast development**: Auth, database, storage all pre-built (no need to build from scratch)
- **Generous free tier**: 500MB database, 1GB storage, 50K monthly active users (sufficient for years)
- **PostgreSQL**: Relational database (better for structured data like sessions, users, progress)
- **Real-time subscriptions**: Built-in WebSocket support for live updates (useful for future chat feature)
- **Row-level security**: Database-level access control (secure by design)
- **File storage**: Built-in storage for study materials, notes, PDFs
- **Self-hosted option**: Open-source, can migrate to self-hosted if needed (no vendor lock-in)
- **JavaScript SDK**: Easy integration with vanilla JS frontend
- **Good DX**: Dashboard, SQL editor, logs, all in one place

#### Negative (Bad) ⚠️

- **PostgreSQL learning curve**: Team must learn SQL and database design
- **Vendor dependency**: Tied to Supabase platform (though migration is possible)
- **Paid tier eventually**: Free tier limits may be exceeded as business grows ($25/mo Pro plan)
- **Limited real-time quotas**: Free tier has connection limits (200 concurrent connections)
- **JavaScript-centric**: Best for JS ecosystem; not ideal if team wants to explore other languages

#### Neutral (Trade-offs) ⚖️

- **Opinionated structure**: Supabase encourages certain patterns (row-level security, edge functions)
- **Abstraction layer**: Less control than custom backend, but faster to build

---

## Detailed Analysis of Options

### Option 1: Firebase (Backend-as-a-Service)

**Description**: Google's BaaS platform. Provides authentication, Firestore (NoSQL database), Cloud Storage, Cloud Functions (serverless), and real-time updates.

**Pros**:

- ✅ **Mature platform**: Battle-tested by millions of apps
- ✅ **Generous free tier**: Spark plan includes auth, Firestore, storage
- ✅ **Real-time database**: Built-in live data sync
- ✅ **JavaScript SDK**: Easy frontend integration
- ✅ **Authentication**: Email/password, Google, Apple, phone, etc.
- ✅ **Global CDN**: Fast data access worldwide
- ✅ **Cloud Functions**: Serverless backend logic

**Cons**:

- ❌ **NoSQL only**: Firestore is document-based (not relational) - less intuitive for relational data
- ❌ **Vendor lock-in**: Proprietary database, hard to migrate
- ❌ **Complex pricing**: Pay-as-you-go can be unpredictable
- ❌ **Query limitations**: Firestore has restrictions on complex queries
- ❌ **Not open-source**: No self-hosted option

**Estimated Effort**: 4-6 weeks (similar to Supabase)  
**Technical Complexity**: Medium  
**Ongoing Maintenance**: Low (fully managed)

**Pricing**:

- Free (Spark): 50K document reads/day, 20K writes/day, 1GB storage
- Pay-as-you-go (Blaze): $0.06/100K reads, $0.18/100K writes

---

### Option 2: Supabase (Open-source Firebase Alternative)

**Description**: Open-source BaaS built on PostgreSQL. Provides authentication, database (PostgreSQL), storage, edge functions, and real-time subscriptions.

**Pros**:

- ✅ **PostgreSQL**: Relational database with powerful queries (JOINs, transactions)
- ✅ **Open-source**: Self-hosted option available (no vendor lock-in)
- ✅ **Free tier**: 500MB database, 1GB storage, 50K monthly active users
- ✅ **Row-level security**: Database-level access control (secure by design)
- ✅ **Real-time subscriptions**: WebSocket-based live updates
- ✅ **JavaScript SDK**: Easy integration with vanilla JS
- ✅ **Storage**: Built-in file storage with CDN
- ✅ **Edge functions**: Deno-based serverless functions
- ✅ **Great DX**: SQL editor, logs, dashboard all in one place

**Cons**:

- ❌ **Newer platform**: Less mature than Firebase (founded 2020)
- ❌ **PostgreSQL learning curve**: Team must learn SQL
- ❌ **Self-hosting complexity**: Managed service is easy, but self-hosting is complex
- ❌ **Smaller community**: Fewer resources/tutorials than Firebase

**Estimated Effort**: 4-6 weeks  
**Technical Complexity**: Medium  
**Ongoing Maintenance**: Low (fully managed)

**Pricing**:

- Free: 500MB database, 1GB storage, 50K MAU, 2GB bandwidth
- Pro: $25/mo for 8GB database, 100GB storage, 100K MAU

---

### Option 3: Node.js + PostgreSQL (Custom Backend)

**Description**: Build a custom backend with Express.js (Node.js) and PostgreSQL. Host on Render, Railway, or Heroku. Full control over architecture.

**Pros**:

- ✅ **Full control**: Total flexibility in architecture and design
- ✅ **No vendor lock-in**: Can host anywhere
- ✅ **PostgreSQL**: Relational database (same as Supabase)
- ✅ **Learning opportunity**: Team learns backend development deeply
- ✅ **Custom logic**: No limitations on complex business logic

**Cons**:

- ❌ **Time-intensive**: Must build auth, API, database schema from scratch (8-12 weeks)
- ❌ **Security burden**: Responsible for securing auth, API, database
- ❌ **Infrastructure management**: Must handle scaling, backups, monitoring
- ❌ **Maintenance overhead**: All updates, patches, security fixes on the team
- ❌ **Hosting costs**: Render/Railway pricing can add up ($15-50/mo+)

**Estimated Effort**: 8-12 weeks  
**Technical Complexity**: High  
**Ongoing Maintenance**: High

**Pricing** (Render example):

- Starter: $7/mo for web service + $7/mo for PostgreSQL = $14/mo minimum

---

### Option 4: Next.js with API Routes (Full-Stack Framework)

**Description**: Migrate from vanilla JS to Next.js (React framework). Use Next.js API routes for backend logic. Host on Vercel.

**Pros**:

- ✅ **Integrated frontend + backend**: API routes in same codebase
- ✅ **Vercel hosting**: Free tier is generous, deploy with git push
- ✅ **React ecosystem**: Access to rich component libraries
- ✅ **SSR/SSG**: Server-side rendering for SEO and performance
- ✅ **TypeScript-friendly**: Great DX with TypeScript

**Cons**:

- ❌ **Major refactor**: Must rewrite entire site from vanilla JS to React (6-8 weeks)
- ❌ **Still need database**: Next.js doesn't include database (must use Supabase, Prisma + PlanetScale, etc.)
- ❌ **Framework lock-in**: Tied to Next.js/React ecosystem
- ❌ **Overkill for simple site**: Current site is simple; Next.js adds complexity

**Estimated Effort**: 10-14 weeks (rewrite + portal features)  
**Technical Complexity**: High  
**Ongoing Maintenance**: Medium

**Pricing** (Vercel + PlanetScale example):

- Vercel: Free for hobby, $20/mo Pro
- PlanetScale: Free tier (5GB storage, 1B row reads/mo)

---

### Option 5: Serverless (AWS Lambda + DynamoDB)

**Description**: Build backend with AWS Lambda functions (serverless) and DynamoDB (NoSQL). API Gateway for HTTP endpoints.

**Pros**:

- ✅ **Pay-per-use**: Only pay for actual usage (cost-effective at small scale)
- ✅ **Scalability**: Infinite scaling (AWS handles infrastructure)
- ✅ **No servers**: No server management
- ✅ **AWS ecosystem**: Access to all AWS services (S3, SES, etc.)

**Cons**:

- ❌ **Complex setup**: IAM, API Gateway, Lambda, DynamoDB config is intricate
- ❌ **Cold starts**: Lambda functions can be slow on first invocation
- ❌ **DynamoDB limitations**: NoSQL, single-table design is complex
- ❌ **Debugging difficulty**: Distributed system is harder to debug
- ❌ **Vendor lock-in**: Heavily tied to AWS

**Estimated Effort**: 8-10 weeks  
**Technical Complexity**: Very High  
**Ongoing Maintenance**: Medium-High

**Pricing** (AWS Free Tier):

- Lambda: 1M free requests/mo, 400K GB-seconds compute
- DynamoDB: 25GB storage, 25 read/write capacity units
- Exceeding free tier can get expensive quickly

---

## More Information

### Related Decisions

- Related to [features-roadmap.md - Student Portal](../features-roadmap.md#21-student-portal)
- May influence [ADR-001: Headless CMS](001-headless-cms-selection.md) (shared content between portal and marketing site)

### Research & References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase vs Firebase Comparison](https://supabase.com/alternatives/supabase-vs-firebase)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Render Pricing](https://render.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)

### Database Schema (Draft)

**Key Tables** (if using Supabase/PostgreSQL):

```sql
-- Users (handled by Supabase Auth)
-- auth.users (built-in)

-- User profiles (extend auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'parent', 'tutor', 'admin')),
  grade_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  tutor_id UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources (study materials)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  tutor_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  subject TEXT,
  metric_type TEXT, -- 'test_score', 'grade', 'assessment'
  metric_value NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL,
  notes TEXT
);
```

### Validation Plan

If we choose Supabase:

**Phase 1: Proof of Concept (Week 1-2)**

- [ ] Set up Supabase project
- [ ] Implement authentication (email/password)
- [ ] Create basic database schema (users, sessions)
- [ ] Test from vanilla JS frontend

**Phase 2: Core Features (Week 3-5)**

- [ ] Student dashboard (view upcoming sessions)
- [ ] Session history
- [ ] Resource upload/download
- [ ] Basic progress tracking

**Phase 3: Polish & Security (Week 6-7)**

- [ ] Row-level security policies (students can only see their data)
- [ ] Parent accounts (link to student accounts)
- [ ] Email notifications (session reminders)
- [ ] Testing (E2E tests for login, dashboard)

**Phase 4: Launch (Week 8)**

- [ ] Beta testing with 5-10 students
- [ ] Gather feedback
- [ ] Iterate on UX
- [ ] Full launch

**Success Metrics**:

- 80% of students create accounts within 2 weeks of launch
- <5% authentication issues (password reset requests)
- Dashboard load time <2 seconds
- 90% student satisfaction (post-launch survey)

**Review Date**: Q4 2026 - Evaluate Supabase performance, consider self-hosting if needed

---

## Change Log

| Date       | Change                                    | Author           |
| ---------- | ----------------------------------------- | ---------------- |
| 2025-12-17 | Initial proposal                          | Development Team |
| TBD        | Decision pending proof-of-concept results | -                |
