angular.module("app.leo", ["chart.js"]).controller("LeosController", function ($scope, $routeParams, Rides) {

  $scope.getDayAverages = function (rideId, day) {
    // make a GET request to get the data for the ride on a particular day of the week
  };

  $scope.getOverallAverages = function (rideId) {
    // use Rides.getTimes to get the overall averages
    Rides.getTimes([rideId])
      .then(result => {
        return result[0].timeData;
      })
      .then(obj => {
        const result = [];
        for (var key in obj) {
          result.push([key, obj[key]]);
        }
        return result;
      })
      .then(timeData => {
        // Weird sorting function because times are stores as strings.
        // Maybe the server should serve this data as an appropriate datatype?
        timeData.sort((a, b) => {
          return new Date('1970/01/01 ' + a[0]) - new Date('1970/01/01 ' + b[0]);
        })
        return timeData;
      })
      .then(data => {
        data.forEach(datum => {
          const time = new Date('1970/01/01 ' + datum[0])
          const timeInt = time.getHours() + (time.getMinutes() / 60);
          $scope.data[0].push({x: timeInt, y: datum[1]});
        });
        console.log(data)
      })
      // .then(data => {
      //   console.log(data);
      // })
  }
  $scope.getOverallAverages($routeParams.id)

  $scope.labels = [];
  $scope.data = [ [], [] ];

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      $scope.labels.push(`${h}:${m}`)
      $scope.data[0].push(9);
      $scope.data[1].push(3);
    }
  }

  $scope.series = [
    'Overall Average',
    'Day Average'
  ]


  $scope.onClick = (points, evt) => {
    console.log(points, evt);
  }

  $scope.datasetOverride = [
    {
      yAxisID: 'y-axis-1',
      fill: false
    }, {
      yAxisID: 'y-axis-2',
      fill: false,
    }
  ];

  $scope.options = {
    scales: {
      xAxes: [
        {
          type: 'linear',
          position: 'bottom',
          ticks: {
            min: 0,
            max: 24,
            stepSize: 1
          }
        }
      ],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            // max: 20,
            min: 0,
            stepSize: 5
          }
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            // max: 20,
            min: 0,
            stepSize: 5
          }
        }
      ]
    }
  }

})