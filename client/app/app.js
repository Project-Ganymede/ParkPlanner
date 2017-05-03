angular
  .module('app', [
      'app.parks',
      'app.rides',
      'app.services',
      'ngRoute',
      'chart.js'
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
      .when('/rideslist', {
        templateUrl: 'app/rides/rides-list-details.html',
        controller: 'RidesController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
