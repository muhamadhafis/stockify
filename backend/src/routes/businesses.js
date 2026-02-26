const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Businesses
 *   description: Business management
 */

/**
 * @swagger
 * /businesses:
 *   get:
 *     summary: Get all businesses
 *     tags: [Businesses]
 *     responses:
 *       200:
 *         description: List of businesses
 *   post:
 *     summary: Create a new business
 *     tags: [Businesses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Business created
 */
router.get('/', authMiddleware, catchAsync(businessController.getBusinesses));
router.post('/', authMiddleware, catchAsync(businessController.createBusiness));

/**
 * @swagger
 * /businesses/{keyword}:
 *   patch:
 *     summary: Update business
 *     tags: [Businesses]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Business updated
 *   delete:
 *     summary: Delete business
 *     tags: [Businesses]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted
 */
router.patch('/:keyword', authMiddleware, catchAsync(businessController.updateBusiness));
router.delete('/:keyword', authMiddleware, catchAsync(businessController.deleteBusiness));

module.exports = router;
