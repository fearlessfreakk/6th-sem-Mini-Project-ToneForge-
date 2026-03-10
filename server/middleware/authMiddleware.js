const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header and trim it
            token = req.headers.authorization.split(' ')[1]?.trim();

            if (!token) {
                console.warn('Auth Error: Bearer token found but token string is missing or empty');
                return res.status(401).json({ error: 'Not authorized, token is empty' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error(`Auth Error: User with ID ${decoded.id} not found in database.`);
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message, '| Token:', token ? `${token.substring(0, 10)}...` : 'N/A');
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Not authorized, token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Not authorized, token invalid' });
            }
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
