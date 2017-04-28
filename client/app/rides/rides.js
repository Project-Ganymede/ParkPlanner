angular.module('app.rides', [])

.controller('RidesController', function ($scope, Rides) {
  $scope.rides = Rides.getParkRides();
  $scope.rideList = [];
  $scope.addRideToList = function (ride) {
    $scope.rideList.push(ride);
  };
  $scope.removeRideFromList = function (indexToRemove) {
    $scope.rideList.splice(indexToRemove,1);
  }
});