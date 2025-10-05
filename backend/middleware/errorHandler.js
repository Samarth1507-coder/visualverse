/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */

const errorHandler = (err, req, res, next) => {
    // Defensive copy and standardize error properties
    let error = { ...err };
    error.message = err.message || 'Internal Server Error';

    // Detailed error logging for diagnostics
    console.error('❌ Error:', {
        message: error.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = {
            message: 'Resource not found',
            statusCode: 404,
        };
    }

    // Handle Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = {
            message: `${field} already exists`,
            statusCode: 400,
        };
    }

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map(val => val.message)
            .join(', ');
        error = {
            message,
            statusCode: 400,
        };
    }

    // Handle JWT errors (for authenticated flows, not guest)
    if (err.name === 'JsonWebTokenError') {
        error = {
            message: 'Invalid token',
            statusCode: 401,
        };
    }

    if (err.name === 'TokenExpiredError') {
        error = {
            message: 'Token expired',
            statusCode: 401,
        };
    }

    // Handle Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = {
            message: 'File too large',
            statusCode: 400,
        };
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = {
            message: 'Unexpected file field',
            statusCode: 400,
        };
    }

    // Default error response
    const statusCode =
        error.statusCode || err.statusCode || 500;
    const message =
        error.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
    });
};

module.exports = { errorHandler };
