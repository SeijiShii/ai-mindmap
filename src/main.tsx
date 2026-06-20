import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Analytics } from '@vercel/analytics/react';
import { AppShell } from './app/App';
import { initSentry } from './observability/sentry';
import './styles/tokens.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// SEC-003 / O01: error monitoring with PII masking (dormant without a DSN).
initSentry(import.meta.env.VITE_SENTRY_DSN as string | undefined, import.meta.env.MODE);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <AppShell />
      {/* O02: cookieless analytics (no-op until deployed on Vercel) */}
      <Analytics />
    </ClerkProvider>
  </StrictMode>,
);
