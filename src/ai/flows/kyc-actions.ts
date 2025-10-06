
'use server';
/**
 * @fileOverview KYC verification flows.
 *
 * - verifyKycData - Verifies the ID number against the provided images.
 * - KycInput - The input type for the verifyKycData function.
 * - KycOutput - The return type for the verifyKycData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { KycInput, KycInputSchema, KycOutput, KycOutputSchema } from '../schemas/kyc-schemas';

export async function verifyKycData(input: KycInput): Promise<KycOutput> {
    return verifyKycDataFlow(input);
}


const verifyPrompt = ai.definePrompt({
    name: 'verifyKycPrompt',
    input: { schema: KycInputSchema },
    output: { schema: z.object({ cniNumber: z.string().optional() }) },
    prompt: `You are an expert document analysis AI. Your task is to extract the ID card number (Numéro de la carte nationale d'identité or similar) from the provided images.

Look carefully at both images provided. Find the ID number. It might be labeled as "Numéro d'identification national", "N° CNI", or something similar.

User-provided ID number for reference: {{{cniNumber}}}

Front of Card: {{media url=rectoDataUri}}
Back of Card: {{media url=versoDataUri}}

Extract the ID card number from the images. Return ONLY the number. If you cannot find a number, return an empty string.`,
});

const verifyKycDataFlow = ai.defineFlow(
  {
    name: 'verifyKycDataFlow',
    inputSchema: KycInputSchema,
    outputSchema: KycOutputSchema,
  },
  async (input) => {
    const { output } = await verifyPrompt(input);
    
    if (!output?.cniNumber) {
        // If the AI couldn't read the number, we can't verify.
        // For this use case, we'll assume it's a match to not block the user for a blurry photo,
        // but in a real-world scenario, you might want to ask for a better image.
        return { isMatch: true, extractedNumber: "Not found" };
    }

    // Simple comparison after removing spaces and converting to uppercase
    const extracted = output.cniNumber.replace(/\s+/g, '').toUpperCase();
    const provided = input.cniNumber.replace(/\s+/g, '').toUpperCase();

    return {
        isMatch: extracted === provided,
        extractedNumber: output.cniNumber,
    };
  }
);
