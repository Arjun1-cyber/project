'use server';
/**
 * @fileOverview A Genkit flow for generating various study materials from provided content.
 *
 * - generateStudyMaterial - A function that handles the generation of study materials.
 * - GenerateStudyMaterialInput - The input type for the generateStudyMaterial function.
 * - GenerateStudyMaterialOutput - The return type for the generateStudyMaterial function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateStudyMaterialInputSchema = z.object({
  content: z.string().describe('The content (e.g., text from documents or recordings) to generate study materials from.'),
  materialType: z.enum(['short_notes', 'detailed_notes', 'flashcards', 'revision_sheets', 'mind_map']).describe('The type of study material to generate.'),
});
export type GenerateStudyMaterialInput = z.infer<typeof GenerateStudyMaterialInputSchema>;

// Output Schema
const GenerateStudyMaterialOutputSchema = z.object({
  generatedMaterial: z.string().describe('The generated study material formatted according to the requested type.'),
});
export type GenerateStudyMaterialOutput = z.infer<typeof GenerateStudyMaterialOutputSchema>;

// Wrapper function
export async function generateStudyMaterial(input: GenerateStudyMaterialInput): Promise<GenerateStudyMaterialOutput> {
  return aiNotesGeneratorFlow(input);
}

// Prompt definition
const aiNotesGeneratorPrompt = ai.definePrompt({
  name: 'aiNotesGeneratorPrompt',
  input: { schema: GenerateStudyMaterialInputSchema },
  output: { schema: GenerateStudyMaterialOutputSchema },
  prompt: `You are an AI assistant specialized in generating various study materials for students. Your task is to transform provided content into the requested study material format.

Based on the 'materialType' and 'content' provided, generate the appropriate study material.

Material Type: {{{materialType}}}
Content:
{{{content}}}

---

Instructions for different material types:

If materialType is 'short_notes':
- Summarize the key concepts and facts from the content in concise bullet points or short paragraphs. Focus on brevity and main ideas.

If materialType is 'detailed_notes':
- Provide a comprehensive summary of the content, including main topics, sub-topics, important definitions, examples, and explanations. Organize it logically with headings and subheadings.

If materialType is 'flashcards':
- Extract key terms, concepts, or questions from the content and present them as a list of flashcards. Each flashcard should have a clear question/term and a concise answer/definition. Format each flashcard as:
  Q: [Question/Term]
  A: [Answer/Definition]
  Separate each flashcard with a blank line.

If materialType is 'revision_sheets':
- Create a structured revision sheet that highlights essential information for quick review. Include formulas, key diagrams (described textually), important dates, processes, and summary points. Use bullet points and concise explanations.

If materialType is 'mind_map':
- Generate a textual representation of a mind map. Start with a central topic and branch out into main ideas, then sub-ideas. Use indentation or bullet points to show hierarchy.
  Example:
  Central Topic
  - Main Idea 1
    - Sub-idea 1.1
    - Sub-idea 1.2
  - Main Idea 2
    - Sub-idea 2.1`,
});

// Flow definition
const aiNotesGeneratorFlow = ai.defineFlow(
  {
    name: 'aiNotesGeneratorFlow',
    inputSchema: GenerateStudyMaterialInputSchema,
    outputSchema: GenerateStudyMaterialOutputSchema,
  },
  async (input) => {
    const { output } = await aiNotesGeneratorPrompt(input);
    if (!output) {
      throw new Error('Failed to generate study material.');
    }
    return output;
  }
);
