# Wedding Planner

A wedding planning application built with modern web technologies.

## Tech Stack

- **Frontend:** Vite 7.x + React 19 + TypeScript 5.x
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Backend:** Vercel Serverless Functions
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Cache:** Upstash Redis

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+

### Setup

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

### Available Scripts

| Script | Description |
|--------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (tsc + vite) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run Drizzle migrations |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
  components/
    ui/            # shadcn/ui components
    layout/        # Layout components (header, footer, root-layout)
  lib/             # Utilities (cn, redis helper)
  db/              # Database schema and connection helper
  hooks/           # Custom React hooks
  pages/           # Page components
  types/           # TypeScript type definitions
api/               # Vercel serverless functions
docs/              # Project documentation
plans/             # Implementation plans
```

## Environment Variables

See `.env.example` for required variables:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Or connect your Git repository to Vercel for automatic deployments.
