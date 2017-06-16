const CronJob = require('cron').CronJob;
const helpers = require('../server/config/helpers');
const Rides = require('../server/collections/rides');

console.log('Robots activate')

var waitTimeJob = new CronJob({
  cronTime: '00 */10 * * * *',
  onTick: function() {
    // Runs every 15 minutes on the minute.
    helpers.getWaitTimes();
    console.log('getWaitTime CronJob Tick...');
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});
waitTimeJob.start();


var weatherJob = new CronJob({
  cronTime: '0 0 */2 * * *',
  onTick: function() {
    // Runs every other hour on the hour
    helpers.getCurrentWeather();
    console.log('getCurrentWeather CronJob Tick...');
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});
weatherJob.start();
