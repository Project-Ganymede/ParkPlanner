angular.module("app.leo", ["chart.js"]).controller("LeosController", function ($scope, $routeParams, Rides) {

  const timeStrToNum = (str) => {
    const time = new Date('1970/01/01 ' + str)
    return time.getHours() + (time.getMinutes() / 60);
  };
  const timeStrCompFunc = (a, b) => {
    return new Date('1970/01/01 ' + a[0]) - new Date('1970/01/01 ' + b[0]);
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  $scope.rideId = $routeParams.id;
  $scope.day = $routeParams.day;

  // copied over from rides.js
  $scope.getRideQueueAndParkId = function() {
    var data = Rides.getRideQueueAndParkId();
    $scope.rideQueue = data.rideQueue;
  };

  $scope.getDayAverages = function (rideId, day) {
    // make a GET request to get the data for the ride on a particular day of the week
    Rides.getDayTimes(rideId, day)
      .then(dataObj => {
        const arr = [];
        for (let k in dataObj) {
          const timeNum = timeStrToNum(k);
          if (timeNum >= 9) arr.push({x: timeNum, y: dataObj[k]});
        }
        arr.sort((a,b) => a.x - b.x);
        $scope.data[1] = arr;
      })
  };

  $scope.getOverallAverages = function (rideId) {
    // use Rides.getTimes to get the overall averages
    Rides.getTimes([rideId])
      .then(result => {
        $scope.rideData = result[0].rideData;
        Rides.setRideName($scope.rideData.rideName);
        console.log($scope.rideData);
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
          const timeNum = timeStrToNum(datum[0]);
          if (timeNum >= 9) $scope.data[0].push({x: timeNum, y: datum[1]});
        });
        console.log(data)
      })
  };
  $scope.getOverallAverages($routeParams.id);
  $scope.getDayAverages($routeParams.id, $routeParams.day);


  console.log('Ride name', Rides.getRideName())
  $scope.rideName = Rides.getRideName();

  $scope.labels = ["Wait Times (Minutes)", "Time of Day"];
  $scope.data = [ [], [] ];

  $scope.series = [
    'Overall Average',
    dayNames[$scope.day] + ' Average'
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
    legend: {
      display: true,
      labels: {
        fontColor: 'black',
      }
    },
    scales: {
      xAxes: [
        {
          type: 'linear',
          position: 'bottom',
          ticks: {
            min: 9,
            max: 24,
            stepSize: 1
          },
          scaleLabel: {
            display: true,
            labelString: "Time of Day"
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
          },
          scaleLabel: {
            display: true,
            labelString: "Wait Time"
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