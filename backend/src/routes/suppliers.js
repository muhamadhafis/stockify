const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/', authMiddleware, catchAsync(supplierController.getSuppliers));
router.get('/:id', authMiddleware, catchAsync(supplierController.getSupplierById));
router.post('/', authMiddleware, catchAsync(supplierController.createSupplier));
router.patch('/:id', authMiddleware, catchAsync(supplierController.updateSupplier));
router.delete('/:id', authMiddleware, catchAsync(supplierController.deleteSupplier));

module.exports = router;
