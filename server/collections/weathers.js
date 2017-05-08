const db = require('../config/config');
const Weather = require('../models/weatherModel');

const Weathers = new db.Collection();

Weathers.model = Weather;

module.exports = Weathers;