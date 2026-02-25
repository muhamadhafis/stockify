const multer = require('multer');
const { errorResponse } = require('../utils/apiResponse');

// Use Memory Storage for temporary file handling
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 300 * 1024 // 300KB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
        }
    }
}).single('image');

const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return errorResponse(res, 'Ukuran gambar terlalu besar, maksimal 300KB', null, 400);
            }
            return errorResponse(res, err.message, null, 400);
        } else if (err) {
            return errorResponse(res, err.message, null, 400);
        }
        next();
    });
};

module.exports = uploadMiddleware;
