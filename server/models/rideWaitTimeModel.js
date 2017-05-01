const moment = require('moment');

const db = require('../config');
const Ride = require('./rideModel');

let rideWaitTime = db.Model.extend({
  tableName: 'wait_time',
  hasTimestamps: true,
  rides: () => this.hasMany(Ride),
  initialize: () => {
    this.date = moment().format('L');
    this.time = moment().format('LT');
  }
});

module.exports = rideWaitTime;
