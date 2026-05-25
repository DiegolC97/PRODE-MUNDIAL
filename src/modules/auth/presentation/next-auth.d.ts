/**
 * NextAuth TypeScript module augmentation.
 *
 * Extends the default Session and JWT interfaces so that `session.user.userId`
 * and `session.user.username` are strongly typed throughout the application.
 */
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      /** UUID primary key from the `users` table */
      userId: string;
      /** Unique username */
      username: string;
    };
  }

  interface User {
    /** UUID primary key — returned by the authorize callback */
    userId: string;
    /** Unique username — returned by the authorize callback */
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    /** UUID primary key */
    userId: string;
    /** Unique username */
    username: string;
  }
}
