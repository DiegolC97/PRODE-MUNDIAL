/**
 * authOptions — NextAuth.js configuration for PRODE MUNDIAL.
 *
 * Strategy: JWT sessions (no DB session store).
 * Provider: Credentials (email + bcrypt password).
 * JWT payload: { userId, username } — no PII beyond username.
 *
 * Export this object and pass it to NextAuth() in the route handler.
 * It is also re-exported so other server code can call
 * `getServerSession(authOptions)` to read the current session.
 */
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authorizeUser } from '../application/authorizeUser';

export const authOptions: NextAuthOptions = {
  /**
   * Use JWT-based sessions — no session table required in the DB.
   * `maxAge` mirrors the cookie lifetime (7 days).
   */
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      /**
       * Called by NextAuth when the user submits the sign-in form.
       * Must return a User-shaped object on success, or null on failure.
       * The returned object is the raw `user` argument in the jwt callback.
       */
      async authorize(credentials) {
        const authUser = await authorizeUser(
          credentials?.email,
          credentials?.password,
        );

        if (!authUser) return null;

        // NextAuth expects an object with at least `id`; we add our custom fields.
        return {
          id: authUser.userId,
          userId: authUser.userId,
          username: authUser.username,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * jwt — runs when a JWT is created (sign-in) or accessed (every request).
     * On sign-in `user` is populated; on subsequent requests only `token` exists.
     */
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: persist our custom claims into the token.
        token.userId = user.userId;
        token.username = user.username;
      }
      return token;
    },

    /**
     * session — runs every time `getServerSession` / `useSession` is called.
     * Copies custom claims from the JWT into the session object returned to clients.
     */
    async session({ session, token }) {
      session.user = {
        userId: token.userId,
        username: token.username,
      };
      return session;
    },
  },

  /**
   * Disable the built-in pages — this project will provide its own UI.
   * The API routes still work (sign-in via POST /api/auth/callback/credentials).
   */
  pages: {
    signIn: '/login',
  },

  /**
   * NEXTAUTH_SECRET must be set in .env (≥ 32 random bytes).
   * Explicitly reading from env makes the dependency visible.
   */
  secret: process.env.NEXTAUTH_SECRET,
};
