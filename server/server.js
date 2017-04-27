/*
This is our main server file.
*/

const express = require('express');
// <PUT DB DEFINITION HERE>

// Middleware
const morgan = require('morgan');
const parser = require('body-parser');

// Router
const router = require('./routes.js');

const app = express();

// Log and Parse
app.use(morgan('dev'));
app.use(parser.json());

/*
Placeholder for router
 */

// Serve our static client files
app.use(express.static(__dirname + '/../client'));

// Sets the port to either the Process Environment's or 3000.
let port = process.env.PORT || 3000;

// Run the Server and console.log the port
if(!module.parent) {
  app.listen(port);
  console.log('Listening on:', port);
}

module.exports = app;
