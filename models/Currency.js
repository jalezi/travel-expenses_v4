const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  base: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  rate: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
