'use server';
/**
 * @fileOverview A multilingual AI tutor flow that assists students with their study materials.
 *
 * - multilingualAITutor - A function that handles tutoring sessions, supporting text and voice.
 * - MultilingualAITutorInput - The input type for the multilingualAITutor function.
 * - MultilingualAITutorOutput - The return type for the multilingualAITutor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const MultilingualAITutorInputSchema = z.object({
  userInput: z.string().describe('The student\'s question or query in text format.'),
  documentContext: z.string().describe('Relevant context from uploaded study materials to help answer the question. This could be a summary, key points, or relevant paragraphs.'),
  language: z.enum(['en', 'hi', 'mixed']).describe('The preferred language for the AI tutor\'s response: English (en), Hindi (hi), or a mix of both (mixed).').default('en'),
  voiceOutputEnabled: z.boolean().describe('Whether to generate a voice output for the response.').default(false)
});
export type MultilingualAITutorInput = z.infer<typeof MultilingualAITutorInputSchema>;

const MultilingualAITutorOutputSchema = z.object({
  responseText: z.string().describe('The AI tutor\'s textual explanation or solution.'),
  responseAudioDataUri: z.string().optional().describe('Optional: Data URI of the AI tutor\'s voice response, if voice output was enabled.').nullable()
});
export type MultilingualAITutorOutput = z.infer<typeof MultilingualAITutorOutputSchema>;

// Helper function to convert PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Function to generate audio from text using TTS model
async function generateAudioFromText(text: string): Promise<string> {
  const { media } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-preview-tts'),
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Algenib' }
        }
      }
    },
    prompt: text
  });

  if (!media) {
    throw new Error('No audio media returned from TTS model');
  }

  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );

  // Convert PCM to WAV and return as base64 data URI
  const wavBase64 = await toWav(audioBuffer);
  return 'data:audio/wav;base64,' + wavBase64;
}

const tutorPrompt = ai.definePrompt({
  name: 'multilingualTutorPrompt',
  input: { schema: MultilingualAITutorInputSchema },
  output: { schema: MultilingualAITutorOutputSchema.pick({ responseText: true }) },
  prompt: `You are an expert AI tutor named Lumina Academic. Your goal is to help students understand their study materials by providing clear, step-by-step explanations and solutions.

The student has provided the following study material context:
{{{documentContext}}}

The student's question is:
{{{userInput}}}

Respond in {{{language}}} or a mix of English and Hindi, as appropriate, ensuring clarity and accuracy based on the provided context. If the question asks for a solution, provide it step-by-step.`
});

const multilingualAITutorFlow = ai.defineFlow(
  {
    name: 'multilingualAITutorFlow',
    inputSchema: MultilingualAITutorInputSchema,
    outputSchema: MultilingualAITutorOutputSchema
  },
  async (input) => {
    // Generate text response from the tutor prompt
    const { output } = await tutorPrompt(input);
    const responseText = output?.responseText || 'Sorry, I could not generate a response.';

    let responseAudioDataUri: string | null = null;
    if (input.voiceOutputEnabled) {
      try {
        responseAudioDataUri = await generateAudioFromText(responseText);
      } catch (error) {
        console.error('Error generating audio response:', error);
        responseAudioDataUri = null;
      }
    }

    return {
      responseText: responseText,
      responseAudioDataUri: responseAudioDataUri
    };
  }
);

export async function multilingualAITutor(input: MultilingualAITutorInput): Promise<MultilingualAITutorOutput> {
  return multilingualAITutorFlow(input);
}
