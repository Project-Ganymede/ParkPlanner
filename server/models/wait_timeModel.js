var moment = require('moment')

var db = require('../config');
var Wait_time = require('./ride');

var Wait_time = db.Model.extend({
  tableName: 'wait_time',
  hasTimestamps: true,
  rides: () => this.hasMany(Ride),
  initialize: () => {
    this.date = moment().format('L')
    this.time = moment().format('LT')
  },
})

module.exports = Wait_time;
