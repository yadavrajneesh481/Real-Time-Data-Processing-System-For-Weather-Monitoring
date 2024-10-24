const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true } ,
  date: { type: Date, required: true },
  avg_temperature: { type: Number, required: true },
  max_temperature: { type: Number, required: true },
  min_temperature: { type: Number, required: true },
  dominant_condition: { type: String, required: true },
  reason_for_condition: { type: String, required: true },
  raw_data_count: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  
});

weatherSchema.index({ date: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('WeatherSummary', weatherSchema);
