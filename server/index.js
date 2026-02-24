const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/userRoutes');
const { protect } = require('./middleware/authMiddleware');
const History = require('./models/History');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/formalizeit')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);

// Proxy endpoint
app.post('/api/convert', protect, async (req, res) => {
  try {
    const { raw_email, text, category, tone, subject, sender, recipient } = req.body;
    const inputEmail = raw_email || text;
    const inputCategory = category || tone || 'business';

    if (!inputEmail) {
      return res.status(400).json({ error: 'Email text is required' });
    }

    // Mock Mode: If input contains "MOCK_TEST", return a dummy response
    if (inputEmail.toUpperCase().includes('MOCK_TEST')) {
      const mockResponses = {
        business: "Subject: Follow-up on Project Timeline\n\nDear Alex,\n\nI hope this email finds you well. I am writing to provide a quick update regarding our project timeline for the upcoming weekend. Please let me know if you have any questions.\n\nBest regards,\nJamie",
        academic: "Abstract: Analysis of Weekend Communication Patterns\n\nThis paper examines the efficacy of informal scheduling versus structured academic follow-ups. Preliminary results suggest that 'MOCK_TEST' inputs yield significantly more professional outputs when processed through ToneForgeAI.",
        corporate: "INTERNAL MEMO\nTO: Alex\nFROM: Jamie\nRE: QUARTERLY HIKE OPERATIONS\n\nPlease be advised that the hiking operations scheduled for Saturday are currently under review. We aim to optimize all recreational synergies to ensure maximum team alignment.\n\nRegards,\nManagement"
      };

      const formal_text = mockResponses[inputCategory] || mockResponses.business;

      try {
        await History.create({
          userId: req.user.id,
          originalText: inputEmail,
          formalizedText: formal_text,
          subject: subject || "Mock Response",
          sender: sender || "ToneForgeAI",
          recipient: recipient || "User",
          tone: inputCategory,
          category: inputCategory,
        });
        return res.json({ formal_text });
      } catch (error) {
        console.error("Mock History Error:", error);
        return res.status(500).json({ message: "Error saving mock history" });
      }
    }

    // Construct a rich prompt for the AI
    const promptContext = `
Task: Rewrite the following email body to be ${inputCategory}.
Subject: ${subject || 'No Subject'}
From: ${sender || 'Unknown'}
To: ${recipient || 'Unknown'}

Body to Rewrite:
${inputEmail}
    `.trim();

    // Forward to FastAPI
    // Note: If FastAPI supports structured input, we should update it.
    // For now, we send the promptContext as "text" or just the body if we want to keep it simple.
    // Let's send the promptContext so the AI sees the full picture.
    const response = await axios.post('http://localhost:8000/generate-formal', { text: promptContext });

    // Save to History
    if (response.data && response.data.formal_text) {
      await History.create({
        userId: req.user.id,
        originalText: inputEmail,
        formalizedText: response.data.formal_text,
        subject,
        sender,
        recipient,
        tone: inputCategory,
        category: inputCategory,
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'AI Service (FastAPI) is offline.' });
    }
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
