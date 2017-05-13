angular.module('app.schedule', [])
  .controller('ScheduleController', function($scope, $routeParams, $location, Rides, Parks) {

    $scope.parkId = $routeParams.id;
    var data = Rides.getRideQueueAndParkId();
    // if (data.rideQueue !== undefined) {let rideArr = data.rideQueue.map(ride => ride.id);}
    console.log('DATA: ', data);
    if (data.rideQueue) {
      Rides.getOptimizedSched(data.rideQueue.map(ride => ride.id))
        .then(function(sched) {
          $scope.optimizedSched = sched;
        });
    } else {
      $scope.optimizedSched = 'Please select new rides';
    }

});