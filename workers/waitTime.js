const CronJob = require('cron').CronJob;
const helpers = require('../server/config/helpers');
const Rides = require('../server/collections/rides');

exports.getWaitTimes = new CronJob({
  cronTime: '0 */4 * * *',
  onTick: () => {
    helpers.getWaitTimes();
    console.log('CronJob Tick...');
  },
  start: false,
});
