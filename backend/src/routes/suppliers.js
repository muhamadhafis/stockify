const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Vendor and supplier management
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: get all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Supplier list
 *   post:
 *     summary: create new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Supplier created
 */
router.get('/', authMiddleware, catchAsync(supplierController.getSuppliers));
router.post('/', authMiddleware, catchAsync(supplierController.createSupplier));

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: get supplier detail
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Supplier details
 *   patch:
 *     summary: update supplier info
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Supplier updated
 *   delete:
 *     summary: delete supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Supplier deleted
 */
router.get('/:id', authMiddleware, catchAsync(supplierController.getSupplierById));
router.patch('/:id', authMiddleware, catchAsync(supplierController.updateSupplier));
router.delete('/:id', authMiddleware, catchAsync(supplierController.deleteSupplier));

module.exports = router;
