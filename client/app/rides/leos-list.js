angular.module("app.leo", ["chart.js"]).controller("LeosController", function ($scope, $routeParams, Rides) {

  const timeStrToNum = (str) => {
    const time = new Date('1970/01/01 ' + str)
    return time.getHours() + (time.getMinutes() / 60);
  };
  const timeStrCompFunc = (a, b) => {
    return new Date('1970/01/01 ' + a[0]) - new Date('1970/01/01 ' + b[0]);
  }

  $scope.rideId = $routeParams.id;

  $scope.getDayAverages = function (rideId, day) {
    // make a GET request to get the data for the ride on a particular day of the week
    Rides.getDayTimes(rideId, day)
      .then(dataObj => {
        const arr = [];
        for (let k in dataObj) {
          const timeInt = timeStrToNum(k);
          arr.push({x: timeInt, y: dataObj[k]});
        }
        arr.sort((a,b) => a.x - b.x);
        $scope.data[1] = arr;
      })
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
        timeData.sort(timeStrCompFunc);
        return timeData;
      })
      .then(data => {
        data.forEach(datum => {
          const timeInt = timeStrToNum(datum[0]);
          $scope.data[0].push({x: timeInt, y: datum[1]});
        });
        console.log(data)
      })
  };
  $scope.getOverallAverages($routeParams.id);
  $scope.getDayAverages($routeParams.id, $routeParams.day);

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
      fill: false,
      borderColor: 'black',
      pointBackgroundColor: 'black',
    }, {
      yAxisID: 'y-axis-1',
      fill: false,
      borderColor: 'red',
      pointBackgroundColor: 'red',
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