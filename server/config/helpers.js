const moment = require('moment')

const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/park');
const Park = require('../models/parkModel');



// Helper Functions


module.exports = {
  getWaitTimes : () => {
    queryThemeparksAPI()
      .then((arrayOfRideObjects) => {
        queryWeatherAPI()
          .then((weatherObj)=> {
            arrayOfRideObjects.forEach((rideObj) => {
              createNewWaitEntry(rideObj, weatherObj)
            })
          })
        });
      });
  },

  queryThemeparksAPI : () => {
    return arrayOfRideObjects;
  },

  queryWeatherAPI : () => {
    return {'temp': temp, 'precip': precip};
  },

  createNewWaitEntry : (rideObj, weatherObj) => {
    Ride.fetchOne({'api_id': rideObj.id})
      .then( model => {
        if(model) {
          new RideWaitTime({
            api_id: model.id,
            wait_time: rideObj.waitTime,
            status: rideObj.status,
            active: rideObj.active,
            temp: weatherObj.temp,
            precip: weatherObj.precip,

            // Move the time creation to rideModel.js
            date: moment().formate('L'),
            time: moment().format('LT'),
          })
        }
      })
  },

  populateRideTable: () => {
    // Queries ThemeparkAPI and inserts any new rides into rides table
    queryThemeparksAPI().then(apiArrayOfRideObjs => {
      arrayOfRideObjects.each( apiObject => {
        checkIfRideExists(apiObject).then(exists => {
          if(!exists) {
            createNewRide(apiObj)
          }
        })
    })
  },

  checkIfRideExists: apiRideObj => {
    // Returns a promise that eventually resolves to true or false
    Ride.fetch({'api_id': apiRideObj.id ).then(exists => !!exists)
  },

  createNewRide : rideObj => {
    new Ride({
      api_id : rideObject.id,
      ride_name: rideObject.name,
      fastPass: rideObject.fastPass,

    })
  },


};
