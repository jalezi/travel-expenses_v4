const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
  success: Boolean,
  timestamp: Number,
  base: String,
  date: Date,
  rates: Object
},
  {timestamps: true}
 );

RateSchema.statics.findRatesOnDate = function (travel, callback) {
  return this.find({ $and: [ { date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateTo } } ] },  (err, rates) => {

  }).select({'rates': 1, 'date': 1, '_id': 0},);

}

RateSchema.statics.findRateBeforeOrAfterDate = function (travel, callback) {
  return this.find({$or: [ { date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateFrom } } ]}, (err, rates) => {

  })
  .sort({"date":1})
  .limit(1)
  .select({'rates': 1, 'date': 1, '_id': 0},);
}

const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;
