const mongoose = require('mongoose')

const tempSchema = new mongoose.Schema({
  date: String,
  temperatures: Array,
})

tempSchema.statics.format = (temperature) => {
  return {
    id: temperature._id,
    date: temperature.date,
    temperatures: temperature.temperatures,
  }
}

const Temperature = mongoose.model('Temperature', tempSchema)

module.exports = Temperature
