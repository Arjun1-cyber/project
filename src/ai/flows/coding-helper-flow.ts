'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered coding assistance (debugging, explanation, optimization).
 *
 * - codingHelper - A function that processes code snippets to provide help.
 * - CodingHelperInput - The input type for the codingHelper function.
 * - CodingHelperOutput - The return type for the codingHelper function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CodingHelperInputSchema = z.object({
  code: z.string().describe('The code snippet that needs help.'),
  language: z.string().optional().describe('The programming language of the code.'),
  task: z.enum(['debug', 'explain', 'optimize', 'refactor']).describe('The specific task to perform on the code.'),
  context: z.string().optional().describe('Additional context or problem description.'),
});
export type CodingHelperInput = z.infer<typeof CodingHelperInputSchema>;

const CodingHelperOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the code.'),
  improvedCode: z.string().optional().describe('An improved or fixed version of the code.'),
  explanation: z.string().describe('A step-by-step explanation of the changes or logic.'),
  keyTakeaways: z.array(z.string()).describe('A list of key learning points from this assistance.'),
});
export type CodingHelperOutput = z.infer<typeof CodingHelperOutputSchema>;

export async function codingHelper(input: CodingHelperInput): Promise<CodingHelperOutput> {
  return codingHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codingHelperPrompt',
  input: { schema: CodingHelperInputSchema },
  output: { schema: CodingHelperOutputSchema },
  prompt: `You are an expert software engineer and computer science tutor. Your task is to assist a student with their code.

Task: {{{task}}}
Language: {{#if language}}{{language}}{{else}}Detected automatically{{/if}}
Context: {{#if context}}{{context}}{{else}}No additional context provided{{/if}}

Code:
\`\`\`
{{{code}}}
\`\`\`

---

Instructions:
- If task is 'debug': Identify errors, explain why they occurred, and provide fixed code.
- If task is 'explain': Break down the logic into simple, understandable terms for a student.
- If task is 'optimize': Suggest ways to make the code more efficient (time/space complexity) without changing its core behavior.
- If task is 'refactor': Improve code readability and structure following best practices.

Ensure the response is clear and encourages learning.`,
});

const codingHelperFlow = ai.defineFlow(
  {
    name: 'codingHelperFlow',
    inputSchema: CodingHelperInputSchema,
    outputSchema: CodingHelperOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate coding assistance.');
    }
    return output;
  }
);