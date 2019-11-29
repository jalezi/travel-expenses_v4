/*
 * Constants Object
 * Convert miles to kilometers
 * Convert kilometers to miles
 * Header in travels.csv
 * Header in expenses.csv
 */

module.exports = Object.freeze({
  MILES_TO_KILOMETERS: 1.609344,
  KILOMETERS_TO_MILES: 0.621371,
  IMPORT_TRAVEL_HEADER: [
    'dateFrom',
    'dateTo',
    'description',
    'homeCurrency',
    'perMileAmount',
    'total'],
  IMPORT_EXPENSE_HEADER: [ 'type',
    'description',
    'date',
    'amount',
    'currency',
    'rate',
    'amountConverted',
    'unit',
    'travelName',
    'base'
  ]
});
