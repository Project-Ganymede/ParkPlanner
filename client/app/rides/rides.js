angular.module('app.rides', [])

.controller('RidesController', function ($scope, $routeParams, $location, Rides) {
  $scope.showDescription = false;

  $scope.rideList = [];

  $scope.addRideToList = function (ride) {

    $scope.rideList.push(ride);
    console.log('ridelist',$scope.rideList);
  };

  $scope.removeRideFromList = function (indexToRemove) {
    $scope.rideList.splice(indexToRemove,1);
  };

  $scope.setRideQueueAndParkIdAndChangePage = function() {
    Rides.setRideQueueAndParkId($scope.rideList, $routeParams.id);
    $location.path(`/rideslist/${$routeParams.id}`);
  };

  $scope.getRideQueueAndParkId = function() {
    var data = Rides.getRideQueueAndParkId();
    $scope.rideQueue = data.rideQueue;
  };

  $scope.parkId = $routeParams.id;

  $scope.getRideQueueAndParkId();

  Rides.getParkRides($routeParams.id)
    .then(function(data) {
      let temp = data.map(rideObj => {
        if(rideObj.rideName.length > 35) {
          rideObj['displayName'] = rideObj.rideName.slice(0,35) + '...';
          return rideObj;
        } else {
          rideObj['displayName'] = rideObj.rideName;
          return rideObj;
        }
      });
      console.log(temp);
      $scope.rides = temp;
    });

  //THE FOLLOWING CODE IS TO INITIALIZE RIDES AND PLOT
  //DATA FOR THE PURPOSE OF TESTING THE RIDES-LIST-VIEW
  // $scope.rideQueue = [{name: 'Space Mountain', image: 'https://secure.parksandresorts.wdpromedia.com/resize/mwImage/1/630/354/75/wdpromedia.disney.go.com/media/wdpro-assets/parks-and-tickets/attractions/magic-kingdom/space-mountain/space-mountain-00.jpg?18072014133917'}, {name: 'Thunder Mountain Railroad', image: 'https://secure.parksandresorts.wdpromedia.com/resize/mwImage/1/630/354/75/wdpromedia.disney.go.com/media/wdpro-assets/parks-and-tickets/attractions/magic-kingdom/big-thunder-mountain-railroad/big-thunder-mountain-railroad-00.jpg?17072014165020'}];
  // $scope.data = [10, 20, 10, 20, 10, 20, 10];
  $scope.labels = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];

  $scope.getTimes = function (ridesArr) {
    Rides.getTimes(ridesArr)
      .then(function(data) {
        for (var i = 0; i < $scope.rideQueue.length; i++) {
          $scope.rideQueue[i].data = data[i].timeData;
        }
        console.log('RUNNING GET TIMES, FOLLOWING IS THE DATA');
        console.log(data);
      });
  };

  if ($scope.rideQueue) {
    $scope.getTimes($scope.rideQueue.map(function(val) {
      return val.id;
    }));
  }

  $scope.options = {
    scales: {
      yAxes: [{
        position: 'right',
        scaleLabel: {
          display: true,
          labelString: 'Minutes!',
        }
      }]
    }
  };
  $scope.colors = ['white'];
  console.log(Rides);
  console.log('ridequeue',$scope.rideQueue);
});
