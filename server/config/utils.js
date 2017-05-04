
const moment = require('moment');
const Themeparks = require('themeparks');
const async = require('async');

const util = require('./utils');
const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/parks');
const Park = require('../models/parkModel');
const RideWaitTimes = require('../collections/rideWaitTimes');
const RideWaitTime = require('../models/rideWaitTimeModel');
// const WeatherEntries = require('../collections/WeatherEntries');
const Weather = require('../models/weatherModel');

module.exports = {
  reduceTimeData : modelArray => {
    /* accepts arrays of RideWaitTimes table models */
    return modelArray.reduce((acc, model, index) => {
      let atts = model.attributes
      if(atts.isActive) {
        if(acc[atts.hour]) {
          acc[atts.hour].push(atts.waitTime);
          console.log(acc);
          return acc;
        } else {
          acc[atts.hour] = [atts.waitTime];
          console.log(acc);
          return acc;
        }
      } else {
        if(acc[atts.hour]) {
          acc[atts.hour].push(null);
          console.log(acc);

          return acc;
        } else {
          acc[atts.hour] = [null];
          console.log(acc);

          return acc;
        }
      }
    }, {});
  },

  gatherParks : () => {
    return Parks.fetch()
      .then(parks => {
        return parks.models;
      });
  },

  gatherWeather : location => {
    return Weather.where({'location' : location}).fetch()
      .then(model => model);
  },

  gatherWaitTimes : parkName => {
    return (new Themeparks.Parks[parkName]().GetWaitTimes()
      .then(rides => {
        return rides;
      })
    );
  },

  gatherRide : apiId => {
    return Ride.where({'apiId' : apiId}).fetch()
      .then(ride => {
        // console.log(ride.attributes);
        return ride;
      });
  }
};
