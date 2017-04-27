let db = require('../config');
let Park = required('./ride');

let Ride = db.Model.extend({
	tableName: 'rides',
	hasTimestamps: true,
	rides: () => this.hasMany(Ride),
})

module.exports = Ride;