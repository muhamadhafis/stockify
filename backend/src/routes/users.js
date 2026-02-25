const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/', authMiddleware, catchAsync(userController.getUsers));
router.post('/', authMiddleware, catchAsync(userController.createUser));
router.patch('/:id', authMiddleware, catchAsync(userController.updateUser));
router.delete('/:id', authMiddleware, catchAsync(userController.deleteUser));

module.exports = router;
