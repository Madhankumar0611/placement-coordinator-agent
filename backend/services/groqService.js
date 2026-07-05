const axios = require('axios');

// Groq's API is OpenAI-compatible: POST /openai/v1/chat/completions
// Fast, free-tier-friendly, and runs open models like Llama 3.3 and Mixtral.
// Get a key at https://console.groq.com/keys
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Sends a prompt to the Groq API and returns the text response.
 */
async function askGroq(prompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in the environment');
  }

  const response = await axios.post(
    GROQ_URL,
    {
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const choices = response.data?.choices;
  if (!choices || !choices.length) {
    throw new Error('No response returned from Groq');
  }

  return choices[0].message.content;
}

module.exports = { askGroq };
