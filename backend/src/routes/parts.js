const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Parts
 *   description: Spare parts and items management
 */

/**
 * @swagger
 * /part:
 *   get:
 *     summary: Get all parts
 *     tags: [Parts]
 *     responses:
 *       200:
 *         description: List of parts
 *   post:
 *     summary: create new part
 *     tags: [Parts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Part created
 */
router.get('/', authMiddleware, catchAsync(partController.getParts));
router.post('/', authMiddleware, uploadMiddleware, catchAsync(partController.createPart));

/**
 * @swagger
 * /part/{id}:
 *   get:
 *     summary: get part detail
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Part detail
 *   patch:
 *     summary: update part
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Part updated
 *   delete:
 *     summary: delete part
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Part deleted
 */
router.get('/:id', authMiddleware, catchAsync(partController.getPartById));
router.patch('/:id', authMiddleware, uploadMiddleware, catchAsync(partController.updatePart));
router.delete('/:id', authMiddleware, catchAsync(partController.deletePart));

module.exports = router;
