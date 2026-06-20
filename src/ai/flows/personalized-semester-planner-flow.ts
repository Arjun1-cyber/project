'use server';
/**
 * @fileOverview A personalized semester planner that generates study plans based on various inputs.
 *
 * - generateStudyPlan - A function that handles the study plan generation process.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExamDateSchema = z.object({
  subject: z.string().describe('The subject for which the exam is scheduled.'),
  date: z.string().describe('The date of the exam in YYYY-MM-DD format.'),
  type: z
    .enum(['midterm', 'final', 'quiz', 'internal test'])
    .describe('The type of exam.'),
});

const ClassScheduleSchema = z.object({
  day: z
    .enum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ])
    .describe('Day of the week for the class.'),
  subject: z.string().describe('The subject of the class.'),
  startTime: z.string().describe('Start time of the class in HH:MM format (e.g., "09:00").'),
  endTime: z.string().describe('End time of the class in HH:MM format (e.g., "10:30").'),
});

const AvailabilitySlotSchema = z.object({
  day: z
    .enum([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ])
    .describe('Day of the week for availability.'),
  startTime: z
    .string()
    .describe('Start time of availability in HH:MM format (e.g., "14:00").'),
  endTime: z.string().describe('End time of availability in HH:MM format (e.g., "18:00").'),
});

const MissedSessionSchema = z.object({
  date: z
    .string()
    .describe('The date of the missed session in YYYY-MM-DD format.'),
  subject: z.string().optional().describe('The subject of the missed session.'),
  topic: z.string().optional().describe('The topic of the missed session.'),
  durationMinutes: z
    .number()
    .describe('The duration in minutes of the missed session.'),
});

const SyllabusTopicInputSchema = z.object({
  subject: z.string().describe('The academic subject.'),
  unit: z.string().describe('The unit or section.'),
  chapter: z.string().describe('The specific chapter.'),
  estimatedStudyHours: z
    .number()
    .describe('Estimated hours required to study this chapter.'),
});

export const GenerateStudyPlanInputSchema = z.object({
  syllabusTimeline: z
    .array(SyllabusTopicInputSchema)
    .describe('Structured data representing the syllabus, including topics, chapters, and estimated study hours for each.'),
  examDates: z
    .array(ExamDateSchema)
    .describe('A list of all scheduled exam dates with subjects and types.'),
  collegeTimetable: z
    .array(ClassScheduleSchema)
    .describe('A list of regular college classes and their schedules.'),
  userAvailability: z
    .array(AvailabilitySlotSchema)
    .describe('A list of daily time slots when the user is available to study.'),
  difficultyLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('Overall perceived difficulty level of the semester material (e.g., "low", "medium", "high"). This helps in allocating appropriate study durations.'),
  missedSessions: z
    .array(MissedSessionSchema)
    .optional()
    .describe('Optional: A list of study sessions that were missed. If provided, the plan should be rebalanced to cover these missed hours.'),
});

export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const StudyBlockSchema = z.object({
  date: z.string().describe('The date of the study session in YYYY-MM-DD format (e.g., "2024-10-27").'),
  startTime: z.string().describe('Start time of the study session in HH:MM format (e.g., "15:00").'),
  endTime: z.string().describe('End time of the study session in HH:MM format (e.g., "16:30").'),
  subject: z.string().describe('The subject to be studied during this block.'),
  topic: z.string().describe('The specific topic or chapter to focus on.'),
  durationMinutes: z.number().describe('The duration of this study session in minutes.'),
});

export const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z
    .array(StudyBlockSchema)
    .describe('A detailed list of scheduled study blocks, optimized for the semester.'),
  rebalanceNotes: z
    .string()
    .optional()
    .describe('Optional notes explaining any adjustments made to the plan, especially if rebalancing due to missed sessions.'),
});

export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(
  input: GenerateStudyPlanInput
): Promise<GenerateStudyPlanOutput> {
  return personalizedSemesterPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSemesterPlannerPrompt',
  input: { schema: GenerateStudyPlanInputSchema },
  output: { schema: GenerateStudyPlanOutputSchema },
  prompt: `You are an AI-powered academic planner designed to create optimal study schedules for students. Your goal is to generate a personalized semester-long study plan.

Consider the following information:
- Syllabus: {{{JSON.stringify syllabusTimeline}}}
- Exam Dates: {{{JSON.stringify examDates}}}
- College Timetable: {{{JSON.stringify collegeTimetable}}}
- User Availability: {{{JSON.stringify userAvailability}}}
- Difficulty Level: {{difficultyLevel}}
{{#if missedSessions}}
- Missed Sessions: {{{JSON.stringify missedSessions}}}
{{/if}}

Here are the rules to follow for generating the study plan:
1.  **Prioritization**: Allocate study time strategically, giving more focus to subjects with upcoming exams.
2.  **Constraints**:
    *   Do not schedule study blocks during college timetable hours.
    *   Only schedule study blocks within the user's specified availability.
    *   Ensure each study block is at least 30 minutes and ideally no longer than 120 minutes to maintain focus. Break longer study periods into multiple blocks.
3.  **Syllabus Coverage**: Ensure all chapters and topics from the syllabus are covered, distributing the estimated study hours across the semester.
4.  **Difficulty Adjustment**: For 'high' difficulty levels, allocate slightly more time per topic. For 'low', slightly less.
5.  **Rebalancing (if applicable)**:
    *   If "missedSessions" are provided, incorporate the missed study hours by rescheduling those topics into future available slots. Prioritize covering missed content before moving significantly ahead.
    *   If rebalancing occurs, provide a brief summary in the "rebalanceNotes" field.
6.  **Output Format**: The output must be a JSON object conforming strictly to the GenerateStudyPlanOutputSchema. Ensure dates are in YYYY-MM-DD and times in HH:MM.

Generate a comprehensive and optimized study plan for the entire semester. Start from today's date or the earliest logical start date based on the syllabus.`,
});

const personalizedSemesterPlannerFlow = ai.defineFlow(
  {
    name: 'personalizedSemesterPlannerFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate study plan output.');
    }
    return output;
  }
);
