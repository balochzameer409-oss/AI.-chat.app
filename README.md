# 🤖 Zam GPT — AI Chat Assistant for Any Website

> A fully functional, voice-enabled AI chatbot you can deploy on your own website in minutes — for free.

Built by **balochzameer409-oss** · Powered by OpenRouter + Microsoft Edge TTS · Hosted on Railway

---

## 🌟 What is Zam GPT?

Zam GPT is an open-source AI chat assistant that you can plug into **any website or blog**. It knows your website's content, answers visitor questions, and even speaks responses out loud — all without any paid subscriptions.

This project was originally built for [MastersAPKs](https://mastersapks.blogspot.com) but is designed so that **anyone can fork it and make it their own** in under 30 minutes.

---

## ✨ Features

- 💬 **Multilingual** — responds in whatever language the user writes in (Urdu, English, etc.)
- 🔊 **Natural Voice** — Microsoft Edge TTS with `ur-PK-AsadNeural` (reads both Urdu and English)
- 🌐 **Live Website Awareness** — automatically fetches your latest blog posts and answers questions about them
- 🌙 **Dark / Light Mode**
- 💾 **Chat History** — sessions saved in browser localStorage
- 📋 **Copy and Voice buttons** on every message
- 📱 **Mobile Friendly** — works great on Android Chrome

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js + Express |
| AI Model | OpenRouter API (auto model selection) |
| Text-to-Speech | Microsoft Edge TTS via @andresaya/edge-tts |
| Hosting | Railway (free tier) |

---

## 🚀 Deploy Your Own — Step by Step

### Step 1 — Get a Free OpenRouter API Key
1. Go to https://openrouter.ai and create a free account
2. Go to Keys and create a new key
3. Copy the key — you will need it in Step 4

### Step 2 — Fork this Repository
Click the Fork button at the top right of this page

### Step 3 — Customize for Your Website
Open server.js and update the system prompt:

```javascript
const systemPrompt = `You are "MyBot" — the AI assistant for MyWebsite.
Website: https://mywebsite.com ...`;
```

Also update the blog feed URL to your own:
```javascript
const res = await fetch('https://YOUR-BLOG.blogspot.com/feeds/posts/default?alt=json&max-results=50');
```

Open index.html and update:
```javascript
const WORKER_URL = "https://YOUR-RAILWAY-APP.up.railway.app";
```

### Step 4 — Deploy to Railway
1. Go to https://railway.app and sign up free
2. Click New Project → Deploy from GitHub repo
3. Select your forked repo
4. Go to Variables and add:
   ```
   OPENROUTER_KEY = your_key_from_step_1
   ```
5. Railway will build and deploy automatically

### Step 5 — Add to Your Website
Copy the contents of index.html and host it anywhere — GitHub Pages, Blogger, your own domain.

---

## 📁 Project Structure

```
├── server.js        → Backend: AI responses + Text-to-Speech
├── index.html       → Frontend: Full chat UI
├── package.json     → Node.js dependencies
└── README.md        → This file
```

---

## 🔊 Available Voices

You can change the voice in server.js:

```javascript
const voice = 'ur-PK-AsadNeural';    // Urdu male (default)
// const voice = 'ur-PK-UzmaNeural'; // Urdu female
// const voice = 'en-US-AriaNeural'; // English female
// const voice = 'en-US-GuyNeural';  // English male
// const voice = 'hi-IN-MadhurNeural'; // Hindi male
```

Full list: https://speech.microsoft.com/portal/voicegallery

---

## 💡 Suggestions to Make It Even Better

1. **Streaming responses** — Stream the reply word by word like ChatGPT instead of waiting for the full response (OpenRouter supports this)

2. **Database for chat history** — Store conversations in MongoDB or Supabase so history syncs across devices

3. **Rate limiting** — Add per-IP request limits to prevent abuse of your API keys

4. **User authentication** — Let users log in so each person has their own personal chat history

5. **Analytics** — Track which questions users ask most to improve your website content

6. **Better AI model** — In server.js change `openrouter/auto` to a specific model like `anthropic/claude-haiku-4-5` or `google/gemini-flash-1.5` for faster and smarter responses

7. **Dynamic TTS language switching** — Detect language per sentence and switch voices for smoother mixed-language audio

8. **Admin dashboard** — A simple page to view all conversations and monitor what visitors are asking

9. **Upgrade TTS** — When budget allows, swap Edge TTS for ElevenLabs or Azure Neural TTS for even more natural voice quality

10. **PWA support** — Turn the chat into a Progressive Web App so users can install it on their home screen

---

## ⚠️ Disclaimers

Please read carefully before using this project:

- **Provided as-is** — No warranty or guarantee of uptime, accuracy, or fitness for any purpose
- **AI makes mistakes** — The bot's answers depend on the AI model and may be incorrect or outdated. Always verify important information independently
- **API costs** — OpenRouter is free up to a usage limit. Heavy traffic may result in charges on your OpenRouter account. Monitor your usage regularly at https://openrouter.ai
- **Microsoft Edge TTS** — This uses Microsoft's Edge TTS via the `@andresaya/edge-tts` package. It is free but NOT an official public API. Microsoft may change or disable it at any time without notice
- **Railway free tier limits** — Railway's free plan has compute and bandwidth limits. High traffic may require a paid upgrade
- **You are responsible for your bot's content** — Make sure your system prompt guides the AI appropriately for your audience, especially if children may use your website
- **Do not collect sensitive data** — Never ask users for passwords, payment information, or personally identifiable information through this chat interface
- **Not for professional advice** — Do not use this bot to provide medical, legal, financial, or any other professional advice
- **Security** — Never hardcode your API keys in the frontend code. Always use environment variables on the server side (as this project does)

---

## 📄 License

MIT License — free to use, modify, and distribute. Credit appreciated but not required.

---

## 🙏 Credits

- AI powered by OpenRouter (https://openrouter.ai)
- Voice powered by Microsoft Edge TTS (https://github.com/andresaya/edge-tts)
- Hosted on Railway (https://railway.app)
- Built with ❤️ by balochzameer409-oss (https://github.com/balochzameer409-oss)
