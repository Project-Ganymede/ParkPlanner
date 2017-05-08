var Themeparks = require('themeparks');

var arr = [];
for( var park in Themeparks.Parks) {
  let Park = new Themeparks.Parks[park]();
  console.log(Park.Name);
  console.log(Park.Location.toString());
  console.log(Park.FastPass);
  console.log(Park.toString());

};
