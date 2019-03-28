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

const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;
