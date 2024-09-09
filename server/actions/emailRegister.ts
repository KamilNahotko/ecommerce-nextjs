"use server";

import { RegisterSchema } from "@/types";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "@/server/schema";
import { generateVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

    return { success: "Confirmation Email Sent!" };
  });
