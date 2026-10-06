import 'server-only';
import { cache } from 'react';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { z } from 'zod';
import { prisma } from './prisma';

const devLoginEnabled =
  process.env.AUTH_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production';

/*
 * The admin account is created by the seed script before it has an OAuth
 * account linked. Google and GitHub both verify email addresses, so we allow
 * them to link to an existing user with the same email. Roles are never set
 * from the UI: new users get the schema default (READER).
 */
const providers = [];
if (process.env.AUTH_GOOGLE_ID) {
  providers.push(Google({ allowDangerousEmailAccountLinking: true }));
}
if (process.env.AUTH_GITHUB_ID) {
  providers.push(GitHub({ allowDangerousEmailAccountLinking: true }));
}
if (devLoginEnabled) {
  // Local-only convenience so the site can be exercised without OAuth apps.
  providers.push(
    Credentials({
      id: 'dev-login',
      name: 'Dev login',
      credentials: { email: { label: 'Email', type: 'email' } },
      async authorize(credentials) {
        const parsed = z.object({ email: z.email() }).safeParse(credentials);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        return prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: email.split('@')[0] },
        });
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // JWT sessions are required by the Credentials provider; the role is
  // re-read from the database on every request so demotions apply at once.
  session: { strategy: 'jwt' },
  providers,
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      if (!token.sub) return null;
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { role: true, name: true, image: true },
      });
      if (!dbUser) return null;
      token.role = dbUser.role;
      token.name = dbUser.name;
      token.picture = dbUser.image;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

/** Providers shown on the login page. */
export const signInProviders = providers.map((p) => {
  const config = typeof p === 'function' ? p() : p;
  return { id: config.options?.id ?? config.id, name: config.options?.name ?? config.name };
});

/** Current session, deduplicated per request. */
export const getSession = cache(() => auth());

/** @param {import('next-auth').Session | null} session */
export function isAdmin(session) {
  return session?.user?.role === 'ADMIN';
}

export class AuthorizationError extends Error {
  constructor(message = 'Not authorized') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/** Throws unless the current user is signed in. Returns the session. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) throw new AuthorizationError('You must be signed in.');
  return session;
}

/** Throws unless the current user is an ADMIN. Returns the session. */
export async function requireAdmin() {
  const session = await getSession();
  if (!isAdmin(session)) throw new AuthorizationError('Admins only.');
  return session;
}
