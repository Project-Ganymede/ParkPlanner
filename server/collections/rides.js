const db = require('./../config/config');
const Ride = require('../models/rideModel');

const Rides = new db.Collection();

Rides.model = Ride;

module.exports = Rides;
