
import { z } from 'zod';

export const KycInputSchema = z.object({
  cniNumber: z.string().describe('The ID number provided by the user.'),
  rectoDataUri: z
    .string()
    .describe(
      "A photo of the front of the ID card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  versoDataUri: z
    .string()
    .describe(
      "A photo of the back of the ID card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type KycInput = z.infer<typeof KycInputSchema>;

export const KycOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the extracted number matches the provided CNI number.'),
  extractedNumber: z.string().optional().describe('The ID number extracted from the document.'),
});
export type KycOutput = z.infer<typeof KycOutputSchema>;
