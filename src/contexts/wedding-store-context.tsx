import { createContext, useContext } from 'react'
import type { WeddingStore } from '@/hooks/use-wedding-store'

export type WeddingStoreContextValue = WeddingStore & { userId?: string }

export const WeddingStoreContext = createContext<WeddingStoreContextValue | null>(null)

export function useWeddingStoreContext(): WeddingStoreContextValue {
  const store = useContext(WeddingStoreContext)
  if (!store) throw new Error('useWeddingStoreContext must be used within WeddingStoreContext.Provider')
  return store
}
