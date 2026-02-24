const User = require('../models/User');
const History = require('../models/History');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const conversionCount = await History.countDocuments({ userId: req.user.id });

        res.json({
            _id: user._id,
            email: user.email,
            createdAt: user.createdAt,
            conversionCount,
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ error: 'Server error fetching profile' });
    }
};
