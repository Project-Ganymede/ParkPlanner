const moment = require('moment');
const Themeparks = require('themeparks');

const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/parks');
const Park = require('../models/parkModel');
const RideWaitTimes = require('../collections/rideWaitTimes');
const RideWaitTime = require('../models/rideWaitTimeModel');
const WeatherEntries = require('../collections/WeatherEntries');
const Weather = require('../models/weatherModel');




// Helper Functions


let helper = {
  getWaitTimes : () => {
    Park.fetchAll()
      .then(arrayOfParkObjects => {
        arrayOfParkObjects.forEach(parkObj => {
          Weather.fetch({'location': parkObj.location})
            .then(weatherModel => {
              new Themeparks.Parks[parkObj.apiParkName]().GetWaitTimes
                .then(waitTimesArray => {
                  waitTimesArray.forEach(waitTimeObj => {
                    Ride.fetchOne({'apiId': waitTimeObj.id})
                      .then(rideModel => {
                        helper.createNewWaitEntry(rideModel, waitTimeObj, weatherModel);
                      });
                  });
                });
            });
        });
      });
  },

  createNewWaitEntry : (rideModel, waitTimeObj, weatherModel) => {
        return new RideWaitTime({
          rideId: rideModel.id,
          waitTime: waitTimeObj.waitTime,
          status: waitTimeObj.status,
          active: waitTimeObj.active,
          temp: weatherModel.weather.currently.apparentTemperature,
          precip: weatherModel.weather.currently.precipIntensity,
        });
  },

  /*======================================
    ======     POPULATION HELPERS    =====
    The functions below serve only to populate
    the "rides" and "parks" tables for future use.
    Do not call these functions once the tables
    have been created as they do not check if the
    model already exists and will duplicate entries,
    doubling the run time of functions that iterate through each park or ride.
    ====================================== */



  populateRidesTable: () => {
    // ======================================
    // ======     ONLY RUN ONE TIME     =====
    // ======================================
    for( let park in Themeparks.Parks) {
      if (Themeparks.Parks.hasOwnProperty(park)) {
        let parkObj = new Themeparks.Parks[park]();
        let name = parkObj.Name;
        Park.where('parkName', name).fetch()
        .then(parkEntry => {
          parkObj.GetWaitTimes()
            .then(apiRidesArr => {
              apiRidesArr.forEach(apiRideObj=> {
                helper.createNewRide(apiRideObj, parkEntry);
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

  createNewRide : (apiRideObj, parkEntry) => {
          return new Ride({
            apiId : apiRideObj.id,
            rideName: apiRideObj.name,
            parkId : parkEntry.id,
            hasFastPass: apiRideObj.fastPass,
            location: parkEntry.location
          }).save()
          .then( ride => {
            //console.log(ride);
          })
          .catch( err => {
            console.error(err);
          });
  },

  populateParksTable : () => {
    // ======================================
    // ======     ONLY RUN ONE TIME     =====
    // ======================================
    let parkArr = [];
    for( let park in Themeparks.Parks) {
      if (Themeparks.Parks.hasOwnProperty(park)) {
        let currPark = new Themeparks.Parks[park]();
        parkArr.push({
          'apiParkName' : park,
          'parkName': currPark.Name,
          'location' : JSON.stringify({
            'latitude' : currPark.Location.LatitudeRaw,
            'longitude' :currPark.Location.LongitudeRaw
          }),
          'fastPass' : currPark.FastPass
        });

      }
    }
    parkArr.forEach(parkObj => {
      helper.createNewPark(parkObj);
    });
  },

  createNewPark: parkObj => {
    helper.checkIfParkExists(parkObj)
      .then(exists => {
        if(!exists) {
          return new Park({
          parkName : parkObj.parkName,
          apiParkName : parkObj.apiParkName,
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

module.exports = helper;
