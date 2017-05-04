angular.module('app.services', [])

.factory('Parks', function ($http) {

  var getParks = function () {
    return $http({
      method: 'GET',
      url: '/parks'
    }).then(function (resp) {
      console.log(resp.data);
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
      data: { parkId: parkID }
    }).then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };
  return {
    getParkRides: getParkRides
  };
});
