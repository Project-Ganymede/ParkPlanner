const db = require('../config/config');
const RideWaitTime = require('../models/rideWaitTimeModel');

const RideWaitTimes = new db.Collection();

RideWaitTimes.model = RideWaitTime;

module.exports = RideWaitTimes;
