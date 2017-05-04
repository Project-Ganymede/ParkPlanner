
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
      if(model.isActive) {
        if(acc[model.hour]) {
          acc[model.hour].push(model.waitTime);
          return acc;
        } else {
          acc[model.hour] = [model.waitTime];
          return acc;
        }
      } else {
        if(acc[model.hour]) {
          acc[model.hour].push(null);
          return acc;
        } else {
          acc[model.hour] = [null];
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
