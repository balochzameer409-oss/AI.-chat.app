const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ai', async (req, res) => {
  const { message, system } = req.body;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mastersapks.blogspot.com',
        'X-Title': 'AI Chat'
      },
      body: JSON.stringify({
    model: 'openrouter/auto',
        messages: [
          { role: 'system', content: system || 'اپ ایک مددگار اے ائی ہو' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data));
    const reply = data.choices?.[0]?.message?.content || 'جواب نہیں ملا';
    res.json({ reply });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ reply: 'سرور خطا' });
  }
});

app.post('/tts', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });
    const buffer = await response.buffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (err) {
    console.error('TTS Error:', err);
    res.status(500).json({ error: 'TTS خطا' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
