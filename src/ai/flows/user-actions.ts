
'use server';
/**
 * @fileOverview User management flows for registration and login using Firestore.
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
import { firestore } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';


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
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { error: "Un utilisateur avec cet e-mail existe déjà." };
      }
      
      const userId = doc(collection(firestore, 'users')).id;
      const userDocRef = doc(firestore, "users", userId);
      
      await setDoc(userDocRef, {
        id: userId,
        name,
        email,
        password, // In a real app, hash this!
      });

      // Create a corresponding account document
      const accountDocRef = doc(firestore, "accounts", userId);
      await setDoc(accountDocRef, {
          userId: userId,
          balance: 123456.78, // Initial balance for new users
          currency: 'FCFA',
      });


      return { userId: userId };
    } catch (e: any) {
      console.error(e);
      return { error: `Une erreur est survenue lors de la création du compte: ${e.message}` };
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
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { error: "L'e-mail ou le mot de passe est incorrect." };
            }

            const user = querySnapshot.docs[0].data();

            // If the user signed up with Google, their password is a special key.
            // We allow them to log in via Google button without entering it again.
            if (!password.startsWith('google_auth_')) {
              const isPasswordValid = user.password === password;
              if (!isPasswordValid) {
                  return { error: "L'e-mail ou le mot de passe est incorrect." };
              }
            }
            
            return { userId: user.id, name: user.name };
        } catch (e: any) {
            console.error(e);
            return { error: `Une erreur est survenue lors de la connexion: ${e.message}` };
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
            const userDocRef = doc(firestore, "users", userId);
            const accountDocRef = doc(firestore, "accounts", userId);

            const userDoc = await getDoc(userDocRef);
            const accountDoc = await getDoc(accountDocRef);

            if (!userDoc.exists() || !accountDoc.exists()) {
                return { error: "Utilisateur ou compte non trouvé." };
            }
            
            const userData = userDoc.data();
            const accountData = accountDoc.data();

            return {
                name: userData.name,
                email: userData.email,
                balance: accountData.balance,
                currency: accountData.currency,
            };
        } catch (e: any) {
            console.error(e);
            return { error: `Une erreur est survenue lors de la récupération des données: ${e.message}` };
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
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return { error: "Un utilisateur avec cet e-mail existe déjà." }
        }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`OTP for ${email} is: ${otp}`); 

      return { otp };

    } catch (e: any) {
      console.error(e);
      return { error: `Une erreur est survenue lors de l'envoi de l'OTP: ${e.message}` };
    }
  }
);
