var generateMessge = (from, text) => {

  var createAt = new Date().getTime();
  console.log(createAt);

  return {
    from,
    text,
    createAt
  };
};

module.exports = {generateMessge};
