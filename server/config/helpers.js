const moment = require('moment');
const Themeparks = require('themeparks');

const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/park');
const Park = require('../models/parkModel');
const RideWaitTimes = require('../collections/rideWaitTimes');
const RideWaitTime = require('../models/rideWaitTimeModel');



// Helper Functions


module.exports = {
  getWaitTimes : () => {
    this.getRidesFromAPI()
      .then((arrayOfRideObjects) => {
        this.queryWeatherAPI()
          .then((weatherObj)=> {
            arrayOfRideObjects.forEach((rideObj) => {
              this.createNewWaitEntry(rideObj, weatherObj);
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
    this.getRidesFromAPI().then(apiArrayOfRideObjects => {
      apiArrayOfRideObjects.each( apiObject => {
        this.checkIfRideExists(apiObject).then(exists => {
          if(!exists) {
            this.createNewRide(apiObject);
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

  populateParks : () => {
    let parkArr = [];
    for( let park in Themeparks.Parks) {
      if (Themeparks.Parks.hasOwnProperty(park)) {
        let currPark = new Themeparks.Parks[park]();
        parkArr.push({
          'parkName': Park.Name,
          'location' : this.stringToJsonObj(Park.Location.toString()),
          'fastPass' : Park.FastPass
        });

      }
    }
    parkArr.forEach(parkObj => {
      this.createNewPark(parkObj);
    });
  },

  stringToJsonObj : string => {
    let arr  = string.replace('(','').replace(')','').split(',');
    return JSON.stringify({
      'latitude': arr[0],
      'longitude': arr[1]
    });
  },

  createNewPark: parkObj => {
    return new Park({
      parkName : parkObj.parkName,
      location : parkObj.location,
      fastPass : parkObj.fastPass,
    })
    .then( themepark => {
      console.log(themepark);
    })
    .catch( err => {
      console.error(err);
    });
  }
};
