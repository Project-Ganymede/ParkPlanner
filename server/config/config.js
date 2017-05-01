const path = require('path');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'ganymede_greenfield',
    charset: 'utf8'
  }
});

const db = require('bookshelf')(knex);

db.knex.schema.hasTable('parks').then((exists) => {
  if (!exists) {
      db.knex.schema.createTable('parks', (park) => {
        park.increments('id').primary();

        // API references parks by name
        // park.integer('api_code').notNullable();

        park.string('park_name', 100).notNullable();

        // API includes Company in name
        //park.string('company_name', 100).notNullable();

        /* This park's location as a "GeoLocation" object. Inputs will need to be stringified from
        // API call before construction of new park and JSON.parsed when used.
        // See GeoLocation Docs for available methods/properties) */
        park.json('location');

      }).then((table) => {
        console.log('Created "parks" Table', table);
      });
  }
});

db.knex.schema.hasTable('rides').then(function(exists) {
	if(!exists) {
		db.knex.schema.createTable('rides', function(ride) {
			ride.increments('id').primary();
      ride.string('api_id', 200).notNullable();
      ride.string('ride_name', 100).notNullable();
      ride.bool('hasFastPass');
			ride.integer('location');
			ride.integer('capacity');
			ride.integer('throughput');
		}).then(function(table){
			console.log('Created "rides" Table', table);
		});
  }
});

db.knex.schema.hasTable('ride_wait_times').then(function(exists) {
	if(!exists) {
		db.knex.schema.createTable('ride_wait_times', function(waitTime) {
			waitTime.increments('id').primary();
			waitTime.integer('wait_time');
      waitTime.string('status');
      waitTime.bool('isActive');
      waitTime.integer('temp');
			waitTime.integer('chancePrecip');
		}).then((table) => {
			console.log('Created "ride_wait_times" Table', table);
		});
	}
});

module.exports = db;
