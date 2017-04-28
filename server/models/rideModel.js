const db = require('../config');
const Park = require('../parkModel');
const	RideWaitTime = require('../rideWaitTimeModel')

let Ride = db.Model.extend({
	tableName: 'rides',
	hasTimestamps: true,
	park: () => this.belongsTo(Park);
	rideWaitTime: () => this.belongsToMany(RideWaitTime);
})

module.exports = Ride;
