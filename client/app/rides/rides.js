angular.module('app.rides', [])

.controller('RidesController', function ($scope, $routeParams, Rides) {
  Rides.getParkRides($routeParams.id).then(function(data) {
    $scope.rides = data;
  })
  console.log('little string', $scope.rides);
  $scope.rideList = [];
  $scope.addRideToList = function (ride) {
    $scope.rideList.push(ride);
  };
  $scope.removeRideFromList = function (indexToRemove) {
    $scope.rideList.splice(indexToRemove,1);
  };

  //THE FOLLOWING CODE IS TO INITIALIZE RIDES AND PLOT
  //DATA FOR THE PURPOSE OF TESTING THE RIDES-LIST-VIEW
  $scope.rideQueue = $scope.rides;
  $scope.data = [10, 20, 10, 20, 10, 20, 10];
  $scope.labels = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];
  for (var i = 0; i < $scope.rideList.length; i++) {
    $scope.rideList[i].data = [65, 59, 80, 81, 56, 55, 40];
  }
});
