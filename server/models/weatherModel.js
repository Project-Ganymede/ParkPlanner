var db = require('../config/config');

var Weather = db.Model.extend({
  tableName: 'weather_entries',
  hasTimestamps: false
  //initialize: () => {},
});

module.exports = Weather;
