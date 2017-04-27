var db = require('../config');
var Ride = required('./ride');

var Park = db.Model.extend({
  tableName: 'parks',
  hasTimestamps: true,
  rides: () => this.hasMany(Ride),
  //initialize: () => {},
})

module.exports = Park;
