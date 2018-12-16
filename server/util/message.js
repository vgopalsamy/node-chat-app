var moment = require("moment");

var generateMessge = (from, text) => {

  var createAt = moment.valueOf();
  //console.log(createAt);

  return {
    from,
    text,
    createAt
  };
};

module.exports = {generateMessge};
