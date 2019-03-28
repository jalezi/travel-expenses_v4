const moment = require('moment');

module.exports = (dayStart, dayEnd) => {
  const dayS = dayStart;
  let date = {};
  for (let d = dayS; d <= dayEnd; d.add(1, 'days')) {
    date[`${d.format('YYYY-MM-DD')}`] = [];
  }
  return date;
}
