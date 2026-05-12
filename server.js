require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.MODEL || 'gpt-4o-mini';

if (!process.env.OPENAI_API_KEY) {
  console.warn('[warn] OPENAI_API_KEY is not set. Copy .env.example to .env and add your key.');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'missing-key' });

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function buildSystemPrompt(profile = {}) {
  const {
    name = 'the user',
    age = 'college age',
    country = 'an immigrant background',
    language = 'English',
    credit = 'limited knowledge',
    debt = 'not specified',
    employment = 'student',
    supporting = 'just herself',
    goal = 'build credit',
  } = profile;

  const replyLang = language === 'Spanish' ? 'Spanish' : 'English';

  return `You are HerGuide, a warm and knowledgeable financial literacy assistant built specifically for first-generation immigrant college women learning about credit in the United States for the first time.

The person you are talking to:
- Name: ${name}
- Age: ${age}
- Home country or heritage: ${country}
- Preferred language: ${language}
- Credit knowledge: ${credit}
- Current debt: ${debt}
- Employment: ${employment}
- Supporting family: ${supporting}
- Financial goal: ${goal}

Your rules:
- Always respond in ${replyLang}.
- Keep every response to 2 to 3 sentences maximum. Be concise.
- Never use financial jargon without immediately explaining it in plain language.
- Be warm, encouraging, and completely non-judgmental. There are no dumb questions.
- Only answer questions about credit, credit cards, APR, interest, credit scores, FAFSA, financial aid, budgeting, and personal finance.
- If asked about something unrelated, politely redirect to credit and money topics.
- Reference the user's specific situation (their goal, employment, whether they support family, country) when it makes the answer more useful. Do not just repeat their profile back to them.`;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { profile, history = [], message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const messages = [
      { role: 'system', content: buildSystemPrompt(profile) },
      ...history
        .filter(m => m && m.role && m.content)
        .slice(-12)
        .map(m => ({ role: m.role, content: String(m.content).slice(0, 2000) })),
      { role: 'user', content: message.slice(0, 2000) },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      max_tokens: 220,
      temperature: 0.7,
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || '';
    res.json({ reply });
  } catch (err) {
    console.error('[chat] error:', err.message);
    res.status(500).json({ error: 'Chat failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`HerFinance running at http://localhost:${PORT}`);
});
