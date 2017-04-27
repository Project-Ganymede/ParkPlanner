const db = require('../config');
const Park = require('../models/park');

const Parks = new db.Collection();

Parks.model = Park;

module.exports = Parks;
