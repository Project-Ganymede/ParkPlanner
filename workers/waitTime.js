const CronJob = require('cron').CronJob;
const helpers = require('../server/config/helpers');
const Rides = require('../server/collections/rides');

var job = new CronJob({
  cronTime: '00 */15 * * * *',
  onTick: function() {
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
     helpers.getWaitTimes();
     console.log('CronJob Tick...');
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});
job.start();


var weatherJob = new CronJob({
  cronTime: '0 0 */2 * * *',
  onTick: function() {
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
     helpers.getCurrentWeather();
     console.log('Weather CronJob Tick...');
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});
weatherJob.start();