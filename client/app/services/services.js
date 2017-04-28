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
.factory('Rides', function ($http) {
  var getParkRides = function () {
    return [
    { 
      id: 1,
      api_code: 'WaltDisneyWorldEpcot_80010199',
      name: 'Test Track',
      park_id: 1,
      image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/SplashMountain%282%29.JPG/250px-SplashMountain%282%29.JPG',
      fast_pass: true,
      active: true,
      status: 'Operating',
      opening_time: '2017-04-27T09:00:00-04:00',
      closing_time: '2017-04-27T21:00:00-04:00'
    }, 
    { 
      id: 2,
      api_code: 'WaltDisneyWorldEpcot_80010199',
      name: 'Test Track',
      park_id: 1,
      image: 'http://www.tokyodisneyresort.jp/images/adventure/attraction/11_main_visual_name_3.jpg?mod=20170119123148',
      fast_pass: true,
      active: true,
      status: 'Operating',
      opening_time: '2017-04-27T10:00:00-04:00',
      closing_time: '2017-04-27T21:00:00-04:00'
    }, 
    { 
      id: 3,
      api_code: 'WaltDisneyWorldEpcot_80010199',
      name: 'Test Track',
      park_id: 1,
      image: 'https://secure.parksandresorts.wdpromedia.com/resize/mwImage/1/640/360/90/wdpromedia.disney.go.com/media/wdpro-assets/dlr/gallery/attractions/disneyland/haunted-mansion/haunted-mansion-gallery00.jpg?25042014071625',
      fast_pass: true,
      active: false,
      status: 'Operating',
      opening_time: '2017-04-27T11:00:00-04:00',
      closing_time: '2017-04-27T21:00:00-04:00'
    }, 
    { 
      id: 4,
      api_code: 'WaltDisneyWorldEpcot_80010199',
      name: 'Test Track',
      park_id: 1,
      image: 'http://www.dadlogic.net/wp-content/uploads/2012/01/mthr123234SMALL.jpg',
      fast_pass: true,
      active: true,
      status: 'Operating',
      opening_time: '2017-04-27T12:00:00-04:00',
      closing_time: '2017-04-27T21:00:00-04:00'
    }, 
    { 
      id: 5,
      api_code: 'WaltDisneyWorldEpcot_80010199',
      name: 'Test Track',
      park_id: 1,
      image: 'https://secure.parksandresorts.wdpromedia.com/resize/mwImage/1/630/354/75/wdpromedia.disney.go.com/media/wdpro-assets/dlr/parks-and-tickets/attractions/disneyland/indiana-jones-adventure/indiana-jones-adventure-00.jpg?30042013105326',
      fast_pass: true,
      active: true,
      status: 'Operating',
      opening_time: '2017-04-27T13:00:00-04:00',
      closing_time: '2017-04-27T21:00:00-04:00'
    }];
  };
  return {
    getParkRides: getParkRides
  };
});
