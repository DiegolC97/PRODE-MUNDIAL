/**
 * NextAuth.js catch-all route handler.
 *
 * Mounts all NextAuth endpoints under /api/auth/:
 *   GET  /api/auth/session
 *   GET  /api/auth/csrf
 *   GET  /api/auth/providers
 *   GET  /api/auth/signin
 *   POST /api/auth/callback/credentials
 *   POST /api/auth/signout
 *   …etc.
 *
 * The actual configuration lives in the auth module at
 *   src/modules/auth/presentation/authOptions.ts
 * so that it can be imported by other server code via getServerSession.
 */
import NextAuth from 'next-auth';
import { authOptions } from '../../../../modules/auth/presentation/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
