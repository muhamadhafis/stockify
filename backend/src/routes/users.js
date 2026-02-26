const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User administration management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User list
 *   post:
 *     summary: create a user
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: User created
 */
router.get('/', authMiddleware, catchAsync(userController.getUsers));
router.post('/', authMiddleware, catchAsync(userController.createUser));

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted
 */
router.patch('/:id', authMiddleware, catchAsync(userController.updateUser));
router.delete('/:id', authMiddleware, catchAsync(userController.deleteUser));

module.exports = router;
