# Kaili's Tutoring - Landing Page

A modern, responsive landing page for a private tutoring business specializing in math and science education for secondary and university students in Australia.

## 🌐 Live Site

[https://kailistutoring.netlify.app/](https://kailistutoring.netlify.app/)

## 📋 Overview

This is a professional single-page application (SPA) built for Kaili Stacey, a PhD holder in Nanochemistry with over 8 years of teaching experience. The website provides information about tutoring services, showcases testimonials, and offers an integrated booking system for prospective students.

### Key Features

- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Interactive Components** - Dynamic carousel for testimonials with auto-advance and manual controls
- **Pricing Section** - Transparent pricing tiers with package deals and discounts
- **FAQ Section** - Comprehensive FAQ with SEO-optimized structured data (appears in Google rich snippets)
- **Trust Badges** - PhD credentials, experience stats, and curriculum certifications prominently displayed
- **Review Stats** - 5-star rating and student count display for social proof
- **Strategic CTAs** - Multiple call-to-action placements throughout the page to boost conversions
- **Booking Integration** - Embedded Google Calendar appointments for easy session scheduling
- **Contact Form** - FormSubmit.co integration with spam protection and form state persistence
- **SEO Optimized** - Comprehensive meta tags, enhanced structured data (JSON-LD), and sitemap
- **Accessibility** - ARIA labels, keyboard navigation, and semantic HTML throughout
- **Performance** - WebP images, lazy loading, and optimized asset delivery
- **Form State Management** - Automatic form state persistence using localStorage with expiry

## 🛠️ Tech Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite 7.x
- **Testing**: Vitest with jsdom
- **Styling**: Pure CSS with modular architecture
- **Deployment**: Netlify
- **Analytics**: Plausible (privacy-focused)
- **Form Handling**: FormSubmit.co

## 📁 Project Structure

```
├── index.html              # Main HTML file with semantic markup
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── public/                 # Static assets
│   ├── robots.txt          # Search engine crawling rules
│   ├── sitemap.xml         # Site structure for SEO
│   └── site.webmanifest    # PWA manifest
├── src/
│   ├── assets/             # Images and media files
│   ├── content/            # JSON content files
│   │   ├── about.json
│   │   ├── services.json
│   │   └── testimonials.json
│   ├── lib/
│   │   ├── index.js        # Main application entry point
│   │   └── components/     # Modular JavaScript components
│   │       ├── carousel/   # Auto-advancing testimonial carousel
│   │       ├── form/       # Form submission handler
│   │       ├── header/     # Navigation and mobile menu
│   │       ├── modal/      # Booking modal with focus trap
│   │       ├── state/      # Form state management
│   │       └── store/      # LocalStorage management
│   └── styles/             # Modular CSS architecture
│       ├── index.css       # Main stylesheet (imports all modules)
│       ├── base/           # Base styles (reset, typography, layout)
│       ├── components/     # Component-specific styles
│       └── helpers/        # Utility classes
└── coverage/               # Test coverage reports
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
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

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

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
- Hashed FormSubmit.co endpoint
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
- Node version: 18+

## 🧩 Component Architecture

### Carousel Component

- Self-contained with visibility observer
- Configurable interval timing
- Responsive slide width calculation
- Intersection Observer for performance

### Form Handler

- Dependency injection for state management
- Event delegation for form submission
- Integration with FormSubmit.co
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

For business inquiries, please visit [kailistutoring.netlify.app](https://kailistutoring.netlify.app/) or email kailistacey@gmail.com

---

**Built with ❤️ using Vanilla JavaScript and Vite**
