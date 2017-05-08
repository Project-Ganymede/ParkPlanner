angular.module('app.parks', [])

.controller('ParksController', function ($scope, Parks) {

  $scope.data = {};

  var initializeParks = function () {
    Parks.getParks()
      .then(function (parks) {
        $scope.data.parks = parks;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  initializeParks();
});
