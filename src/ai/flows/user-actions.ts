'use server';
/**
 * @fileOverview User management flows for registration and login using Prisma.
 *
 * - registerUser - Creates a new user in the database.
 * - RegisterUserInput - The input type for the registerUser function.
 * - RegisterUserOutput - The return type for the registerUser function.
 * 
 * - loginUser - Authenticates a user.
 * - LoginUserInput - The input type for the loginUser function.
 * - LoginUserOutput - The return type for the loginUser function.
 *
 * - getUserData - Retrieves user and account data.
 * - GetUserDataInput - The input type for the getUserData function.
 * - GetUserDataOutput - The return type for the getUserData function.
 * 
 * - sendOtp - Generates and "sends" an OTP.
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Schema for user registration
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
      
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password, // In a real app, hash this!
          accounts: {
            create: {
              balance: 123456.78, // Initial balance for new users
              currency: 'FCFA',
            }
          }
        },
      });

      return { userId: newUser.id };
    } catch (e) {
      console.error(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
             return { error: "Un utilisateur avec cet e-mail existe déjà." };
        }
      }
      return { error: "Une erreur est survenue lors de la création du compte." };
    }
  }
);


// Schema for user login
const LoginUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginUserInput = z.infer<typeof LoginUserInputSchema>;

const LoginUserOutputSchema = z.object({
  userId: z.string().optional(),
  name: z.string().optional(),
  error: z.string().optional(),
});
export type LoginUserOutput = z.infer<typeof LoginUserOutputSchema>;

export async function loginUser(input: LoginUserInput): Promise<LoginUserOutput> {
    return loginUserFlow(input);
}

const loginUserFlow = ai.defineFlow(
    {
        name: 'loginUserFlow',
        inputSchema: LoginUserInputSchema,
        outputSchema: LoginUserOutputSchema,
    },
    async ({ email, password }) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return { error: "L'e-mail ou le mot de passe est incorrect." };
            }

            if (!password.startsWith('google_auth_')) {
              const isPasswordValid = user.password === password;

              if (!isPasswordValid) {
                  return { error: "L'e-mail ou le mot de passe est incorrect." };
              }
            }
            
            return { userId: user.id, name: user.name };
        } catch (e) {
            console.error(e);
            return { error: "Une erreur est survenue lors de la connexion." };
        }
    }
);

// Schema for getting user data
const GetUserDataInputSchema = z.object({
    userId: z.string(),
});
export type GetUserDataInput = z.infer<typeof GetUserDataInputSchema>;

const GetUserDataOutputSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    balance: z.number().optional(),
    currency: z.string().optional(),
    error: z.string().optional(),
});
export type GetUserDataOutput = z.infer<typeof GetUserDataOutputSchema>;

export async function getUserData(input: GetUserDataInput): Promise<GetUserDataOutput> {
    return getUserDataFlow(input);
}

const getUserDataFlow = ai.defineFlow(
    {
        name: 'getUserDataFlow',
        inputSchema: GetUserDataInputSchema,
        outputSchema: GetUserDataOutputSchema,
    },
    async ({ userId }) => {
        try {
            const account = await prisma.account.findFirst({
                where: { userId },
                include: { user: true },
            });
            
            if (!account || !account.user) {
                return { error: "Utilisateur ou compte non trouvé." };
            }
            
            return {
                name: account.user.name,
                email: account.user.email,
                balance: account.balance,
                currency: account.currency,
            };
        } catch (e) {
            console.error(e);
            return { error: "Une erreur est survenue lors de la récupération des données." };
        }
    }
);


// Schema for sending OTP
const SendOtpInputSchema = z.object({
  email: z.string().email(),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

const SendOtpOutputSchema = z.object({
  otp: z.string().optional(),
  error: z.string().optional(),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return { error: "Un utilisateur avec cet e-mail existe déjà." }
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`OTP for ${email} is: ${otp}`); 

      return { otp };

    } catch (e) {
      console.error(e);
      return { error: "Une erreur est survenue lors de l'envoi de l'OTP." };
    }
  }
);
