import { redirect } from 'next/navigation';
import { Panel } from '@/components/ui/Panel';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { SignInOptions } from '@/components/layout/SignInOptions';
import { getSession, signInProviders } from '@/lib/auth';

export const metadata = {
  title: 'Sign in',
  robots: { index: false },
};

/** Only allow same-site relative callback URLs (prevents open redirects). */
function safeCallback(value) {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') ? v : '/';
}

const ERRORS = {
  CredentialsSignin: 'That email could not be used to sign in.',
  OAuthAccountNotLinked: 'That email is already linked to a different sign-in method.',
  AccessDenied: 'Access denied.',
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const session = await getSession();
  if (session?.user) redirect(callbackUrl);

  const errorKey = Array.isArray(params.error) ? params.error[0] : params.error;
  const error = errorKey ? (ERRORS[errorKey] ?? 'Sign-in failed. Please try again.') : null;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Panel title="Sign in" icon={<PixelIcon name="key" className="text-teal-300" />} id="login">
        <p className="text-sm">
          Signing in lets you comment on reviews. That&rsquo;s it: no newsletter, no loot boxes.
        </p>

        {error && (
          <p role="alert" className="mt-3 border-2 border-red-700 bg-red-50 px-2 py-1 text-sm font-bold text-red-800">
            {error}
          </p>
        )}

        <SignInOptions
          providers={signInProviders.filter((p) => p.id !== 'dev-login')}
          devLogin={signInProviders.some((p) => p.id === 'dev-login')}
          callbackUrl={callbackUrl}
        />
      </Panel>
    </div>
  );
}
