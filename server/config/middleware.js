/*
This file establishes and exports our Back-End Middleware.
 */

// Logging
const morgan = require('morgan');
// Parsing
const parser = require('body-parser');
const path = require('path');

// Export the Middleware
module.exports = (app, express) => {
  app.use(morgan('dev'));
  app.use(parser.json());
  app.use(express.static(path.join(__dirname, '/../../client/')));
  app.use(express.static(path.join(__dirname, '/../../node_modules')));
};
