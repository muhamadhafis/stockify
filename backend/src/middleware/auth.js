const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Token otentikasi diperlukan', null, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return errorResponse(res, 'Token tidak valid atau kedaluwarsa', null, 401);
    }
};
