const path = require('path');
const knex = require('knex')({
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

module.exports = db;
