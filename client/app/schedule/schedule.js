angular.module('app.schedule', [])
  .controller('ScheduleController', function($scope, $routeParams, $location, Rides, Parks) {

    var ridesAndPark = Rides.getRideQueueAndParkId()
    $scope.parkId = $routeParams.id;
    var data = Rides.getRideQueueAndParkId();
    console.log('DATA: ', data);
    if (data.rideQueue) {
      $scope.header = 'Optimizing your schedule... Please Wait...';
      Rides.getOptimizedSched(data.rideQueue.map(ride => ride.id))
        .then(function(sched) {
          $scope.optimizedRoute = sched.route;
          $scope.header = 'Your optimized schedule:'
          $scope.totalWait = `Total time spent in line: ${Math.round(sched.totalWait)} minutes`;
        });
    } else {
      $scope.header = 'Please select new rides';
    }

});
