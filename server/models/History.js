const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalText: {
        type: String,
        required: true,
    },
    formalizedText: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        default: '',
    },
    sender: {
        type: String,
        default: '',
    },
    recipient: {
        type: String,
        default: '',
    },
    tone: {
        type: String,
        default: 'Formal',
    },
    category: {
        type: String,
        enum: ['business', 'academic', 'corporate'],
        default: 'business',
    },
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
