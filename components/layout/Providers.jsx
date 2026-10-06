'use client';

import { SessionProvider } from 'next-auth/react';

/** Client-side session context (used for comment controls and the user menu). */
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
