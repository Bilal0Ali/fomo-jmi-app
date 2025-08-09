'use server';

/**
 * @fileOverview An AI doubt solver agent.
 *
 * - aiDoubtSolver - A function that handles the doubt resolution process.
 * - AiDoubtSolverInput - The input type for the aiDoubtSolver function.
 * - AiDoubtSolverOutput - The return type for the aiDoubtSolver function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDoubtSolverInputSchema = z.object({
  doubtText: z.string().describe('The doubt or question that needs to be resolved.'),
  subjectMaterial: z.string().describe('The subject material relevant to the doubt.'),
});
export type AiDoubtSolverInput = z.infer<typeof AiDoubtSolverInputSchema>;

const AiDoubtSolverOutputSchema = z.object({
  suggestions: z.string().describe('Suggestions for how to resolve the doubt.'),
});
export type AiDoubtSolverOutput = z.infer<typeof AiDoubtSolverOutputSchema>;

export async function aiDoubtSolver(input: AiDoubtSolverInput): Promise<AiDoubtSolverOutput> {
  return aiDoubtSolverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDoubtSolverPrompt',
  input: {schema: AiDoubtSolverInputSchema},
  output: {schema: AiDoubtSolverOutputSchema},
  prompt: `You are an AI assistant helping students resolve their doubts.

  You are given the doubt text and the subject material relevant to the doubt.
  Provide suggestions on how the student can resolve the doubt.

  Doubt: {{{doubtText}}}
  Subject Material: {{{subjectMaterial}}}
  `,
});

const aiDoubtSolverFlow = ai.defineFlow(
  {
    name: 'aiDoubtSolverFlow',
    inputSchema: AiDoubtSolverInputSchema,
    outputSchema: AiDoubtSolverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
