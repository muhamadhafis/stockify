const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const catchAsync = require('../utils/catchAsync');

router.get('/', authMiddleware, catchAsync(partController.getParts));
router.get('/:id', authMiddleware, catchAsync(partController.getPartById));
router.post('/', authMiddleware, uploadMiddleware, catchAsync(partController.createPart));
router.patch('/:id', authMiddleware, uploadMiddleware, catchAsync(partController.updatePart));
router.delete('/:id', authMiddleware, catchAsync(partController.deletePart));

module.exports = router;
