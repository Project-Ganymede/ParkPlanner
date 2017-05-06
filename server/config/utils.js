
const moment = require('moment');
const Themeparks = require('themeparks');
const async = require('async');

const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/parks');
const Park = require('../models/parkModel');
const RideWaitTimes = require('../collections/rideWaitTimes');
const RideWaitTime = require('../models/rideWaitTimeModel');
// const WeatherEntries = require('../collections/WeatherEntries');
const Weather = require('../models/weatherModel');

let utils = {
  reduceTimeData : modelArray => {
    /* accepts arrays of RideWaitTimes table models */
    return modelArray.reduce((acc, model, index) => {
      let atts = model.attributes;
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
  },

  optimize : (remainingRides, time={'total' : 0, 'current' :'8:00 AM' }, route=[]) => {
    if(remainingRides.length === 1) {
      route.push(remainingRides[0]);
      time.total = time.total + remainingRides[0].timeData[time.current];
      time.current = time.current + remainingRides[0].timeData[time.current];
      possibilities.push({
        'route' : route,
        'stats' : time,
      });
    } else {
      remainingRides.forEach((ride, index) => {
        time.total = time.total + ride.timeData[time.current] + 20;
        time.current = time.current + ride.timeData[time.current] + 20;
        route.push(ride);
        remainingRides.splice(index, 1);
        utils.optimize(remainingRides, time, route);
      });
    }
  }
};

module.exports = utils;
