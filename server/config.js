
var path = require('path')
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.HOST,
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
        park.integer('api_code').notNullable();
        park.string('park_name', 100).notNullable();
        park.string('company_name', 100).notNullable();
        park.string('country', 100).notNullable();
        park.string('city', 100).notNullable();
        park.string('state', 100);
        park.string('address', 100).notNullable();
        park.string('extra_1', 100);
        park.string('extra_2', 100);

      }).then((table) => {
        console.log('Created "parks" Table', table);
      });
  }
});

db.knex.schema.hasTable('rides').then(function(exists) {
	if(!exists) {
		db.knex.schema.createTable('rides', function(ride) {
			ride.increments('id').primary();
			ride.string('ride_name', 100);
			ride.foreign('park_id').references('parks.park_id');
			ride.integer('location');
			ride.integer('capacity');
			ride.integer('throughput');
		}).then(function(table){
			console.log('Created "rides" Table', table)
		});
  }
});

db.knex.schema.hasTable('wait_time').then(function(exists) {
	if(!exists) {
		dd.knex.schema.createTable('wait_time', function(time) {
			time.increments('id').primary();
			time.integer('temperature');
			time.integer('wait_time');
			time.integer('precipitation');
			time.date('date');
			time.time('time');
			time.foreign('ride_id').references('rides.ride_id');
		}).then((table) => {
			console.log('Created "wait_time" Table', table)
		});
	}
});

module.exports = db;
