import { StrictMode, useState, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LandingPage } from './pages/landing-page.tsx'
import { SharedPreviewPage } from './pages/shared-preview-page.tsx'
import { RsvpLandingPage } from './pages/rsvp-landing-page.tsx'

const AdminApp = lazy(() => import('./pages/admin/admin-app.tsx'))
const WeddingWebsitePage = lazy(() => import('./pages/wedding-website-page.tsx'))
const PhotoUploadPage = lazy(() => import('./pages/photo-upload-page.tsx'))
const TaskLandingPage = lazy(() => import('./pages/task-landing-page.tsx'))

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
  if (hash.startsWith('#/rsvp/')) {
    const rsvpToken = hash.slice('#/rsvp/'.length).split('/')[0];
    return <RsvpLandingPage token={rsvpToken} />;
  }
  if (hash.startsWith('#/shared/')) {
    const shareId = hash.replace('#/shared/', '');
    return <SharedPreviewPage shareId={shareId} />;
  }
  if (hash.startsWith('#/w/')) {
    const slug = hash.slice('#/w/'.length).split('/')[0];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <WeddingWebsitePage slug={slug} />
      </Suspense>
    );
  }
  if (hash.startsWith('#/photos/')) {
    const photoToken = hash.slice('#/photos/'.length).split('/')[0];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PhotoUploadPage token={photoToken} />
      </Suspense>
    );
  }
  if (hash.startsWith('#/tasks/')) {
    const taskToken = hash.slice('#/tasks/'.length).split('/')[0];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <TaskLandingPage token={taskToken} />
      </Suspense>
    );
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
