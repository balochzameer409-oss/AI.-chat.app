const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// ========== RSS Feed سے posts لاؤ ==========
async function getSitePosts() {
  try {
    const res = await fetch('https://mastersapks.blogspot.com/feeds/posts/default?alt=json&max-results=50');
    const data = await res.json();
    const entries = data.feed.entry || [];
    return entries.map(entry => ({
      title: entry.title.$t,
      link: entry.link.find(l => l.rel === 'alternate')?.href || ''
    }));
  } catch (e) {
    return [];
  }
}

// ========== OpenRouter AI ==========
app.post('/ai', async (req, res) => {
  const { message } = req.body;
  try {
    const posts = await getSitePosts();
    const postsList = posts.map(p => `- ${p.title}: ${p.link}`).join('\n');

    const systemPrompt = `آپ "Zam GPT" ہیں اور MastersAPKs ویب سائٹ کے اسسٹنٹ ہیں۔
ویب سائٹ: https://mastersapks.blogspot.com
یوزر جس لینگویج میں بات کرے ہو اسی لینگویج میں جواب دو۔ 

ابھی ویب سائٹ پر یہ چیزیں موجود ہیں:
${postsList || 'ابھی کوئی post نہیں'}

جب کوئی کچھ مانگے تو اوپر والی list میں سے متعلقہ لنک دیں۔
اگر کوئی چیز نہ ملے تو کہیں: "ابھی یہ ہماری سائٹ پر نہیں ہے لیکن جلد آئے گا!"`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mastersapks.blogspot.com',
        'X-Title': 'zam gpt'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data));
    const reply = data.choices?.[0]?.message?.content || 'کوئی جواب نہیں ملا براہ کرم دوبارہ کوشش کریں';
    res.json({ reply });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ reply: 'سرور میں کوئی ٹیکنیکی مسئلہ ہے ! جو بہت جلد ٹھیک کیا جائے گا براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں' });
  }
});

// ========== ElevenLabs TTS ==========
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
