module.exports = {
  reduceTimeData : modelArray => {
    /* accepts arrays of RideWaitTimes table models */
    return modelArray.reduce((acc, model, index) => {
      if(model.isActive) {
        if(acc[model.hour]) {
          acc[model.hour].push(model.waitTime);
          return acc;
        } else {
          acc[model.hour] = [model.waitTime];
          return acc;
        }
      } else {
        if(acc[model.hour]) {
          acc[model.hour].push(null);
          return acc;
        } else {
          acc[model.hour] = [null];
          return acc;
        }
      }
    }, {});
  },
};
