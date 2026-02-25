const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    // Log error for developers
    console.error(`[Error Details]`, err);

    // Extract status code from various error structures (Supabase, Custom, or default 500)
    const statusCode = parseInt(err.statusCode || err.status || 500);
    const message = err.message || 'Internal Server Error';
    const data = err.data || null;

    errorResponse(res, message, data, statusCode);
};

module.exports = errorHandler;
