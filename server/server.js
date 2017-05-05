// modules ================================================
require('dotenv').config();
const express = require('express');
const app = express();

// CONFIGURATION ===========================================

// configure our server with all the middleware and routing
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);
require('./../workers/WaitTime');

// Sets the port to either the Process Environment's or 3000.
let port = process.env.PORT || 3000;

// Run the Server and console.log the port
if(!module.parent) {
  app.listen(port);
  console.log('Listening on:', port);
}

// Testing helpers populate functions.
 //const help = require('./config/helpers');
 //help.populateRidesTable();

 // Weather API

 // let getCurrentPosition = function(position) {
 let data = require('../data/parkLocations');

 data.forEach(loc => {
 	let long = loc.location.longitude;
 	let lat = loc.location.latitude;
 	request(`https://api.darksky.net/forecast/c2d6de716a385a456114233b74fe0d50/${lat},${long}`, (err, res, body) => {
 		console.error(err);
 		console.log('BODY:', body);
 	})
 })
 // app.get('/weather', function(request, response) {
 // 	let coordinates = WeatherAPI.findWeather(temp);
 // 	Weather.location({})
 // 	 .then(function(results) {
 // 	 	console.log(results)
 // 	 	response.send(results);
 // 	 });
 // });


 const db = require('../config/config');

module.exports = app;
