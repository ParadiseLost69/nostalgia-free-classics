'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

/**
 * Sign-in buttons. Uses the client `signIn` so the page fully reloads after
 * authentication and every client component sees the new session.
 * @param {{ providers: Array<{ id: string, name: string }>, devLogin: boolean, callbackUrl: string }} props
 */
export function SignInOptions({ providers, devLogin, callbackUrl }) {
  const [busy, setBusy] = useState(false);

  return (
    <>
      <div className="mt-4 space-y-2">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            className="btn-bevel btn-grape w-full"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              signIn(p.id, { redirectTo: callbackUrl });
            }}
          >
            Sign in with {p.name}
          </button>
        ))}
        {!providers.length && !devLogin && (
          <p className="text-sm">
            No sign-in providers are configured. Set <code>AUTH_GOOGLE_ID</code> or{' '}
            <code>AUTH_GITHUB_ID</code> in <code>.env.local</code>.
          </p>
        )}
      </div>

      {devLogin && (
        <>
          <hr className="dotted-divider" />
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              setBusy(true);
              const email = new FormData(e.currentTarget).get('email');
              signIn('dev-login', { email, redirectTo: callbackUrl });
            }}
          >
            <p className="text-xs font-bold text-grape-700">Development sign-in (disabled in production)</p>
            <label htmlFor="dev-email" className="field-label">
              Email
            </label>
            <input id="dev-email" name="email" type="email" required className="field-input" autoComplete="email" />
            <p className="field-hint">Use the seeded ADMIN_EMAIL for admin access; any other email is a reader.</p>
            <button type="submit" className="btn-bevel w-full" disabled={busy}>
              {busy ? 'Signing in…' : 'Dev sign in'}
            </button>
          </form>
        </>
      )}
    </>
  );
}
