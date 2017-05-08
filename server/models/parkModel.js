var db = require('../config/config');
var Ride = require('./rideModel');

var Park = db.Model.extend({
  tableName: 'parks',
  hasTimestamps: true,
  rides: () => this.hasMany(Ride),
  //initialize: () => {},
});

module.exports = Park;
