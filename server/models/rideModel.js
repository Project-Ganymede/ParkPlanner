let db = require('../config');
let Park = require('./ride');

let Ride = db.Model.extend({
	tableName: 'rides',
	hasTimestamps: true,
	park: () => this.belongsTo(Park),
})

module.exports = Ride;
