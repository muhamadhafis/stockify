const successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(parseInt(statusCode) || 200).json({
        success: true,
        message,
        data
    });
};

const errorResponse = (res, message, data = null, statusCode = 500) => {
    return res.status(parseInt(statusCode) || 500).json({
        success: false,
        message,
        data
    });
};

module.exports = { successResponse, errorResponse };
