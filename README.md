# Kaili's Tutoring - Landing Page

A modern, responsive landing page for a private tutoring business specializing in math and science education for secondary and university students in Australia.

## 🌐 Live Site

[https://kailistacey.com/](https://kailistacey.com/)

## 📋 Overview

This is a professional static site built with Astro for Kaili Stacey, a PhD holder in Nanochemistry with over 8 years of teaching experience. The website provides information about tutoring services, showcases testimonials, and offers an integrated booking system for prospective students. The site uses Astro's file-based routing with optional client-side interactivity via vanilla JavaScript.

### Key Features

- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Interactive Components** - Dynamic carousel for testimonials with auto-advance and manual controls
- **Pricing Section** - Transparent pricing tiers with package deals and discounts
- **FAQ Section** - Comprehensive FAQ with SEO-optimized structured data (appears in Google rich snippets)
- **Trust Badges** - PhD credentials, experience stats, and curriculum certifications prominently displayed
- **Review Stats** - 5-star rating and student count display for social proof
- **Strategic CTAs** - Multiple call-to-action placements throughout the page to boost conversions
- **Booking Integration** - Embedded Google Calendar appointments for easy session scheduling
- **Contact Form** - Netlify Forms integration with spam protection and form state persistence
- **SEO Optimized** - Comprehensive meta tags, enhanced structured data (JSON-LD), and sitemap
- **Accessibility** - ARIA labels, keyboard navigation, and semantic HTML throughout
- **Performance** - WebP images, lazy loading, and optimized asset delivery
- **Form State Management** - Automatic form state persistence using localStorage with expiry

## 🛠️ Tech Stack

- **Framework**: Astro 7.2.1 (static site generation with file-based routing)
- **JavaScript**: Vanilla JavaScript (ES6+) with TypeScript support
- **Build Tool**: Vite 7.1.7 (managed by Astro)
- **Testing**: Vitest 3.2.4 with jsdom environment
- **Styling**: Pure CSS with modular architecture
- **Deployment**: Netlify with automatic deployments
- **Analytics**: Plausible (privacy-focused)
- **Form Handling**: Netlify Forms with submission handling
- **Error Tracking**: Sentry for error monitoring

## 📁 Project Structure

```
├── astro.config.mjs        # Astro configuration (primary build config)
├── vite.config.js          # Vite configuration (test-only, managed by Astro)
├── package.json            # Dependencies and scripts
├── netlify.toml            # Netlify deployment configuration
├── public/                 # Static assets (directly copied to dist/)
│   ├── robots.txt          # Search engine crawling rules
│   ├── site.webmanifest    # PWA manifest
│   └── images/             # Image assets
├── src/
│   ├── components/         # Astro components (.astro files)
│   │   ├── Header.astro    # Navigation component
│   │   ├── Footer.astro    # Footer component
│   │   ├── ContactForm.astro
│   │   ├── Pricing.astro
│   │   ├── FAQ.astro
│   │   ├── TestimonialsCarousel.astro
│   │   └── ...
│   ├── layouts/            # Astro layouts
│   │   └── Layout.astro    # Main layout wrapper with meta tags
│   ├── pages/              # File-based routing (auto-generates routes)
│   │   ├── index.astro     # / (home page)
│   │   ├── services.astro  # /services
│   │   ├── privacy-policy.astro
│   │   ├── 404.astro
│   │   └── api/            # API endpoints (if needed)
│   ├── content/            # JSON data files
│   │   ├── about.json
│   │   ├── services.json
│   │   ├── pricing.json
│   │   ├── faq.json
│   │   └── testimonials.json
│   ├── lib/                # JavaScript utilities and functions
│   │   ├── components/     # Vanilla JS component modules
│   │   │   ├── carousel/   # Swiper testimonial carousel
│   │   │   ├── form/       # Form handler and validation
│   │   │   ├── header/     # Mobile menu logic
│   │   │   ├── modal/      # Booking modal with focus trap
│   │   │   ├── state/      # Form state manager
│   │   │   └── store/      # LocalStorage management
│   │   ├── logger.js       # Error logging with Sentry
│   │   ├── structured-data.js  # JSON-LD schema generation
│   │   └── index.js        # Utility functions
│   ├── styles/             # CSS modules (imported in components)
│   │   ├── index.css       # Main stylesheet index
│   │   ├── base/           # Base reset, typography, spacing
│   │   ├── components/     # Component-scoped styles
│   │   └── helpers/        # Utility classes
│   └── assets/             # Images, icons (processed by Astro)
├── scripts/                # (Empty, available for build scripts)
├── coverage/               # Test coverage reports (generated)
└── .astro/                 # Astro build cache (gitignored)
└── coverage/               # Test coverage reports
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v22.x or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd private-tutoring-website
```

2. Install dependencies:

```bash
npm install
```

### Development Server

Start the Astro development server (with HMR):

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Build

Build for production:

```bash
npm run build
```

Output: `./dist/` directory (static HTML/CSS/JS)

### Preview Production Build

Test production build locally:

```bash
npm run preview
```

Preview runs on `http://localhost:4173`

### Code Quality

```bash
npm run lint          # Check code for issues
npm run lint:fix      # Automatically fix linting issues
npm run type-check    # TypeScript type checking
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

See `.env.example` for required and optional environment variables.

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Watch Mode

Run tests in watch mode during development:

```bash
npm run test:watch
```

### Code Coverage

Generate and view test coverage report:

```bash
npm run test:coverage
```

Coverage reports are available in the `coverage/` directory.

### Run Development and Tests Concurrently

```bash
npm run dev:test
```

## 📊 Current Test Coverage

- **Statements**: ~70%
- **Branches**: ~93%
- **Functions**: ~60%
- **Lines**: ~70%

## 🎨 Features in Detail

### Interactive Carousel

- Auto-advancing testimonial slider
- Responsive layout (1, 2, or 3 cards visible based on screen size)
- Pause on hover
- Manual navigation controls
- Keyboard accessible
- Visibility-aware (only auto-advances when in viewport)

### Form State Management

- Automatic form state persistence to localStorage
- Debounced save (2-second idle time)
- 24-hour expiry on saved data
- Clears state after successful submission
- Handles page refreshes gracefully

### Booking Modal

- Google Calendar integration
- Focus trap for accessibility
- ESC key to close
- Prevents body scroll when open
- Restores focus to trigger element on close

### Responsive Navigation

- Hamburger menu for mobile (< 1024px)
- Smooth scroll to sections
- Auto-closes on scroll (mobile)
- Proper ARIA attributes for screen readers

## 🔒 Security Features

- CORS headers configured (COOP, COEP)
- Form honeypot field for spam prevention
- Netlify Forms with built-in spam protection
- No exposed API keys or credentials
- Input validation on contact form

## 🌍 SEO & Performance

- **Meta Tags**: Comprehensive title, description, keywords
- **Open Graph**: Optimized for social media sharing
- **Twitter Cards**: Rich preview cards
- **Structured Data**: JSON-LD schema for search engines
- **Sitemap**: XML sitemap for search engine crawling
- **Robots.txt**: Proper crawler directives
- **Images**: WebP format with lazy loading
- **Fonts**: Preconnect to Google Fonts

## 📦 Deployment

The site is automatically deployed to Netlify on push to the main branch.

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist/` directory to your hosting provider

### Netlify Configuration

The project is configured for automatic deployment:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22.x+

## 🧩 Component Architecture

### Carousel Component

- Self-contained with visibility observer
- Configurable interval timing
- Responsive slide width calculation
- Intersection Observer for performance

### Form Handler

- Dependency injection for state management
- Event delegation for form submission
- Integration with Netlify Forms API
- Submission tracking via localStorage

### State Manager

- Centralized localStorage operations
- Time-based expiry mechanism
- JSON serialization with error handling
- State isolation per form

### Modal Manager

- Focus management and trap
- Keyboard event handling (ESC, Tab)
- Body scroll lock
- ARIA attributes for accessibility

## 🤝 Contributing

This is a private project for Kaili Stacey's tutoring business. For inquiries or suggestions, please contact the repository owner.

## 📄 License

© 2025 by Leonard Atorough. All rights reserved.

## 📧 Contact

For business inquiries, please visit [kailistacey.com](https://kailistacey.com/) or email kailistacey@gmail.com

---

**Built with ❤️ using Vanilla JavaScript and Vite**
