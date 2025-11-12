# RSS Renaissance 🎃

> Resurrect RSS feeds with modern AI capabilities, making information consumption intelligent, private, and delightful.

[![CI/CD Pipeline](https://github.com/username/rss-renaissance/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/username/rss-renaissance/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

## ✨ Features

- 🚀 **RSS Feed Ingestion** - Subscribe to unlimited RSS/Atom feeds with auto-discovery
- 🔄 **Smart Deduplication** - Automatically merge duplicate articles across feeds
- 🤖 **AI Summarization** - Generate concise summaries with key points and sentiment analysis
- 🏷️ **Auto-Categorization** - Intelligently organize articles by topic
- 🌙 **Dark Mode First** - Beautiful Halloween-themed UI with smooth transitions
- ⚡ **Offline-First** - Works without internet after initial load
- 🔒 **Privacy-Focused** - No tracking, all data stored locally
- ♿ **Accessible** - WCAG 2.1 AA compliant with keyboard navigation
- 📱 **Responsive** - Works on mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm 10+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/username/rss-renaissance.git
cd rss-renaissance

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database (optional for MVP - uses in-memory storage)
DATABASE_URL="postgresql://user:password@localhost:5432/rss_renaissance"

# Redis Cache (optional - uses in-memory mock in development)
REDIS_URL="redis://localhost:6379"

# OpenAI for AI Summarization (optional - uses mock in development)
OPENAI_API_KEY="sk-your-key-here"
OPENAI_MODEL="gpt-4o-mini"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Summarization Settings
SUMMARY_CACHE_TTL="0"  # 0 = never expire
SUMMARIZER_RATE_LIMIT="100"  # requests per hour
SUMMARIZER_RATE_WINDOW_MS="3600000"  # 1 hour
```

See [.env.example](.env.example) for all available options.

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Database (when using PostgreSQL)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio

# Validation
npm run validate     # Run type-check, lint, and tests
```

### Project Structure

```
rss-renaissance/
├── .github/          # GitHub Actions workflows
├── .kiro/            # Kiro AI configuration (see KIRO_INTEGRATION.md)
├── docs/             # Documentation
├── public/           # Static assets
├── scripts/          # Utility scripts
├── screenshots/      # UI screenshots
├── src/
│   ├── app/          # Next.js app router
│   ├── components/   # React components
│   ├── lib/          # Core logic and utilities
│   └── types/        # TypeScript types
└── tests/            # Test files
```

## 🎨 Screenshots

### Home Page (Dark Mode)
![Home Page](screenshots/01-home-dark-mode.png)

### Feed Expanded with Articles
![Feed Expanded](screenshots/02-feed-expanded.png)

### AI Summary with Key Points
![AI Summary](screenshots/04-article-summary-complete.png)

### Summary Generation Animation
![Summary Animation](screenshots/12-summary-reveal-animation.gif)

See [screenshots/SCREENSHOTS.md](screenshots/SCREENSHOTS.md) for complete list.

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Accessibility Testing

```bash
# Start dev server
npm run dev

# Run accessibility tests (in another terminal)
chmod +x scripts/a11y-and-lighthouse.sh
./scripts/a11y-and-lighthouse.sh
```

See [TESTING.md](TESTING.md) and [docs/accessibility.md](docs/accessibility.md) for details.

## 📚 Documentation

- [Testing Guide](TESTING.md) - How to run and write tests
- [Accessibility Guide](docs/accessibility.md) - A11y standards and testing
- [API Examples](API_EXAMPLES.md) - API endpoint documentation
- [Kiro Integration](KIRO_INTEGRATION.md) - Using Kiro AI features
- [Setup Interactive UI](SETUP_INTERACTIVE_UI.md) - Framer Motion setup
- [GitHub Workflows](.github/workflows/README.md) - CI/CD pipeline

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/rss-renaissance)

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Environment Variables

Set these in Vercel dashboard:

```
DATABASE_URL
REDIS_URL
OPENAI_API_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_API_URL
```

See [.github/SETUP_SECRETS.md](.github/SETUP_SECRETS.md) for detailed setup.

### Deploy to Other Platforms

#### Netlify

```bash
npm run build
# Deploy the .next folder
```

#### Docker

```bash
# Build image
docker build -t rss-renaissance .

# Run container
docker run -p 3000:3000 rss-renaissance
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI**: React 19 + Framer Motion
- **State**: Zustand
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library
- **Database**: PostgreSQL + Prisma (optional)
- **Cache**: Redis (optional)
- **AI**: OpenAI GPT-4o-mini

### Key Features

- **Offline-First**: IndexedDB for local storage
- **Privacy-First**: No tracking, local-first data
- **Performance-First**: < 2s page loads, 60fps animations
- **Cost-Conscious**: Aggressive caching, batch processing

See [.kiro/steering/architecture.md](.kiro/steering/architecture.md) for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenAI](https://openai.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Developed with [Kiro AI](https://kiro.ai/)

## 📞 Support

- 📧 Email: support@rss-renaissance.com
- 🐛 Issues: [GitHub Issues](https://github.com/username/rss-renaissance/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/username/rss-renaissance/discussions)
- 📖 Docs: [Documentation](https://docs.rss-renaissance.com)

## 🗺️ Roadmap

### MVP (Current)
- [x] RSS feed ingestion
- [x] Deduplication
- [x] AI summarization
- [x] Auto-categorization
- [x] Dark mode UI

### v1.1 (Next)
- [ ] Advanced search and filtering
- [ ] Reading analytics
- [ ] Browser extension
- [ ] Mobile apps

### v2.0 (Future)
- [ ] Social features
- [ ] Collaborative folders
- [ ] Advanced AI features
- [ ] Integration with other services

See [.kiro/specs/project-overview.md](.kiro/specs/project-overview.md) for complete roadmap.

---

**Made with ❤️ and AI** | [Website](https://rss-renaissance.com) | [Demo](https://demo.rss-renaissance.com)
