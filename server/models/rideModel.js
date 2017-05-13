const moment = require('moment');

const db = require('../config/config');
const Park = require('./parkModel');
const RideWaitTime = require('./rideWaitTimeModel');

let Ride = db.Model.extend({
  tableName: 'rides',
  hasTimestamps: true,
  park: () => this.belongsTo(Park),
  rideWaitTime: () => this.belongsToMany(RideWaitTime),
  initialize: () => {
    this.date = moment().format('L');
    this.time = moment().format('LT');
  },
});

module.exports = Ride;
