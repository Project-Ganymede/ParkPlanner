const db = require('../config/config');
const Park = require('../models/parkModel');

const Parks = new db.Collection();

Parks.model = Park;

module.exports = Parks;
