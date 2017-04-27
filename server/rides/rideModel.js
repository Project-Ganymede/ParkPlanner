var db = require('bookshelf')(knex);

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
			console.log('Created Table', table)
		});
  }
});