# Code Standards

## File Organization

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   └── layout/          # Reusable layout containers
├── pages/               # Page-level components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
├── db/                  # Database layer
├── types/               # TypeScript definitions
└── main.tsx             # App entry point

api/                     # Vercel serverless handlers
```

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Files | kebab-case, English only | `user-profile.tsx`, `create-db.ts` |
| Exports | PascalCase (components), camelCase (functions) | `UserCard`, `fetchUser()` |
| Types | PascalCase, English only | `User`, `WeddingEvent` |
| Constants | UPPER_SNAKE_CASE, English only | `MAX_GUESTS`, `DEFAULT_TIMEOUT` |
| Private variables | camelCase, English only | `tempCache`, `isLoading` |

### Naming Rules (MANDATORY)

1. **English only** — All file names, variable names, function names, type names, and constant names MUST be in English. No Vietnamese variable names.
2. **No abbreviations** — Use descriptive, self-documenting names. `checklist` not `cl`, `name` not `nm`, `budget` not `bud`. Single-letter names only allowed for loop counters (`i`, `j`).
3. **No unaccented Vietnamese** — Vietnamese text in UI strings MUST use proper diacritics (`Đã hoàn thành` not `Da hoan thanh`). If a string is meant for display, use correct Vietnamese. If it's a variable name, use English.
4. **Property names** — Type/interface properties must be full English words: `text` not `t`, `cost` not `c`, `ritualSteps` not `ri`.

**Bad:**
```typescript
interface Guest { n: string; p: string; s: string; g: string; }
const STATUS = { label: "Da xong", cls: "bg-green-500" };
```

**Good:**
```typescript
interface Guest { name: string; phone: string; side: string; tableGroup: string; }
const STATUS = { label: "Đã xong", cls: "bg-green-500" };
```

## File Size Limits

- **Max 200 lines per file** - Enforced
- Split large files into focused modules
- Components = one responsibility
- Utilities = related functions only

## TypeScript Configuration

- **Strict mode enabled** - All compilation options active
- `noUnusedLocals: true`, `noUnusedParameters: true`
- `verbatimModuleSyntax: true` for type safety
- Path alias `@/` → `src/` for clean imports

Example import:
```typescript
import { Button } from "@/components/ui/button";
import { createDb } from "@/db";
```

## Service Factory Pattern

Database and Redis are initialized via factory functions to support lazy loading and testing.

```typescript
// src/db/index.ts
export function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not set");
  const sql = neon(databaseUrl);
  return drizzle(sql);
}

// Usage in API routes
import { createDb } from "@/db";
const db = createDb();
```

## shadcn/ui Component Management

- Style: New York
- Base color: Neutral
- All UI components in `src/components/ui/`
- Owned by project (not auto-updated)
- Install via: `shadcn-ui@latest add <component>`

Example usage:
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Tailwind CSS v4 & Theme Variables

- CSS-first approach (CSS layers in globals)
- `@tailwindcss/vite` plugin active
- Neutral color palette configured
- No custom CSS when Tailwind covers it
- **Theme CSS variables** applied dynamically via App.tsx based on user-selected theme

Theme variable naming convention (kebab-case, `--theme-` prefix):
- `--theme-primary` - Main brand color (hex)
- `--theme-primary-dark` - Darker variant (hex)
- `--theme-primary-light` - Light background variant (hex)
- `--theme-accent` - Highlight/accent color (hex)
- `--theme-surface` - Card background (hex)
- `--theme-surface-muted` - Nested section background (hex)
- `--theme-border` - Card border color (hex)
- `--theme-bg` - Page background (hex)
- `--theme-note-bg` - Notes callout background (hex)
- `--theme-note-border` - Notes callout border (hex)
- `--theme-note-text` - Notes callout text color (hex)

**Usage:**
```typescript
// In components
export default function Card() {
  return <div style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-border)' }}
              className="border rounded-lg p-4" />;
}

// Tailwind arbitrary values work too:
<div className="bg-[var(--theme-surface)] border-[var(--theme-border)]" />
```

Define theme tokens in `src/data/themes.ts` as `AppTheme` interface, then apply in App.tsx root style.

## Error Handling

- Use try-catch in async operations
- Provide meaningful error messages
- Log errors with context
- Return appropriate HTTP status codes in APIs

```typescript
export async function getGuestList() {
  try {
    const db = createDb();
    return await db.select().from(guests);
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    throw new Error("Database query failed");
  }
}
```

## Environment Variables

All secrets in `.env.local`. See `.env.example` for required keys:
- `DATABASE_URL` - Neon PostgreSQL
- `UPSTASH_REDIS_REST_URL` - Redis REST endpoint
- `UPSTASH_REDIS_REST_TOKEN` - Redis auth token
- `Z_AI_KEY` - ZhipuAI API key (server-side only)
- `ADMIN_PASSWORD` - Admin panel password

## Rate Limiting Pattern

Use `@upstash/ratelimit` with sliding window algorithm for API endpoints:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { createRedis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 req/min
});

const { success } = await ratelimit.limit(clientId);
if (!success) return new Response("Too many requests", { status: 429 });
```

## Atomic Operations

For one-time actions (RSVP responses), use database transactions to prevent duplicates:

```typescript
await db.transaction(async (tx) => {
  const existing = await tx.select().from(table).where(eq(token, id));
  if (existing.length > 0) throw new Error("Already responded");
  await tx.insert(table).values(data);
});
```

## XSS Prevention

Sanitize user inputs before rendering in HTML:
- Escape venue map links with `encodeURI()`
- Use React's built-in escaping for text content
- Validate URLs before rendering in `href` attributes

## CSV Export Security

Prevent formula injection in exported data:
- Prefix cells starting with `=`, `+`, `@`, `-` with single quote (`'`)
- Use standard CSV formatting (proper quoting, escaped quotes)
- Example: `'=HYPERLINK(...)` becomes `'=HYPERLINK(...)` in output

## Linting

Run ESLint before commits:
```bash
npm run lint
```

Enforce: no unused variables, proper React hooks, import ordering.

## Build & Deployment

```bash
npm run build    # TypeScript compile + Vite bundle
npm run preview  # Test production build locally
npx vercel       # Deploy to Vercel
```
