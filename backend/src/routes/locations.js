const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Storage location management
 */

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
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
 *         description: Location created
 */
router.get('/', authMiddleware, catchAsync(locationController.getLocations));
router.post('/', authMiddleware, catchAsync(locationController.createLocation));

/**
 * @swagger
 * /locations/{id}:
 *   patch:
 *     summary: Update location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Location updated successfully
 *   delete:
 *     summary: Delete location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location deleted successfully
 */
router.patch('/:id', authMiddleware, catchAsync(locationController.updateLocation));
router.delete('/:id', authMiddleware, catchAsync(locationController.deleteLocation));

module.exports = router;
