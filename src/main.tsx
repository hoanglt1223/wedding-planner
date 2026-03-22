import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'

// Redirect old hash URLs to pathname URLs
const hash = window.location.hash
if (hash.startsWith('#/')) {
  window.history.replaceState(null, '', hash.slice(1))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
