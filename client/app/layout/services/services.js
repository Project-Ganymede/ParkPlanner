angular.module('app.services', [])

.factory('Parks', function ($http) {

  var getAll = function () {
    return $http({
      method: 'GET',
      url: 'str'//TO DO
    }).then(function (resp) {
      return resp.data;
    });
  };

  return {
    getAll: getAll
  };
})
