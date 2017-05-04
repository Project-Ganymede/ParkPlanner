const moment = require('moment');

const db = require('../config/config');
const Ride = require('./rideModel');

let rideWaitTime = db.Model.extend({
  tableName: 'ride_wait_times',
  hasTimestamps: false,
  rides: () => this.hasMany(Ride),
});

module.exports = rideWaitTime;
