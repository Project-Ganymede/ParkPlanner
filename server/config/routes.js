// Define our Collection and Model Variables
const Parks = require('../collections/parks.js');
const Park = require('../models/parkModel.js');
const Rides = require('../collections/rides.js');
const Ride = require('../models/rideModel.js');
const helpers = require('./helpers');
const BING_API_KEY = require('./apiKey');

module.exports = (app, express) => {

  app.get('/test', (req, res) => {
    helpers.getWaitTimes();
    res.send();
  })

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
    Ride.where({parkId: req.headers.parkid}).fetchAll()
      .then(rides => {
        Park.where({id: req.headers.parkid}).fetch()
          .then(parks => {
            rides.forEach(ride => {
              ride.attributes.parkName = parks.attributes.parkName;
              ride.save();
            });
            res.send(rides);
          });
      })
      .catch(err => {
        res.status(404).send(err);
        console.error('GET Rides Error:', err);
      });
  });

  app.get('/rideList', (req, res) => {
    console.log(req.headers.rides);
    helpers.returnWaitTimes(req.headers.rides)
      .then(data => {
      res.status(200).send(data);
      })
      .catch(err => {
        res.status(404).send(err);
        console.error('GET Rides Error:', err);
      });
  });
};
