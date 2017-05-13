angular.module('app.services', [])

.factory('Parks', function ($http) {

  var getParks = function () {
    return $http({
      method: 'GET',
      url: '/parks'
    }).then(function (resp) {
      return resp.data;
    });
  };

  return {
    getParks: getParks
  };
})
.factory('Rides', function ($http) {

  var getParkRides = function (parkID) {
    return $http({
      method: 'GET',
      url: '/rides',
      headers: {
        'parkId': parkID
      },
    }).then(function (resp) {
      return resp.data;
    })
    .catch(function (err) {
      console.error(err);
    });
  };

  var rideQueue;
  var parkId;

  var setRideQueueAndParkId = function (rides, park) {
    rideQueue = rides;
    parkId = park;
  };

  let rideName;
  const setRideName = (name) => {
    rideName = name;
  }
  const getRideName = () => {
    return rideName;
  }

  var getTimes = function (ridesArr) {
    return $http({
      method: 'GET',
      url: 'rideList',
      headers: {
        'rides': JSON.stringify(ridesArr)
      }
    }).then(function (resp) {
      return resp.data;
    });
  };

  const getDayTimes = (rideId, day) => {
    return $http({
      method: 'GET',
      url: `daydata/${rideId}/${day}`,
    }).then(resp => {
      return resp.data;
    });
  };

  var getOptimizedSched = function (ridesArr) {
    return $http({
      method: 'GET',
      url: 'optimize',
      headers: {
        'rides': JSON.stringify(ridesArr)
      }
    }).then(function(resp) {
      return resp.data;
    });
  };

  var getRideQueueAndParkId = function() {
    return {rideQueue: rideQueue, parkId: parkId};
  };

  return {
    getParkRides: getParkRides,
    setRideQueueAndParkId: setRideQueueAndParkId,
    getRideQueueAndParkId: getRideQueueAndParkId,
    getTimes: getTimes,
    getDayTimes,
    setRideName,
    getRideName,
    getOptimizedSched: getOptimizedSched
  };
});
