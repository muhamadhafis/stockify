const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const partsRoutes = require('./parts');
const businessesRouter = require('./businesses');
const suppliersRouter = require('./suppliers');
const locationRoutes = require('./locations');
const stockRoutes = require('./stocks');
const dashboardRoutes = require('./dashboard');

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/part', partsRoutes);
router.use('/businesses', businessesRouter);
router.use('/suppliers', suppliersRouter);
router.use('/locations', locationRoutes);
router.use('/stocks', stockRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
