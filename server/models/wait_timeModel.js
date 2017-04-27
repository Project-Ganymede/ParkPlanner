var db = require('../config');
var Wait_time = required('./ride');

var Wait_time = db.Model.extend({
  tableName: 'wait_time',
  hasTimestamps: true,
  wait_time: () => this.hasMany(Wait_time),
  //initialize: () => {},
})

module.exports = Wait_time;