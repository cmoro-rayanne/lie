import './init';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Load side-effect files to populate window.ElianaLinoDesignSystem_6994f2, window.Icons, window.useInView
import './_ds_bundle.js';
import './ui_kits/landing/icons';
import './ui_kits/landing/helpers';

import './index.css';
import LandingPage from './ui_kits/landing';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>
);
