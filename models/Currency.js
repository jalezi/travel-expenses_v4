const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    default: 1
  }
},  {
  useNestedStrict: true,
  timestamps: true
 });

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
