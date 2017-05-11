angular.module("app.rides", ["chart.js"]).controller("LeosController", function ($scope) {
  $scope.labels = ["12:00", "13:00", "14:00", "15:00"];

  $scope.series = [
    'Series 1',
    'Series 2'
  ]

  $scope.data = [
    [4, 10, 13, 8],
    [2, 20, 14, 4]
  ];

  $scope.onClick = (points, evt) => {
    console.log(points, evt);
  }

  $scope.datasetOverride = [ 
    { yAxisID: 'y-axis-1'},
    { yAxisID: 'y-axis-2'}
  ];
  
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            max: 20,
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
            max: 20,
            min: 0,
            stepSize: 5
          }
        }
      ]
    }
  }

})