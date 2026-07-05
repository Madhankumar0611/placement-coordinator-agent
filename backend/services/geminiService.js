const axios = require('axios');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Sends a prompt to the Google Gemini API and returns the text response.
 * Swap this out for Groq by changing the endpoint/payload shape if preferred.
 */
async function askGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the environment');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
  });

  const candidates = response.data?.candidates;
  if (!candidates || !candidates.length) {
    throw new Error('No response returned from Gemini');
  }

  return candidates[0].content.parts.map((p) => p.text).join('\n');
}

module.exports = { askGemini };
