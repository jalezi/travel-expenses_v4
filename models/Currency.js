const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rate: {
    type: mongoose.Decimal128,
    default: 1
  }
},  {
  useNestedStrict: true,
  timestamps: true
 });

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
