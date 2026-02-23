# Research Report: shadcn/ui Tabs + React localStorage Hook

**Date:** 2026-02-21
**Topics:** shadcn/ui Tabs component (React 19 + Tailwind v4), React useLocalStorage hook pattern

---

## 1. shadcn/ui Tabs Component

### Installation
```bash
pnpm dlx shadcn@latest add tabs
# Or with npm (use --force or --legacy-peer-deps if peer dep issues)
npm install --legacy-peer-deps
```

### Import Pattern
```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
```

### Usage Example
```typescript
export function TabsExample() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}
```

### React 19 Compatibility
- Full support in latest shadcn/ui versions
- Replace deprecated `React.ElementRef` with `React.ComponentRef` if found
- No Tailwind v4 specific changes needed (standard Tailwind CSS classes work)

---

## 2. React useLocalStorage Hook Pattern

### Core Implementation (TypeScript)
```typescript
import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { deserializer?: (value: string) => T; serializer?: (value: T) => string }
): [T, SetValue<T>] {
  const deserializer = options?.deserializer || JSON.parse
  const serializer = options?.serializer || JSON.stringify

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      return item ? deserializer(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue: SetValue<T> = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(valueToStore))
      }
    } catch (err) {
      console.error(`localStorage error for key "${key}":`, err)
    }
  }, [key, storedValue, serializer, deserializer])

  return [storedValue, setValue]
}
```

### Usage Example
```typescript
function MyComponent() {
  const [name, setName] = useLocalStorage('user_name', 'Guest')

  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name}</p>
    </>
  )
}
```

### Best Practices
1. **Error Handling** - Wrap in try-catch; gracefully degrade in private browsing/quota exceeded
2. **Functional Updates** - Support value or update function like `useState`
3. **Server-Side Rendering** - Check `typeof window` to avoid SSR errors
4. **Initialization Function** - Use lazy initializer to prevent unnecessary recalculations
5. **Synchronization** - Optional: dispatch custom events to sync across tabs

### Alternative: Use Existing Libraries
- **usehooks-ts** - Production-ready, tree-shakable, TypeScript-first
- Import: `import { useLocalStorage } from 'usehooks-ts'`

---

## Key Integration Points for Wedding Planner

- **Tabs**: Use for guestlist, timeline, budget sections in dashboard
- **localStorage**: Persist user preferences (tab selection, filters, draft data)
- Both fully compatible with current stack (React 19, Tailwind v4, shadcn/ui 3.8.5)

---

## Sources

- [Tabs - shadcn/ui](https://ui.shadcn.com/docs/components/radix/tabs)
- [React 19 - shadcn/ui](https://ui.shadcn.com/docs/react-19)
- [useLocalStorage | usehooks-ts](https://usehooks-ts.com/react-hook/use-local-storage)
- [useLocalStorage React Hook – useHooks](https://usehooks.com/uselocalstorage)
