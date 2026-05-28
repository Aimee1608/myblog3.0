import NextAuth from 'next-auth';
import authConfig from './auth.config';

// Edge middleware: uses only the edge-safe config. The `authorized` callback
// in auth.config gates /admin paths.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware(() => {
  // No-op: protection is handled by the `authorized` callback.
});

export const config = {
  matcher: ['/admin/:path*'],
};
