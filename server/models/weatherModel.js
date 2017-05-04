var db = require('../config/config');

var Weather = db.Model.extend({
  tableName: 'weather_entries',
  hasTimestamps: true,
  //initialize: () => {},
});

module.exports = Weather;
