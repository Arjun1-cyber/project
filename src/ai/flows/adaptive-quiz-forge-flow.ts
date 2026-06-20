'use server';
/**
 * @fileOverview A Genkit flow for generating custom practice quizzes from study material.
 *
 * - adaptiveQuizForge - A function that generates quiz questions based on provided material.
 * - AdaptiveQuizForgeInput - The input type for the adaptiveQuizForge function.
 * - AdaptiveQuizForgeOutput - The return type for the adaptiveQuizForge function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MCQQuestionSchema = z.object({
  type: z.literal('MCQ'),
  question: z.string().describe('The multiple-choice question.'),
  options: z.array(z.string()).describe('An array of possible answer options.'),
  correctAnswer: z.string().describe('The correct answer among the options.'),
  explanation: z.string().optional().describe('An explanation for the correct answer.'),
});

const FillInTheBlankQuestionSchema = z.object({
  type: z.literal('Fill-in-the-Blank'),
  question: z.string().describe('The question with a blank indicated by "[BLANK]".'),
  answer: z.string().describe('The correct word or phrase to fill the blank.'),
  explanation: z.string().optional().describe('An explanation for the correct answer.'),
});

const TrueFalseQuestionSchema = z.object({
  type: z.literal('True/False'),
  question: z.string().describe('A statement to be evaluated as true or false.'),
  answer: z.boolean().describe('The correct answer: true or false.'),
  explanation: z.string().optional().describe('An explanation for the correct answer.'),
});

const NumericalQuestionSchema = z.object({
  type: z.literal('Numerical'),
  question: z.string().describe('A question requiring a numerical answer.'),
  correctAnswer: z.union([z.number(), z.string()]).describe('The numerical answer or a string if units are involved.'),
  unit: z.string().optional().describe('The unit of the numerical answer, if applicable.'),
  solutionSteps: z.string().optional().describe('Step-by-step solution for the numerical question.'),
  explanation: z.string().optional().describe('An explanation for the correct answer.'),
});

const CodingQuestionSchema = z.object({
  type: z.literal('Coding'),
  question: z.string().describe('A coding problem statement.'),
  language: z.string().describe('The programming language for the solution (e.g., Python, Java, C++).'),
  inputExample: z.string().optional().describe('An example of input for the coding problem.'),
  outputExample: z.string().optional().describe('An example of expected output for the coding problem.'),
  testCases: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })).optional().describe('A list of test cases with input and expected output.'),
  solution: z.string().optional().describe('An example solution code for the problem.'),
  explanation: z.string().optional().describe('An explanation for the coding problem and solution.'),
});

const QuizQuestionSchema = z.discriminatedUnion('type', [
  MCQQuestionSchema,
  FillInTheBlankQuestionSchema,
  TrueFalseQuestionSchema,
  NumericalQuestionSchema,
  CodingQuestionSchema,
]);

const AdaptiveQuizForgeInputSchema = z.object({
  studyMaterial: z
    .string()
    .describe('The study material (notes, textbook content) from which to generate quiz questions.'),
  questionTypes: z
    .array(z.enum(['MCQ', 'Fill-in-the-Blank', 'True/False', 'Numerical', 'Coding']))
    .optional()
    .describe('The types of questions to generate. If not specified, a mix will be generated.'),
  numQuestions: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe('The desired number of questions to generate. If not specified, a reasonable number will be generated.'),
});
export type AdaptiveQuizForgeInput = z.infer<typeof AdaptiveQuizForgeInputSchema>;

const AdaptiveQuizForgeOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type AdaptiveQuizForgeOutput = z.infer<typeof AdaptiveQuizForgeOutputSchema>;

export async function adaptiveQuizForge(input: AdaptiveQuizForgeInput): Promise<AdaptiveQuizForgeOutput> {
  return adaptiveQuizForgeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveQuizForgePrompt',
  input: { schema: AdaptiveQuizForgeInputSchema },
  output: { schema: AdaptiveQuizForgeOutputSchema },
  prompt: `You are an expert educator and quiz generator. Your task is to create a set of practice quiz questions based on the provided study material.
The questions should cover various aspects of the material and be designed to test comprehension.

Question Types:
If specific question types are requested ({{#if questionTypes}} {{questionTypes}} {{else}} (none specified) {{/if}}), generate only those types. Otherwise, generate a diverse mix of Multiple Choice Questions (MCQ), Fill-in-the-Blank questions, True/False questions, Numerical questions, and Coding questions.

Constraints:
- Generate {{numQuestions}} questions. If not specified, generate a reasonable number (e.g., 5-10) based on the material.
- For Fill-in-the-Blank questions, use "[BLANK]" to indicate the blank within the question text.
- For Coding questions, specify the language, and if possible, provide example input/output or test cases and a potential solution.
- Ensure all questions are directly derived from the provided study material.
- Provide an explanation for the correct answer for each question.

Study Material:
{{{studyMaterial}}}

Generate the quiz questions in a JSON array format that strictly adheres to the provided output schema. Ensure all fields are correctly populated.
`,
});

const adaptiveQuizForgeFlow = ai.defineFlow(
  {
    name: 'adaptiveQuizForgeFlow',
    inputSchema: AdaptiveQuizForgeInputSchema,
    outputSchema: AdaptiveQuizForgeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
