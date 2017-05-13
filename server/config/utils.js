
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

// Normalizes times to quarter-hours (13:00, 13:15, 13:30, etc.)
const toQuarterHour = (hourStr) => {
  const time = moment(hourStr, 'h:mm a');
  return `${time.hour()}:${Math.floor(time.minute() / 15) * 15}`;
}

let utils = {
  reduceTimeData : modelArray => {
    /* accepts arrays of RideWaitTimes table models */
    return modelArray.reduce((acc, model, index) => {
      let atts = model.attributes;
      const currentHour = toQuarterHour(atts.hour);
      if(atts.isActive) {
        if(acc[currentHour]) {
          acc[currentHour].push(atts.waitTime);
          return acc;
        } else {
          acc[currentHour] = [atts.waitTime];
          return acc;
        }
      } else {
        // if(acc[currentHour]) {
        //   acc[currentHour].push(null);

        //   return acc;
        // } else {
        //   acc[currentHour] = [null];

          return acc;
        // }
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
    return Weather.where({'location' : JSON.stringify(location)}).fetch()
      .then(weather => {
        return weather;
      });
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
