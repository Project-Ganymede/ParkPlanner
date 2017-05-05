// Define our Collection and Model Variables
const Parks = require('../collections/parks.js');
const Park = require('../models/parkModel.js');
const Rides = require('../collections/rides.js');
const Ride = require('../models/rideModel.js');
const WaitTimes = require('../collections/rideWaitTimes.js');
const WaitTime = require('../models/rideWaitTimeModel.js');
const helpers = require('./helpers');
const request = require('request');
const db = require('./config');
const BING_API_KEY = require('./apiKey');
module.exports = (app, express) => {

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/parks', (req, res) => {
    Parks.fetch().then(parks => {
      res.status(200).send(parks.models);
    }).catch(err => {
      res.status(404).send(err);
      console.error('GET Parks Error:', err);
    });
  });

  app.get('/rides', (req, res) => {
    Ride.where({parkId: req.headers.parkid}).fetchAll().then(rides => {
      rides.forEach(ride => {
        // Set Headers for Bing API
        let options = {
          url: `https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=${ride.attributes.rideName}&mkt=en-us&count=1`,
          port: 3000,
          headers: {
            'Ocp-Apim-Subscription-Key': BING_API_KEY,
            'content-type': 'application/json'
          },
          json: true
        };
        request(options, (err, res, body) => {
          if (body.queryExpansions !== undefined) {
            //console.log(body.queryExpansions[0].thumbnail.thumbnailUrl)
            ride.attributes.imageUrl = body.queryExpansions[0].thumbnail.thumbnailUrl;
            ride.save();
          } else {
            ride.attributes.imageUrl = 'https://static-communitytable.parade.com/wp-content/uploads/2013/07/roller-coaster-ftr.jpg';
            ride.save();
          }
        })
      })
      res.send(rides);
    }).then(rides => {
      res.send(rides);
    }).catch(err => {
      res.status(404).send(err);
      console.error('GET Rides Error:', err);
    });
  });

  // app.post('/rideList', (req, res) => {
  //   app.get('/waitTimes', (req, res) => {
  //     WaitTimes.fetch()
  //     .then(times => {
  //       res.status(200).send(times.model);
  //     })
  //     .catch(err => {
  //       res.status(404).send(err);
  //       console.error('GET Wait Time Error:', err);
  //     });
  //   });
  // });

  app.get('/rideList', (req, res) => {
    console.log(req.headers.rides);
    helpers.returnWaitTimes(req.headers.rides).then(data => {
      console.log(data);
      res.status(200).send(data);
    }).catch(err => {
      res.status(404).send(err);
      console.error('GET Rides Error:', err);

    });
  });

  app.post('/test', (req, res) => {
    console.log('get post to test');
    helpers.addRideDescriptions();
  });

};
