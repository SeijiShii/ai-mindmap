import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { AppShell } from './app/App';
import './styles/tokens.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <AppShell />
    </ClerkProvider>
  </StrictMode>,
);
