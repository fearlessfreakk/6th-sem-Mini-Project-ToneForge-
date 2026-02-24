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
        business: {
          subject: "Follow-up: Project Timeline Update",
          sender: "Jamie Smith",
          to: "Alex Mercer",
          body: "Dear Alex,\n\nI hope this email finds you well. I am writing to provide a quick update regarding our project timeline for the upcoming weekend. Please let me know if you have any questions.\n\nSincerely,\nJamie Smith"
        },
        academic: {
          subject: "Research Inquiry: Weekend Communication Patterns",
          sender: "Jamie Smith",
          to: "Professor Mercer",
          body: "Dear Professor Mercer,\n\nI hope you are having a productive week. Regarding my research into weekend communication patterns, I have completed the preliminary 'MOCK_TEST' inputs. I would appreciate your feedback on the structured outputs.\n\nBest regards,\nJamie Smith\nUniversity of ToneForge"
        },
        corporate: {
          subject: "Update: Regional Hiking Operations",
          sender: "Jamie Smith",
          to: "Management Team",
          body: "Hello Team,\n\nPlease be advised that the hiking operations scheduled for Saturday are currently under review. We aim to optimize all recreational synergies to ensure maximum team alignment. Further updates will be provided by EOD.\n\nKind regards,\nJamie Smith\nOperations Lead\nToneForgeAI"
        }
      };

      const mockData = mockResponses[inputCategory] || mockResponses.business;

      try {
        await History.create({
          userId: req.user.id,
          originalText: inputEmail,
          formalizedText: mockData.body,
          subject: mockData.subject,
          sender: mockData.sender,
          recipient: mockData.to,
          tone: inputCategory,
          category: inputCategory,
        });
        return res.json({
          category: inputCategory,
          email: mockData,
          formal_text: mockData.body // Maintain backward compatibility
        });
      } catch (error) {
        console.error("Mock History Error:", error);
        return res.status(500).json({ message: "Error saving mock history" });
      }
    }

    // Forward to FastAPI (Teammate's new structure)
    // Endpoint: http://localhost:8000/formalize_email
    // Body: { "raw_email": "...", "category": "..." }
    const response = await axios.post('http://localhost:8000/formalize_email', {
      raw_email: inputEmail,
      category: inputCategory
    });

    // teammate's API returns: { "category": "...", "email": { "subject": "...", "body": "...", ... } }
    const aiResult = response.data;
    const structuredEmail = aiResult.email;

    // Save to History
    if (structuredEmail && structuredEmail.body) {
      await History.create({
        userId: req.user.id,
        originalText: inputEmail,
        formalizedText: structuredEmail.body,
        subject: structuredEmail.subject || subject,
        sender: structuredEmail.sender || sender,
        recipient: structuredEmail.to || recipient,
        tone: inputCategory,
        category: inputCategory,
      });
    }

    // Send response back to frontend
    // We include formal_text for backward compatibility with the existing UI
    res.json({
      ...aiResult,
      formal_text: structuredEmail.body
    });
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
