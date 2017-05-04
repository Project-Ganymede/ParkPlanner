const path = require('path');

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'ganymede_greenfield_2',
    charset: 'utf8'
  }
});

const db = require('bookshelf')(knex);

db.knex.schema.hasTable('parks').then((exists) => {
  if (!exists) {
      db.knex.schema.createTable('parks', (park) => {
        park.increments('id').primary();
        park.string('parkName', 100).notNullable();
        park.string('apiParkName', 200).notNullable();
        park.date('created_at');
        park.date('updated_at');
        park.bool('hasFastPass');

        //park.date('updated_at');
        // API references parks by name
        // park.integer('api_code').notNullable();

        // API includes Company in name
        // park.string('company_name', 100).notNullable();

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
      ride.string('apiId', 200).notNullable();
      ride.string('rideName', 100).notNullable();
      ride.integer('parkId').references('parks.id');
      ride.bool('hasFastPass');
			ride.integer('location');
			ride.integer('capacity');
			ride.integer('throughput');
      ride.date('created_at');
      ride.date('updated_at');
		}).then(function(table){
			console.log('Created "rides" Table', table);
		});
  }
});

db.knex.schema.hasTable('ride_wait_times').then(function(exists) {
	if(!exists) {
		db.knex.schema.createTable('ride_wait_times', function(waitTime) {
			waitTime.increments('id').primary();
      waitTime.integer('rideId').references('rides.id');
			waitTime.integer('waitTime');
      waitTime.string('status');
      waitTime.bool('isActive');
      waitTime.integer('temp');
			waitTime.integer('precip');
      waitTime.string('date');
      waitTime.string('hour');
		}).then((table) => {
			console.log('Created "ride_wait_times" Table', table);
		});
	}
});


db.knex.schema.hasTable('weather_entries').then(function(exists) {
	if(!exists) {
		db.knex.schema.createTable('weather_entries', function(weather) {
			weather.increments('id').primary();
      weather.json('location');
      weather.json('weatherObj');
		}).then((table) => {
			console.log('Created "weather_entries" Table', table);
		});
	}
});

module.exports = db;
