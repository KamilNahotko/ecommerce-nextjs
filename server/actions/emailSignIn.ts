'use server';

import { LoginSchema } from '@/types/loginSchema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { users } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { generateVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';
import { AuthError } from 'next-auth';
import { signIn } from '../auth';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: 'Email not found' };
      }

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: 'Confirmation email sent!' };
      }

      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
        redirect: true,
      });

      return { success: email };
    } catch (error) {
      console.log('input error: ', error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Email or Password Incorrect' };
          case 'AccessDenied':
            return { error: error.message };
          case 'OAuthSignInError':
            return { error: error.message };
          default:
            return { error: 'Something went wrong' };
        }
      }
      throw error;
    }
  });
