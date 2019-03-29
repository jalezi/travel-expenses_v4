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

RateSchema.statics.findRatesOnDate = async function (travel, callback) {

  return this.find({ $and: [ { date: { $gte: travel.dateFrom } }, { date: { $lte: travel.dateTo } } ] }, (err, rates) => {
    if (rates.length === 0) {
      rates.push(0);
      console.log(rates);
    }
  }).select({'rates': 1, 'date': 1, '_id': 0},);
}

const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;
