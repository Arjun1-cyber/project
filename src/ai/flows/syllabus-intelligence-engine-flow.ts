'use server';
/**
 * @fileOverview A Genkit flow for extracting key information from a syllabus and generating a semester timeline.
 *
 * - syllabusIntelligenceEngine - A function that processes a syllabus to extract academic details.
 * - SyllabusIntelligenceEngineInput - The input type for the syllabusIntelligenceEngine function.
 * - SyllabusIntelligenceEngineOutput - The return type for the syllabusIntelligenceEngine function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SyllabusIntelligenceEngineInputSchema = z.object({
  syllabusDataUri: z
    .string()
    .describe(
      "A syllabus file (PDF, DOCX, image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  syllabusDescription: z
    .string()
    .optional()
    .describe('An optional description or context for the syllabus.'),
});
export type SyllabusIntelligenceEngineInput = z.infer<typeof SyllabusIntelligenceEngineInputSchema>;

const SyllabusIntelligenceEngineOutputSchema = z.object({
  subjects: z.array(z.string()).describe('List of subjects detected in the syllabus.'),
  unitsAndChapters: z
    .array(
      z.object({
        unitName: z.string().describe('The name of the unit.'),
        chapters: z.array(z.string()).describe('List of chapters within this unit.'),
      })
    )
    .describe('Structured list of units and their respective chapters.'),
  estimatedStudyHoursOverall: z
    .string()
    .describe('Overall estimated study hours for the entire semester.'),
  practicals: z.array(z.string()).describe('Highlighted practical sessions or labs.'),
  assignments: z
    .array(
      z.object({
        name: z.string().describe('Name of the assignment.'),
        dueDate: z.string().describe('Due date of the assignment (e.g., "YYYY-MM-DD").'),
        description: z.string().optional().describe('Brief description of the assignment.'),
      })
    )
    .describe('List of detected assignments with their due dates.'),
  semesterTimeline: z
    .array(
      z.object({
        date: z.string().describe('Date of the timeline event (e.g., "YYYY-MM-DD").'),
        eventDescription: z.string().describe('Description of the event or milestone.'),
      })
    )
    .describe('A chronological list of key events and milestones for the semester.'),
});
export type SyllabusIntelligenceEngineOutput = z.infer<typeof SyllabusIntelligenceEngineOutputSchema>;

export async function syllabusIntelligenceEngine(
  input: SyllabusIntelligenceEngineInput
): Promise<SyllabusIntelligenceEngineOutput> {
  return syllabusIntelligenceEngineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'syllabusIntelligenceEnginePrompt',
  input: { schema: SyllabusIntelligenceEngineInputSchema },
  output: { schema: SyllabusIntelligenceEngineOutputSchema },
  prompt: `You are an AI assistant specialized in analyzing academic syllabi.
Your task is to extract key information from the provided syllabus and present it in a structured JSON format.

Extract the following:
- A list of subjects.
- A structured list of units, and the chapters within each unit.
- An overall estimate of study hours required for the entire semester.
- Any highlighted practical sessions or labs.
- A list of assignments, including their names, due dates, and descriptions if available.
- A chronological timeline of key events and milestones throughout the semester, such as exam dates, project deadlines, holidays, etc.

Syllabus Description (if provided): {{{syllabusDescription}}}

Syllabus Content: {{media url=syllabusDataUri}}

Provide the output in the specified JSON schema.`,
});

const syllabusIntelligenceEngineFlow = ai.defineFlow(
  {
    name: 'syllabusIntelligenceEngineFlow',
    inputSchema: SyllabusIntelligenceEngineInputSchema,
    outputSchema: SyllabusIntelligenceEngineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to extract syllabus information.');
    }
    return output;
  }
);
