const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PersonaAI server is running' });
});

app.post('/ask', async (req, res) => {
  const { name, memory, question } = req.body;

  if (!name || !memory || !question) {
    return res.status(400).json({ error: 'Missing name, memory, or question.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured on server.' });
  }

  const systemPrompt = `You are a digital twin of ${name}. Here is everything known about them:\n\n${memory}\n\nRespond EXACTLY as ${name} would — in their voice, tone, dialect, and personality. Be natural and authentic. Stay fully in character. Do not break character or mention that you are an AI.`;

  try {
    console.log('Calling Groq API...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.9,
        max_tokens: 1000
      })
    });

    const rawText = await response.text();
    console.log('Groq status:', response.status);
    console.log('Groq response:', rawText);

    if (!rawText) {
      return res.status(500).json({ error: 'Groq returned an empty response.' });
    }

    const data = JSON.parse(rawText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Groq API error'
      });
    }

    const reply = data?.choices?.[0]?.message?.content || '(No response)';
    res.json({ reply });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ PersonaAI running at http://localhost:${PORT}\n`);
});
