import { StrictMode, useState, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LandingPage } from './pages/landing-page.tsx'
import { SharedPreviewPage } from './pages/shared-preview-page.tsx'

const AdminApp = lazy(() => import('./pages/admin/admin-app.tsx'))

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  if (hash === '#/app' || hash.startsWith('#/app/')) return <App />;
  if (hash.startsWith('#/shared/')) {
    const shareId = hash.replace('#/shared/', '');
    return <SharedPreviewPage shareId={shareId} />;
  }
  if (hash.startsWith('#/admin')) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminApp />
      </Suspense>
    );
  }
  return <LandingPage />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
