const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/', authMiddleware, catchAsync(locationController.getLocations));
router.post('/', authMiddleware, catchAsync(locationController.createLocation));
router.patch('/:id', authMiddleware, catchAsync(locationController.updateLocation));
router.delete('/:id', authMiddleware, catchAsync(locationController.deleteLocation));

module.exports = router;
