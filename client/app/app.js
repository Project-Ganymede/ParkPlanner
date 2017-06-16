angular
  .module('app', [
      'app.parks',
      'app.rides',
      'app.dayview',
      'app.schedule',
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
      .when('/park/:id', {
        templateUrl: 'app/rides/rides.html',
        controller: 'RidesController'
      })
      .when('/rideslist/:id', {
        templateUrl: 'app/rides/rides-list-details.html',
        controller: 'RidesController'
      })
      .when('/dayview/:id/:day', {
        templateUrl: 'app/rides/day-view.html',
        controller: 'DayViewController'
      })
      .when('/schedule/:id', {
        templateUrl: 'app/schedule/schedule.html',
        controller: 'ScheduleController'
      })
      .otherwise({
        redirectTo: '/'
      })
  });
