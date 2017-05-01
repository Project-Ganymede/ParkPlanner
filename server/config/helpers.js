const moment = require('moment');
const Themeparks = require('themeparks');

const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/parks');
const Park = require('../models/parkModel');
const RideWaitTimes = require('../collections/rideWaitTimes');
const RideWaitTime = require('../models/rideWaitTimeModel');



// Helper Functions


let helperFuncs = {
  getWaitTimes : () => {
    helperFuncs.getRidesFromAPI()
      .then((arrayOfRideObjects) => {
        helperFuncs.queryWeatherAPI()
          .then((weatherObj)=> {
            arrayOfRideObjects.forEach((rideObj) => {
              helperFuncs.createNewWaitEntry(rideObj, weatherObj);
            });
          });
        });
  },

  getRidesFromAPI : () => {

    return arrayOfRideObjects;
  },

  getWeatherFromAPI : () => {
    return {'temp': temp, 'precip': precip};
  },

  createNewWaitEntry : (rideObj, weatherObj) => {
    Ride.fetchOne({'api_id': rideObj.id})
    .then( model => {
      if(model) {
        return new RideWaitTime({
          apiId: model.id,
          waitTime: rideObj.waitTime,
          status: rideObj.status,
          active: rideObj.active,
          temp: weatherObj.temp,
          precip: weatherObj.precip,

          // Move the time creation to rideModel.js
          date: moment().formate('L'),
          time: moment().format('LT'),
        });
      }
    });
  },

  populateRideTable: () => {
    // Queries ThemeparkAPI and inserts any new rides into rides table
    helperFuncs.getRidesFromAPI().then(apiArrayOfRideObjects => {
      apiArrayOfRideObjects.each( apiObject => {
        helperFuncs.checkIfRideExists(apiObject).then(exists => {
          if(!exists) {
            helperFuncs.createNewRide(apiObject);
          }
        });
      });
    });
  },

  checkIfRideExists: apiRideObj => {
    // Returns a promise that eventually resolves to true or false
    Ride.fetch({'api_id': apiRideObj.id} ).then(exists => !!exists);
  },

  createNewRide : rideObj => {
    return new Ride({
      apiId : rideObj.id,
      rideName: rideObj.name,
      //location: getRideLocation() Use GeoLocation to get ride coords
      fastPass: rideObj.fastPass,
    });
  },
  stringToJsonObj : string => {
    let arr  = string.replace('(','').replace(')','').split(',');
    return JSON.stringify({
      'latitude': arr[0],
      'longitude': arr[1]
    });
  },

  populateParks : () => {
    let parkArr = [];
    for( let park in Themeparks.Parks) {
      if (Themeparks.Parks.hasOwnProperty(park)) {
        let currPark = new Themeparks.Parks[park]();
        parkArr.push({
          'parkName': currPark.Name,
          'location' : helperFuncs.stringToJsonObj(currPark.Location.toString()),
          'fastPass' : currPark.FastPass
        });

      }
    }
    parkArr.forEach(parkObj => {
      helperFuncs.createNewPark(parkObj);
    });
  },


  createNewPark: parkObj => {
    return new Park({
      parkName : parkObj.parkName,
      location : parkObj.location,
      hasFastPass : parkObj.fastPass,
    }).save()
    .then( themepark => {
      console.log(themepark);
    })
    .catch( err => {
      console.error(err);
    });
  }
};

module.exports = helperFuncs;
