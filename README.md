# Next.js Starter Template

A Next.js template with authentication, database integration, and development tooling.

## Features

- **Authentication**: Magic link + OAuth providers
- **Database**: PostgreSQL with Prisma ORM
- **Code Quality**: ESLint, Prettier, TypeScript

## Directory Structure

```
├── actions/         # Server actions and APIs
├── app/             # App router pages and layouts. Prefer to group by feature
├── components/      # Reusable UI components. Prefer to group by feature
│   ├── ui/          # shadcn/ui components
│   ├── auth/        # Authentication components
│   └── [feature]/   # Feature-specific components
├── data/            # Database queries and data access layer
├── env/             # Environment variables
├── hooks/           # Client-side React hooks
├── lib/             # Server-side utilities
├── schemas/         # Form validation schemas
└── types/           # TypeScript type definitions
```

## Coding Standards

### Code Organization
- **Server vs Client**: Use `lib/` for server code, `hooks/` for client code
- **Data Fetching**: Keep database queries in `data/` directory
- **Validation**: Define schemas in `schemas/` (separate from database schemas)
- **Actions**: Server actions in `actions/` with proper error handling

### TypeScript
- Always define prop interfaces for components
- Export types from `types/` directory for reuse

### Git Workflow
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`)
- **Branches**: Feature branches from `main`
- **PRs**: Include description and testing notes

## Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and auth provider credentials
# Remember to set up an email service for OTP verification

# Run development server
pnpm dev

# Other commands
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript check
```