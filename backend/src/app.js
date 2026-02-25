const express = require('express');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
require('./services/cronService');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Terlalu banyak permintaan, coba lagi nanti", data: null }
});

app.use(limiter);
app.use(express.json());

// Routes
app.use('/', routes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
