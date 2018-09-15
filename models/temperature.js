const mongoose = require('mongoose')

const tempSchema = new mongoose.Schema({
  date: String,
  temperatures: Array,
  outside_temp: Array,
  livingroom_temp: Array,
})

tempSchema.statics.format = (temperature) => {
  return {
    id: temperature._id,
    date: temperature.date,
    temperatures: temperature.temperatures,
    outside_temp: temperature.outside_temp || null,
    livingroom_temp: temperature.livingroom_temp || null,
  }
}

const Temperature = mongoose.model('Temperature', tempSchema)

module.exports = Temperature
