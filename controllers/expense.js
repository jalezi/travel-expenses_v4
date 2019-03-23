const moment = require('moment');

exports.postNewExpense = async function  (req, res, next) {
  req.assert('expenseDescription', 'Description is empty or to long (max 60 characters)!').isLength({min: 1, max: 60});
  // let dateCompare = moment(res.locals.travel.dateFrom).add(-1, 'days').format('YYYY-MM-DD');
  // req.assert('invoiceDate', 'Invoice date should be within travel dates').isAfter(dateCompare);
  // dateCompare = moment(res.locals.travel.dateTo).add(1, 'days').format('YYYY-MM-DD');
  // req.assert('invoiceDate', 'Invoice date should be within travel dates').isBefore(dateCompare);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect(`/travels/${req.params.id}`);
  }

  res.redirect(`/travels/${req.params.id}`);
}
