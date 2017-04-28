var CronJob = require('cron').CronJob;
var helpers = require('../server/config/helpers')
var Rides = require('../server/collections/rides');

exports.job = new CronJob({
  cronTime: '0 */4 * * *',
  onTick: () => {
    helpers.getWaitTimes();
    console.log('CronJob Tick...');
  },
  start: false,
});
