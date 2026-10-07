/**
 * VibePhục Studio — Shared Server-Side Gemini Client
 * Configured following @google/genai standards with required telemetry User-Agent.
 */

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export const geminiClient = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;
