import './init';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Load side-effect files to populate window.ElianaLinoDesignSystem_6994f2, window.Icons, window.useInView
import './_ds_bundle.js';
import './ui_kits/landing/icons';
import './ui_kits/landing/helpers';

import './index.css';
import LandingPage from './ui_kits/landing';

// O painel só é baixado em /admin (e /admin/...). A landing não carrega esse código.
// eslint-disable-next-line react-refresh/only-export-components
const AdminApp = lazy(() => import('./admin/AdminApp'));
const { pathname } = window.location;
const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPath ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <LandingPage />
    )}
    <SpeedInsights />
  </StrictMode>,
);
