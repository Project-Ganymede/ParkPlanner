const db = require('../config');
const Ride = require('../models/ride');

const Rides = new db.Collection();

Rides.model = Ride;

module.exports = Rides;