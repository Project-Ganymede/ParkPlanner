findRoute: (waitTimes, ridesLeft, currentMoment, possibilities, route = [], totalWait = 0) {
  ridesLeft = ridesLeft.slice();
  route = route.slice();
  const id = waitTimes.rideData.get('id')

  // find waitTime closes to currentMoment
  const waitTime = _.reduce(waitTimes.timeData, (result, value, key) => {
    const diffFromCurrent = Math.abs(moment(key, 'hh:mm a') - currentMoment);
    if (diffFromCurrent < result.diffFromCurrent) {
      return { diffFromCurrent, minutes: value }
    }
    return result;
  }, { diffFromCurrent: Infinity });

  // set object props, new currTime, totalWait
  const ride = {
    id,
    waitTime,
    rideTime: currentMoment.format('hh:mm a')
    // rideName:
  };

  // update trackers
  currentMoment = currentMoment.add(waitTime.minutes + 15, 'm');
  totalWait += waitTime.minutes;
  route.push(ride);
  _.remove(ridesLeft, r => r === waitTimes);

  if (ridesLeft.keys.length) {
    ridesLeft.forEach(ride => {
      findRoute(ride, ridesLeft, currentMoment, possibilities, route, totalWait);
    })
  } else {
    possibilities.push({ route, totalWait });
  }
}
