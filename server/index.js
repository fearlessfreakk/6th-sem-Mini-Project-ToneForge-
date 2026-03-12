const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/userRoutes');
const { protect } = require('./middleware/authMiddleware');
const History = require('./models/History');

const app = express();
const PORT = process.env.PORT || 5000;

// Defensive: Trim AI credentials
const AI_BASE_URL = (process.env.AI_BASE_URL || 'https://kush26-toneforge.hf.space').trim();
const AI_API_KEY = (process.env.AI_API_KEY || '').trim();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/formalizeit')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);

// Formalize endpoint
app.post('/api/convert', protect, async (req, res) => {
  try {
    const { raw_email, category, language } = req.body;
    const inputEmail = raw_email;
    const inputCategory = category || 'business';
    const targetLanguage = language || 'english';

    if (!inputEmail) {
      return res.status(400).json({ error: 'Email text is required' });
    }

    let aiResult;
    // Mock Mode
    if (inputEmail.toUpperCase().includes('MOCK_TEST')) {
        aiResult = {
        category: inputCategory,
        email: {
          subject: "Refined Subject",
          sender: "Sender Name",
          to: "Recipient Name",
          cc: null,
          body: "This is a formalized email body for testing."
        }
      };
      if (targetLanguage.toLowerCase() !== 'english') {
        aiResult.translated_email = { ...aiResult.email, language: targetLanguage, body: `(Translated to ${targetLanguage}) ` + aiResult.email.body };
      }
    } else {
        console.log(`Hitting AI Service (Formalize): ${AI_BASE_URL}/formalize_email`);
        const response = await axios.post(`${AI_BASE_URL}/formalize_email`, {
            raw_email: inputEmail,
            category: inputCategory,
            language: targetLanguage
          }, {
            headers: { 'Authorization': `Bearer ${AI_API_KEY}` }
          });
          aiResult = response.data;
    }

    // Save to History
    try {
        await History.create({
            userId: req.user.id,
            type: 'formalization',
            originalText: inputEmail,
            formalizedText: aiResult.email?.body || (typeof aiResult.email === 'string' ? aiResult.email : ''),
            subject: aiResult.email?.subject || '',
            category: aiResult.category || inputCategory,
            language: targetLanguage,
            translatedBody: aiResult.translated_email?.body,
            translatedSubject: aiResult.translated_email?.subject
        });
    } catch (historyError) {
        console.error("History Save Error:", historyError);
    }

    res.json(aiResult);
  } catch (error) {
    console.error('Formalize Error:', error.message);
    let errorMessage = 'Internal Server Error';
    if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
    } else if (error.message) {
        errorMessage = error.message;
    }
    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
});

// Legal Parse endpoint
app.post('/api/parse_legal', protect, async (req, res) => {
  try {
    const { raw_email } = req.body;
    if (!raw_email) return res.status(400).json({ error: 'Email content is required' });

    let aiResult;
    // Mock Mode
    if (raw_email.toUpperCase().includes('MOCK_TEST')) {
        aiResult = {
            obligations: ["Do the thing", "Pay the money"],
            deadlines: ["Tomorrow", "Next week"],
            clauses: [{ clause_type: "Termination", text: "You can leave whenever.", risk_level: "low" }],
            risk_flags: ["Vague wording"],
            overall_risk: "low",
            plain_summary: "A very friendly contract."
        };
    } else {
        console.log(`Hitting AI Service (Legal): ${AI_BASE_URL}/parse_legal_email`);
        const response = await axios.post(`${AI_BASE_URL}/parse_legal_email`, {
            raw_email
        }, {
            headers: { 'Authorization': `Bearer ${AI_API_KEY}` }
        });
        aiResult = response.data;
    }

    // Save to History
    try {
        await History.create({
            userId: req.user.id,
            type: 'legal',
            originalText: raw_email,
            obligations: aiResult.obligations,
            deadlines: aiResult.deadlines,
            clauses: aiResult.clauses,
            riskFlags: aiResult.risk_flags,
            overallRisk: aiResult.overall_risk,
            plainSummary: aiResult.plain_summary
        });
    } catch (historyError) {
        console.error("History Save Error (Legal):", historyError);
    }

    res.json(aiResult);
  } catch (error) {
    console.error('Legal Parse Error:', error.message);
    let errorMessage = 'Internal Server Error';
    if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
    } else if (error.message) {
        errorMessage = error.message;
    }
    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
});

// Negotiation endpoint
app.post('/api/negotiate', protect, async (req, res) => {
  try {
    const { topic, our_position, their_position, category, max_rounds } = req.body;
    
    if (!topic || !our_position || !their_position) {
      return res.status(400).json({ error: 'Topic and both positions are required' });
    }

    const rounds = parseInt(max_rounds) || 3;
    const finalMaxRounds = Math.min(Math.max(rounds, 1), 6);
    const inputCategory = category || 'business';

    let aiResult;
    // Mock Mode
    if (topic.toUpperCase().includes('MOCK_TEST') || our_position.toUpperCase().includes('MOCK_TEST')) {
      aiResult = {
        topic: topic,
        rounds_completed: finalMaxRounds,
        agreement_reached: true,
        summary: "The negotiation was successful. Both parties agreed to a mutually beneficial compromise after several rounds of discussion regarding the " + topic + ".",
        email_thread: [
          {
            role: "proposer",
            subject: `Initial Proposal: ${topic}`,
            body: `Dear Partner,\n\nI would like to propose the following: ${our_position}.\n\nBest regards.`
          },
          {
            role: "responder",
            subject: `Re: Initial Proposal: ${topic}`,
            body: `Hello,\n\nWe have reviewed your proposal. However, we were thinking more along the lines of: ${their_position}.\n\nKind regards.`
          },
          {
            role: "proposer",
            subject: `Counter-offer: ${topic}`,
            body: `Thank you for your response. We can meet in the middle to finalize the ${topic}.\n\nBest.`
          }
        ]
      };
    } else {
      console.log(`Hitting AI Service (Negotiate): ${AI_BASE_URL}/negotiate_email`);
      const response = await axios.post(`${AI_BASE_URL}/negotiate_email`, {
        topic,
        our_position,
        their_position,
        category: inputCategory,
        max_rounds: finalMaxRounds
      }, {
        headers: { 'Authorization': `Bearer ${AI_API_KEY}` }
      });
      aiResult = response.data;
    }

    // Save to History
    try {
      await History.create({
        userId: req.user.id,
        type: 'negotiation',
        originalText: `Topic: ${topic}\nOur Position: ${our_position}\nTheir Position: ${their_position}`,
        topic: aiResult.topic || topic,
        roundsCompleted: aiResult.rounds_completed,
        agreementReached: aiResult.agreement_reached,
        summary: aiResult.summary,
        emailThread: aiResult.email_thread
      });
    } catch (historyError) {
      console.error("History Save Error (Negotiate):", historyError);
    }

    res.json(aiResult);
  } catch (error) {
    console.error('Negotiation Error:', error.message);
    let errorMessage = 'Internal Server Error';
    if (error.response?.data) {
      errorMessage = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

