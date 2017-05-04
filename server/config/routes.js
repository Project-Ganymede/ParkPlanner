// Define our Collection and Model Variables
const Parks = require('../collections/parks.js');
const Park = require('../models/parkModel.js');
const Rides = require('../collections/rides.js');
const Ride = require('../models/rideModel.js');
const WaitTimes = require('../collections/rideWaitTimes.js');
const WaitTime = require('../models/rideWaitTimeModel.js');
const helpers = require('./helpers');


module.exports = (app, express) => {

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/parks', (req, res) => {
    Parks.fetch()
    .then(parks => {
      res.status(200).send(parks.models);
    })
    .catch(err => {
      res.status(404).send(err);
      console.error('GET Parks Error:', err);
    });
  });

  app.get('/rides', (req, res) => {
    Rides.fetch()
    .then(rides => {
      res.status(200).send(rides.models);
    })
    .catch(err => {
      res.status(404).send(err);
      console.error('GET Rides Error:', err);
    });
  });

  app.post('/rideList', (req, res) => {
    app.get('/waitTimes', (req, res) => {
      WaitTimes.fetch()
      .then(times => {
        res.status(200).send(times.model);
      })
      .catch(err => {
        res.status(404).send(err);
        console.error('GET Wait Time Error:', err);
      });
    });
  });

  app.get('/test', (req, res) => {
    helpers.getWaitTimes();
    setTimeout(function() {
      WaitTimes.fetch()
      .then(rides => {
        res.status(200).send(rides.models);
      })
      .catch(err => {
        res.status(404).send(err);
        console.error('GET Rides Error:', err);
      });
    }, 2000);
  });
};
