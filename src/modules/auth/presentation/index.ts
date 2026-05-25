/**
 * Public exports of the auth presentation layer.
 *
 * Other modules that need to verify the current session should import
 * `authOptions` here and call `getServerSession(authOptions)`.
 *
 * Example (server component / route handler):
 *   import { getServerSession } from 'next-auth';
 *   import { authOptions } from '@/modules/auth/presentation';
 *
 *   const session = await getServerSession(authOptions);
 *   if (!session) return redirect('/login');
 *   const { userId, username } = session.user;
 */
export { authOptions } from './authOptions';
