# 🧠 PersonaAI — Digital Twin Generator

> Create a digital twin of any person using natural language memory. Powered by Claude (Anthropic).

---

## 🚀 Setup (takes ~2 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
```bash
cp .env.example .env
```
Open `.env` and replace the placeholder with your real key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```
Get your key at → https://console.anthropic.com

### 3. Run the server
```bash
npm start
```

### 4. Open the app
Visit → http://localhost:3000

---

## 📁 Project Structure

```
personaai/
├── server.js          ← Express backend (API key lives here, safe)
├── package.json       ← Dependencies
├── .env               ← Your secret API key (never commit this!)
├── .env.example       ← Template for .env
├── .gitignore         ← Excludes .env and node_modules
└── public/
    ├── index.html     ← Main UI
    ├── style.css      ← All styles
    └── script.js      ← Frontend logic (calls /ask, no key here)
```

---

## 🔐 Security

- API key is stored in `.env` — **never sent to the browser**
- Frontend calls `/ask` on your own server
- `.gitignore` ensures `.env` is never committed to GitHub

---

## 🛠 Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | HTML, CSS, Vanilla JS       |
| Backend  | Node.js + Express           |
| AI       | Claude Sonnet (Anthropic)   |
| Styling  | Syne + DM Mono (Google Fonts) |

---

## 💡 How It Works

1. User fills in: **name**, **memory** (personality description), **question**
2. Frontend sends these to `/ask` on the Express server
3. Server builds a system prompt and calls Anthropic's API securely
4. Response streams back to the browser with a typewriter animation

---

## 🏆 Built for Hackathon

Made with ❤️ using Claude AI
