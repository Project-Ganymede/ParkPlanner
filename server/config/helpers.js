const moment = require('moment');
const Themeparks = require('themeparks');
const async = require('async');
const _ = require('lodash');

const util = require('./utils');
const Rides = require('../collections/rides');
const Ride = require('../models/rideModel');
const Parks = require('../collections/parks');
const Park = require('../models/parkModel');
const RideWaitTimes = require('../collections/rideWaitTimes');
const RideWaitTime = require('../models/rideWaitTimeModel');
// const WeatherEntries = require('../collections/WeatherEntries');
const Weather = require('../models/weatherModel');
let data = require('../../data/parkLocations.json');
const request = require('request');


const returnDayOfWeekData = (rideId, dayOfWeek) => {
  // fetch all data, then filter out the data for dates that do not fall on dayOfWeek
  const dayMatch = (dateStr) => {
    return moment(dateStr, 'MM/DD/YYYY').days() === dayOfWeek;
  }
  return new Promise((resolve, reject) => {
    RideWaitTime.where({rideId, status: 'Operating'}).fetchAll()
      .then(modelArray => {
        resolve(modelArray);
      })
  })
  .then(modelArray => {
    return modelArray.filter(model => dayMatch(model.get('date'), dayOfWeek));
  })
}
// Helper Functions

let helpers = {

  returnWaitTimes : rideIdList => {
    // Loops through input list & fetches every wait_time_entry model for a given id.
    // Then returns an array of the data for those entries.
    return Promise.all(JSON.parse(rideIdList).map(rideId => {
      return new Promise((resolve, reject) => {
          RideWaitTime.where({'rideId' : rideId, status: 'Operating'}).fetchAll()
            .then(modelArray => {
            // timeData will be a reduction of the list of RideN entries to a single object :
            // { '12:00am': [45, 20, 16, 25, 52], '12.15am' : [60, 50, 55 ...], ....}
              // console.log('In runWaitTimes ----------------------')
              // console.log(modelArray);
              let rideInfo = {'timeData' : util.reduceTimeData(modelArray.models)};
              // Get the modelObj from the 'rides' table to pass back data about each ride
              Ride.where({'id' : modelArray.models[0].attributes.rideId}).fetch()
                .then(rideModel => {
                  rideInfo['rideData'] = rideModel;
                  resolve(rideInfo);
                })
                .catch(err => console.error(err));
            })
            .catch(err => reject(err));
      });
    }))
    .then(rideInfoArray => {
      // Should return an array of objs: [{rideData: {}, timeData: []}]
      return  rideInfoArray.map(rideObj => {
        let timeObj = {};
        Object.keys(rideObj.timeData).sort().forEach( key => {
          let waitTotal = rideObj.timeData[key].reduce((acc, item) =>  acc + item);
          let waitAvg = waitTotal / rideObj.timeData[key].length;
          timeObj[key] = waitAvg;
        });
        rideObj.timeData = timeObj;
        return rideObj;
      });
    })
    .catch(err => console.error(err));
  },


  returnAveragesForDay: (ride, dayOfWeek) => {
    // convert stored time string to hour and minute with
    // moment(hour, 'h:mm a').hours() / .minutes()

    // Normalizes times to quarter-hours (13:00, 13:15, 13:30, etc.)
    const toQuarterHour = (hourStr) => {
      const time = moment(hourStr, 'h:mm a');
      return `${time.hour()}:${Math.floor(time.minute() / 15) * 15}`;
    }
    // get all the data points for the selected ride and day
    return returnDayOfWeekData(ride, dayOfWeek)
      .then(modelArray => {
        console.log(modelArray)
        return modelArray.map(m => m.pick(['hour', 'waitTime']));
      })
      .then(waitTimes => {
        // group all wait times for the same quarter hour in a histogram
        return waitTimes.reduce((acc, {hour, waitTime}) => {
          const curr = acc[toQuarterHour(hour)];
          if (curr) curr.push(waitTime);
          else acc[toQuarterHour(hour)] = [waitTime];
          return acc;
        }, {})
      })
      .then(obj => {
        // average the times in the histogram
        for (let k in obj) {
          const nums = obj[k];
          obj[k] = nums.reduce((acc, n) => acc + n) / nums.length;
        }
        // return an object of averages
        return obj;
      })

  },

  optimizeSchedule: (rideIdList, startTime = moment().format('LT')) => {
    return helpers.returnWaitTimes(rideIdList)
      .then(rideInfoList => {
        return util.optimize(rideInfoList, startTime);
      })
  },

  /*======================================
    ======     SCHEDULED JOB HELPERS  ====
    The functions below are called by Cron jobs to populate databases/
    ====================================== */


  getWaitTimes : () => {
    // Called every 15 minutes by Cron job to fetch the wait times for every ride provided
    // by the Themeparks API. Use UTIL functions to minimize debugging headache.
    // NOTE: uncaughtException is a way to gracefully handle a function failure so that the server
    // doesn't crash if one of the 1786 park wait times isn't returned.
    util.gatherParks()
      .then(parks => {
        parks.forEach(park => {
          util.gatherWeather(park.attributes.location)
            .then(weather => {
              util.gatherWaitTimes(park.attributes.apiParkName)
              .then(waitTimes => {
                waitTimes.forEach(waitTimeObj => {
                  util.gatherRide(waitTimeObj.id)
                    .then(ride => {
                      helpers.createNewWaitEntry(ride, waitTimeObj, weather);
                    })
                    .catch(err => {
                      process.on('uncaughtException', function (err) {
                        console.log(err);
                      });
                    });
                });
              })
              .catch(err => {
                process.on('uncaughtException', function (err) {
                  console.log(err);
                });
              });
            })
            .catch(err => {
              process.on('uncaughtException', function (err) {
                console.log(err);
              });
            });
        });
      })
      .catch(err => {
        process.on('uncaughtException', function (err) {
          console.log(err);
        });
      });
  },

  createNewWaitEntry : (rideModel, waitTimeObj, weatherModel) => {
    /*
    Need to debug the commented code to correctly fetch the most recent weather data
    at each location each time a new wait time is entered into the database. Works otherwise and
    not necessary unless you want to expand optimization algorithm to include weather data...MACHINE LEARNING!!!
    */
        // Park.where({'id' : rideModel.parkId}).fetch()
        //   .then(parkModel => {
        //     Weather.where({'location' : parkModel.attributes.location}).fetch()
        //     .then(model => {
        //       console.log(model);
              return new RideWaitTime({
                rideId: rideModel.attributes.id,
                waitTime: waitTimeObj.waitTime,
                status: waitTimeObj.status,
                isActive: waitTimeObj.active,
                temp: /*JSON.parse(model.attributes.weatherObj).temperature ||*/ null,
                precip: /*JSON.parse(model.attributes.weatherObj).precipIntensity ||*/ null,
                date: moment(waitTimeObj.lastUpdate).format('L'),
                hour: moment(waitTimeObj.lastUpdate).format('LT'),
             }).save();
          //   .catch(err => console.log(err));
          // })
          // .catch(err => console.log(err));
  },

  getCurrentWeather: () => {
    // Run every 2 hours to update weather table. Constant updating is used to avoid API daily call limits.
    let data = require('../data/parkLocations.json');

    data.forEach(loc => {
      let long = loc.location.longitude;
      let lat = loc.location.latitude;
      request(`https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${lat},${long}`, (err, res, body) => {
        if (err) {
          console.error(err);
        } else {
          let currentWeather = JSON.parse(body).currently;
          util.gatherWeather({latitude: lat, longitude: long}).then( weather => {
            if (weather) {
              console.log('Model at location exists. Overwriting...');
              weather.attributes.weatherObj = JSON.stringify({precipIntensity: currentWeather.precipIntensity, temperature: currentWeather.temperature});
              weather.save();
            } else {
              console.log('Model at location does not exists. Creating new model.');
              helpers.createWeatherEntry({latitude: lat, longitude: long}, {precipIntensity: currentWeather.precipIntensity, temperature: currentWeather.temperature});
            }
          });
        }
      });
    });
  },

  createWeatherEntry: (loc, weatherObj) => {
    return new Weather({
      location : JSON.stringify(loc),
      weatherObj : JSON.stringify(weatherObj)
    }).save()
    .then( weatherEntry => {
    })
    .catch( err => {
      console.error(err);
    });
  },

  /*======================================
    ======     POPULATION HELPERS    =====
    The functions below serve only to populate
    the "rides" and "parks" tables for future use.
    Do not call these functions once the tables
    have been created as they do not check if the
    model already exists and will duplicate entries,
    doubling the run time of functions that iterate
    through each park or ride.
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
              })
              .then(() => {
                console.log('in the .then');
              })
              .catch(() => {
                console.log('in the .catch')
              })
              ;
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
      helpers.createNewPark(parkObj);
    });
  },

  createNewPark: parkObj => {
    helpers.checkIfParkExists(parkObj)
      .then(exists => {
        if(!exists) {
          return new Park({
          parkName : parkObj.parkName,
          apiParkName : parkObj.apiParkName,
          location : parkObj.location,
          hasFastPass : parkObj.fastPass,
        }).save()
          .then( themepark => {
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




  addRideDescriptions: () => {
    console.log('ADDING RIDE DESCRIPTIONS');
    Ride.fetchAll()
      .then(rides => {
        rides.forEach(ride => {
          var options = {
            url: `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=explaintext&titles=${ride.attributes.rideName}&redirects=1`,
            port: 3000,
            json: true
          };
          request(options, (err, res, body) => {
            if (body !== undefined && body.query !== undefined) {
              for (let key in body.query.pages) {
                let pageid = key;
              }
              let description = body.query.pages[pageid].extract;
              if (description !== null && description !== undefined) {
                description = description.replace(/<{1}[^<>]{1,}>{1}/g,"");
                ride.attributes.description = description;
                ride.save();
              } else {
                ride.attributes.description = 'No Description!';
                ride.save();
              }
            } else {
              ride.attributes.description = 'No Description!';
              ride.save();
            }
          });
        });
      });
  }
};

module.exports = helpers;
