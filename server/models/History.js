const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['formalization', 'legal'],
        default: 'formalization',
    },
    originalText: {
        type: String,
        required: true,
    },
    // Formalization specific
    formalizedText: {
        type: String,
    },
    subject: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['business', 'academic', 'corporate'],
        default: 'business',
    },
    language: {
        type: String,
        default: 'english',
    },
    translatedBody: {
        type: String,
    },
    translatedSubject: {
        type: String,
    },
    // Legal Analysis specific
    obligations: [String],
    deadlines: [String],
    clauses: [{
        clause_type: String,
        text: String,
        risk_level: String,
    }],
    riskFlags: [String],
    overallRisk: String,
    plainSummary: String,
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
