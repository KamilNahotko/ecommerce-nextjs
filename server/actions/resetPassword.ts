'use server';

import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';
import { ResetPasswordSchema } from '@/types';
import { generatePasswordResetToken } from './tokens';
import { sendPasswordResetEmail } from './email';

const actionClient = createSafeActionClient();

export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return { error: 'User not found' };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      return { error: 'Token not generated' };
    }

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );
    return { success: 'Reset Email Sent' };
  });
