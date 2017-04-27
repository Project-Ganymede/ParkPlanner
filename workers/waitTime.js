var CronJob = require('cron').CronJob;
var Rides = require('../server/collections/rides');

exports.job = new CronJob({
  cronTime: '0 */4 * * *',
  onTick: () => console.log('CronJob Tick...'),
  start: false,
});
