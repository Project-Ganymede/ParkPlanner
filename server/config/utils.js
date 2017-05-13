
const moment = require('moment');
const Themeparks = require('themeparks');
const async = require('async');
const _ = require('lodash');

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
        if(acc[atts.hour]) {
          acc[atts.hour].push(atts.waitTime);
          // console.log(acc);
          return acc;
        } else {
          acc[atts.hour] = [atts.waitTime];
          // console.log(acc);
          return acc;
        }
      } else {
<<<<<<< HEAD
        if(acc[atts.hour]) {
          acc[atts.hour].push(null);
          // console.log(acc);

          return acc;
        } else {
          acc[atts.hour] = [null];
          // console.log(acc);
          return acc;
=======
          return acc;
>>>>>>> optimizeMore
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

  optimize: (rideInfoList, startTime) => {
    const currentMoment = moment(startTime, 'LT');
    utils.possibilities = [];
    utils.shortestTime = Infinity;

    rideInfoList.forEach(rideWaitTimes => {
      utils.findRoutes(rideWaitTimes, rideInfoList, currentMoment);
    });
    console.log('possibilities: ', utils.possibilities);
    console.log('shortest route: ', utils.shortestRoute);
    return utils.shortestRoute;
  },

  findRoutes: (rideWaitTimes, ridesLeft, currentMoment, route = [], totalWait = 0, totalTime = 0) => {
    ridesLeft = ridesLeft.slice();
    route = route.slice();

    // find waitTime closest to currentMoment
    const waitTime = _.reduce(rideWaitTimes.timeData, (result, value, key) => {
      const diffFromCurrent = Math.abs(moment(key, 'LT') - currentMoment);
      if (diffFromCurrent < result.diffFromCurrent && value ) {
        return { diffFromCurrent, minutes: value || 0 }
      }
      return result;
    }, { diffFromCurrent: Infinity });
    console.log('minutes: ', waitTime.minutes);
    // overwrite waitTime.minutes if it is null
    waitTime.minutes = waitTime.minutes || 0;
    // update trackers
    currentMoment = currentMoment.add(waitTime.minutes + 15, 'm');
    totalWait += waitTime.minutes;
    totalTime += waitTime.minutes + 15;
    // set object props, new currTime, totalWait
    const ride = {
      waitTime,
      rideName: rideWaitTimes.rideData.get('rideName'),
      rideTime: currentMoment.format('LT'),
      imageUrl: rideWaitTimes.rideData.get('imageUrl')
    };

    route.push(ride);
    _.remove(ridesLeft, r => r === rideWaitTimes);

    if (totalTime < utils.shortestTime) {
      if (ridesLeft.length) {
        ridesLeft.forEach(ride => {
          utils.findRoutes(ride, ridesLeft, currentMoment, route, totalWait, totalTime);
        })
      } else {
        utils.shortestTime = totalTime;
        utils.shortestRoute = { route, totalWait, totalTime };
        utils.possibilities.push(utils.shortestRoute);
      }
    }
  }

};

module.exports = utils;
