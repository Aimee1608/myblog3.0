import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';

// Edge-safe config (no DB access) — shared by middleware and the full node config.
// GitHub provider auto-reads AUTH_GITHUB_ID / AUTH_GITHUB_SECRET from env.
const adminIds = (process.env.ADMIN_USER_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default {
  providers: [GitHub],
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
      if (!isAdminPath) return true;
      return Boolean(auth?.user?.isAdmin);
    },
    jwt({ token, profile }) {
      if (profile) {
        const login = (profile.login as string) ?? String(profile.id ?? '');
        token.userId = login;
        token.isAdmin = adminIds.includes(login);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.userId = (token.userId as string) ?? '';
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
