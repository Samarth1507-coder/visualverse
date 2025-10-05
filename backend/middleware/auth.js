const jwt = require('jsonwebtoken');
const User = require('../models/User');

const GUEST_USER_USERNAME = 'guest_user';

/**
 * Universal Auth Middleware: populates req.user as guest if authentication fails or is absent.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                return next();
            }
        } catch (err) {
            console.warn('Invalid/expired token, falling back to guest');
        }
    }

    // Guest fallback; ensures a persistent guest user
    let guest = await User.findOne({ username: GUEST_USER_USERNAME }).select('-password');
    if (!guest) {
        guest = await User.create({
            username: GUEST_USER_USERNAME,
            email: 'guest@visualverse.local',
            isGuest: true,
        });
    }

    req.user = guest;
    next();
};

/**
 * Strict Protect Middleware: denies impersonation as guest
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Not authorized to access this route',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user || user.username === GUEST_USER_USERNAME) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found or guest access not allowed',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token',
        });
    }
};

/**
 * Role-based Access Control
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route',
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

/**
 * Optional Authentication (guest compatible)
 */
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            req.user = null;
        }
    }
    next();
};

module.exports = {
    authMiddleware, // Use for routes where guest login is allowed or defaulted.
    protect,        // Use for routes where guest access is not permitted.
    authorize,
    optionalAuth
};
