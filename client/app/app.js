angular
  .module('app', [
      'app.parks',
      'app.rides',
      'app.services',
      'ngRoute'
    ]
  )
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/parks/parks.html',
        controller: 'ParksController'
      })
      .when('/rides', {
        templateUrl: 'app/rides/rides.html',
        controller: 'RidesController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });