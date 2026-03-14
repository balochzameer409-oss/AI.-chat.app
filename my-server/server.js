const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ai', async (req, res) => {
  const { message, system } = req.body;
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'system', content: system || 'اپ ایک مددگار اے ائی ہو' },
        { role: 'user', content: message }
      ]
    })
  });
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'جواب نہیں ملا';
  res.json({ reply });
});

app.post('/tts', async (req, res) => {
  const { message } = req.body;
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
});

app.listen(process.env.PORT || 3000);
