const Rate = require('../models/Rate');

module.exports = async (date = new Date()) => {
  try {
    const exactDate = await Rate.find({date: date}, (err, items) => {
      return items;
    });
    if (exactDate.length === 1) {
      console.log('Find exact date');
      return exactDate[0];
    }

    const greaterDate = await Rate.findOne({date: {$gt: date}}, (err, item) => {
      return item;
    }).sort({date: 1})

    const lowerDate = await Rate.findOne({date: {$lt: date}}, (err, item) => {
      return item;
    }).sort({date: -1})

    if (greaterDate && lowerDate) {
      const diffGreater = Math.abs(date.getTime() - greaterDate.date.getTime());
      const diffLower = Math.abs(date.getTime() - lowerDate.date.getTime());

      if (diffGreater < diffLower) {
        console.log('greaterDate');
        return greaterDate;
      } else {
        console.log('lowerDate');
        return lowerDate;
      }
    } else if (!greaterDate && !lowerDate) {
      return 'FUCK!';
    } else if (greaterDate) {
      return greaterDate;
    } else if (lowerDate) {
      return lowerDate;
    } else {
      return 'FUCK AGAIN!';
    }
  } catch (err) {

  } finally {

  }

}
