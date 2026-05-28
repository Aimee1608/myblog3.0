import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { dbConnect } from '@/lib/db/connect';
import { UserModel } from '@/lib/db/models';

const adminIds = (process.env.ADMIN_USER_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Upsert the logged-in GitHub user into the legacy `user` collection,
    // keeping the existing schema (userId = github login, origin = 'github').
    async signIn({ profile }) {
      if (!profile) return true;
      try {
        await dbConnect();
        const userId = (profile.login as string) ?? String(profile.id ?? '');
        const isAdmin = adminIds.includes(userId);
        await UserModel.updateOne(
          { userId, origin: 'github' },
          {
            $set: {
              username: (profile.name as string) || userId,
              avatar: profile.avatar_url as string,
              email: (profile.email as string) ?? undefined,
              origin: 'github',
              lastLoginDate: new Date(),
              lastModifiedDate: new Date(),
              ...(isAdmin ? { status: 1 } : {}),
            },
            $setOnInsert: { createDate: new Date(), webBlogState: 0 },
          },
          { upsert: true },
        );
      } catch (e) {
        console.error('signIn upsert failed:', e);
      }
      return true;
    },
  },
});
