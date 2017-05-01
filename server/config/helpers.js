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

  populateRidesTable: () => {
    // Queries ThemeparkAPI and inserts any new rides into rides table
    let parkArr = [];
    let counter = 0;
    for( let park in Themeparks.Parks) {
      if (Themeparks.Parks.hasOwnProperty(park)) {
        let parkObj = new Themeparks.Parks[park]();
        let name = parkObj.Name;
        Park.where('parkName', name).fetch()
        .then(parkEntry => {
          parkObj.GetWaitTimes()
            .then(apiRidesArr => {
              apiRidesArr.forEach(apiRideObj=> {
                counter++;
                helperFuncs.createNewRide(apiRideObj, parkEntry.id);
                console.log(counter);
              });
            });
        });
      }
    }
  },

  checkIfRideExists: apiRideObj => {
    // Returns a promise that eventually resolves to true or false
    return Rides.fetchOne({'apiId': apiRideObj.id})
      .then(exists => !!exists)
      .catch(err => console.error(err));
  },

  createNewRide : (apiRideObj, parkId) => {
    // helperFuncs.checkIfRideExists(apiRideObj)
    //   .then(exists => {
    //     if(!exists) {
    //       console.log('~~~~~~~~~~~~~');
    //       console.log(apiRideObj);
    //       console.log(exists);
    //       console.log('~~~~~~~~~~~~~');
          return new Ride({
            apiId : apiRideObj.id,
            rideName: apiRideObj.name,
            parkId : parkId,
            hasFastPass: apiRideObj.fastPass,
            //location: getRideLocation() Use GeoLocation to get ride coords
          }).save()
          .then( ride => {
            //console.log(ride);
          })
          .catch( err => {
            console.error(err);
          });
      //   }
      // });
  },
  stringToJsonObj : string => {
    let arr  = string.replace('(','').replace(')','').split(',');
    return JSON.stringify({
      'latitude': arr[0],
      'longitude': arr[1]
    });
  },

  populateParksTable : () => {
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
    helperFuncs.checkIfParkExists()
      .then(exists => {
        if(!exists) {
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
      });
  },

  checkIfParkExists: apiParkObj => {
    // Returns a promise that eventually resolves to true or false
    return Parks.fetchOne({'apiId': apiParkObj.id})
      .then(exists => !!exists)
      .catch(err => console.error(err));
  },
};

module.exports = helperFuncs;
