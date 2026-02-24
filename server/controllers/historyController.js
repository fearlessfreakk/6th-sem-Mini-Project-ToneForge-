const History = require('../models/History');

exports.getHistory = async (req, res) => {
    try {
        const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ error: 'Server error fetching history' });
    }
};
