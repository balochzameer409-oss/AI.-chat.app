const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { EdgeTTS } = require('@andresaya/edge-tts');

const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/ai', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const posts = await getSitePosts();
    const postsList = posts.map(p => `- ${p.title}: ${p.link}`).join('\n');

    const systemPrompt = `آپ "Zam GPT" ہیں — MastersAPKs ویب سائٹ کے AI اسسٹنٹ۔
ویب سائٹ: https://mastersapks.blogspot.com

یوزر جس زبان میں بات کرے اسی زبان میں جواب دو۔

جب کوئی پہلی بار بات کرے یا تعارف مانگے تو کہو:
"السلام علیکم! میں Zam GPT ہوں، MastersAPKs کا AI اسسٹنٹ۔ اگر آپ کو کوئی ایپ یا ٹول ڈھونڈنا ہو تو بتائیں — میں حاضر ہوں! 😊"

اگر یوزر عام گپ شپ یا مذاق کر رہا ہو تو آپ بھی اس کے موڈ کے مطابق خوشگوار اور دوستانہ انداز میں بات کرو۔

صرف اس وقت لنک دو جب یوزر کسی ایپ یا ٹول کا ذکر کرے۔ جب لنک دو تو کہو "یہاں کلک کریں" اور متعلقہ لنک لگاؤ۔

ابھی ویب سائٹ پر یہ چیزیں موجود ہیں:
${postsList || 'ابھی کوئی post نہیں'}

اگر کوئی مانگی گئی چیز list میں نہ ہو تو کہو: "ابھی یہ ہماری سائٹ پر نہیں ہے لیکن جلد آئے گا! 🙏"`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mastersapks.blogspot.com',
        'X-Title': 'Zam GPT'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'کوئی جواب نہیں ملا براہ کرم دوبارہ کوشش کریں';
    res.json({ reply });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ reply: 'سرور میں کوئی ٹیکنیکی مسئلہ ہے! براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔' });
  }
});

app.post('/tts', async (req, res) => {
  const { message } = req.body;
  try {
    console.log('TTS request:', message?.substring(0, 50));

    // ہمیشہ ur-PK-AsadNeural — یہ انگلش بھی پڑھتا ہے
    const voice = 'ur-PK-AsadNeural';
    console.log('Using voice:', voice);

    const tts = new EdgeTTS();
    await tts.synthesize(message, voice, {
      rate: '-9%',
      pitch: '+0Hz',
      volume: '+0%',
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3'
    });

    const audioBase64 = tts.toBase64();
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    console.log('Audio size:', audioBuffer.length);

    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

  } catch (err) {
    console.error('TTS Error:', err);
    res.status(500).json({ error: 'TTS خطا: ' + err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
