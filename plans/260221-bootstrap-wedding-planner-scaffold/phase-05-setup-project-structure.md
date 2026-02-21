---
phase: 5
title: "Setup Project Structure & Config"
status: pending
priority: P2
effort: 40m
---

# Phase 5: Setup Project Structure & Config

## Context Links

- [Vite + React Setup Report](../reports/researcher-vite-react-setup.md) — section 6
- [shadcn + Tailwind v4 Report](../reports/researcher-shadcn-tailwind-v4.md) — sections 5-6

## Overview

- **Priority:** P2
- **Status:** Pending
- **Description:** Organize the final directory structure, create layout components (header, footer, root layout), update `App.tsx` with a basic landing page using shadcn components, and move CSS to the `styles/` directory. Ensure everything compiles and renders.

## Key Insights

- Keep files under 200 lines; use composition
- kebab-case for all file names
- `src/components/ui/` already populated by shadcn (Phase 2)
- `src/lib/utils.ts` already exists with `cn()` utility (Phase 2)
- Layout components are thin wrappers — no business logic
- `App.tsx` landing page uses shadcn Card + Button for visual verification

## Requirements

### Functional
- All directories from project structure exist
- Layout components (root-layout, header, footer) render basic shell
- `App.tsx` displays a landing page with shadcn Card, Button, Badge
- CSS entry point remains functional (whether at `src/index.css` or `src/styles/index.css`)

### Non-Functional
- No file exceeds 200 lines
- kebab-case file naming throughout
- Placeholder directories have `.gitkeep` if empty (so git tracks them)
- No business logic — only scaffold/layout

## Architecture

```
src/
  components/
    ui/              ← shadcn (already exists from Phase 2)
    layout/
      root-layout.tsx
      header.tsx
      footer.tsx
  lib/
    utils.ts         ← already exists (Phase 2)
    redis.ts         ← already exists (Phase 4)
  db/
    schema.ts        ← already exists (Phase 4)
    index.ts         ← already exists (Phase 4)
  hooks/             ← empty placeholder
  pages/             ← empty placeholder
  types/             ← empty placeholder
  App.tsx            ← updated with layout + landing
  main.tsx           ← unchanged
  vite-env.d.ts      ← unchanged
api/
  health.ts          ← already exists (Phases 3-4)
```

## Related Code Files

### Files to Create
- `src/components/layout/root-layout.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/hooks/.gitkeep`
- `src/pages/.gitkeep`
- `src/types/.gitkeep`

### Files to Modify
- `src/App.tsx` — replace with layout + landing page
- `src/App.css` — delete (no longer needed; Tailwind handles all styling)

### Files to Delete
- `src/App.css` (Vite template default; replaced by Tailwind)
- `src/assets/react.svg` (template boilerplate; not needed)

## Implementation Steps

1. **Create directory structure**
   ```bash
   mkdir -p src/components/layout
   mkdir -p src/hooks
   mkdir -p src/pages
   mkdir -p src/types
   ```

2. **Add .gitkeep to empty directories**
   ```bash
   touch src/hooks/.gitkeep
   touch src/pages/.gitkeep
   touch src/types/.gitkeep
   ```

3. **Create `src/components/layout/header.tsx`**
   ```tsx
   export function Header() {
     return (
       <header className="border-b">
         <div className="container mx-auto flex h-16 items-center px-4">
           <h1 className="text-xl font-semibold">Wedding Planner</h1>
         </div>
       </header>
     );
   }
   ```

4. **Create `src/components/layout/footer.tsx`**
   ```tsx
   export function Footer() {
     return (
       <footer className="border-t">
         <div className="container mx-auto flex h-14 items-center justify-center px-4">
           <p className="text-sm text-muted-foreground">
             Wedding Planner &copy; {new Date().getFullYear()}
           </p>
         </div>
       </footer>
     );
   }
   ```

5. **Create `src/components/layout/root-layout.tsx`**
   ```tsx
   import { Header } from "./header";
   import { Footer } from "./footer";

   interface RootLayoutProps {
     children: React.ReactNode;
   }

   export function RootLayout({ children }: RootLayoutProps) {
     return (
       <div className="flex min-h-screen flex-col">
         <Header />
         <main className="flex-1">{children}</main>
         <Footer />
       </div>
     );
   }
   ```

6. **Update `src/App.tsx`** — landing page with shadcn components
   ```tsx
   import { RootLayout } from "@/components/layout/root-layout";
   import { Button } from "@/components/ui/button";
   import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
   } from "@/components/ui/card";
   import { Badge } from "@/components/ui/badge";

   function App() {
     return (
       <RootLayout>
         <div className="container mx-auto px-4 py-16">
           <div className="mx-auto max-w-2xl text-center">
             <Badge variant="secondary" className="mb-4">
               Under Construction
             </Badge>
             <h2 className="mb-4 text-4xl font-bold tracking-tight">
               Wedding Planner
             </h2>
             <p className="mb-8 text-lg text-muted-foreground">
               Your perfect day, perfectly planned.
             </p>
             <Card>
               <CardHeader>
                 <CardTitle>Getting Started</CardTitle>
                 <CardDescription>
                   This scaffold is ready for development.
                 </CardDescription>
               </CardHeader>
               <CardContent className="flex justify-center gap-4">
                 <Button>Get Started</Button>
                 <Button variant="outline">Learn More</Button>
               </CardContent>
             </Card>
           </div>
         </div>
       </RootLayout>
     );
   }

   export default App;
   ```

7. **Delete boilerplate files**
   ```bash
   rm -f src/App.css
   rm -f src/assets/react.svg
   ```
   - Also remove the `import './App.css'` line from App.tsx if it was kept
   - Remove `src/assets/` directory if empty after deletion

8. **Verify compilation**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

9. **Verify dev server renders correctly**
   ```bash
   npm run dev
   ```
   - Confirm header, footer, and card render with proper styling

## Todo List

- [ ] Create `src/components/layout/` directory
- [ ] Create `src/hooks/`, `src/pages/`, `src/types/` directories
- [ ] Add `.gitkeep` to empty placeholder directories
- [ ] Create `header.tsx` layout component
- [ ] Create `footer.tsx` layout component
- [ ] Create `root-layout.tsx` layout component
- [ ] Update `App.tsx` with layout + shadcn landing page
- [ ] Delete `src/App.css` and `src/assets/react.svg`
- [ ] Remove stale imports from App.tsx
- [ ] Run `tsc --noEmit` — passes
- [ ] Run `npm run build` — succeeds
- [ ] Verify dev server renders landing page correctly

## Success Criteria

- All directories exist per project structure
- Layout components render header/footer shell
- `App.tsx` uses shadcn Card, Button, Badge components
- No `App.css` or template boilerplate remains
- `tsc --noEmit` passes
- `npm run build` succeeds
- Dev server renders styled landing page

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Path alias not resolving in layout imports | Low | Medium | Already configured in Phase 2 |
| shadcn component import errors | Low | Low | Components installed in Phase 2 |
| CSS variable mismatch | Low | Low | shadcn init handles theming setup |

## Security Considerations

- No user input or data handling
- No API calls from frontend
- Layout components are static — no XSS surface

## Next Steps

- Proceed to Phase 6: Finalize & Verify
