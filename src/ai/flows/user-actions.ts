'use server';
/**
 * @fileOverview User management flows for registration and login.
 *
 * - registerUser - Creates a new user in the database.
 * - RegisterUserInput - The input type for the registerUser function.
 * - RegisterUserOutput - The return type for the registerUser function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const RegisterUserInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

const RegisterUserOutputSchema = z.object({
  userId: z.string().optional(),
  error: z.string().optional(),
});
export type RegisterUserOutput = z.infer<typeof RegisterUserOutputSchema>;

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserOutput> {
  return registerUserFlow(input);
}

const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegisterUserInputSchema,
    outputSchema: RegisterUserOutputSchema,
  },
  async ({ name, email, password }) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return { error: "Un utilisateur avec cet e-mail existe déjà." };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });
      
      // Create a default account for the new user
      await prisma.account.create({
        data: {
          userId: newUser.id,
          balance: 0,
          currency: 'FCFA',
        }
      });

      return { userId: newUser.id };
    } catch (e) {
      console.error(e);
      return { error: "Une erreur est survenue lors de la création du compte." };
    }
  }
);
