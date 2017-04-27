const db = require('../config');
const WaitTime = require('../models/waitTime');

const WaitTimes = new db.Collection();

WaitTimes.model = WaitTime;

module.exports = WaitTimes;