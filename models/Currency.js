const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  date: Date,
  rate: Object
},  {
  timestamps: true
 });

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
