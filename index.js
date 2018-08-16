const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const temperaturesRouter = require('./controllers/temperatures')
const config = require('./utils/config')
const moment = require('moment')
const Temperature = require('./models/temperature')
//const tempValue = require('rpi-temperature')

mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true })
  .then( () => {
    console.log('Connected to MongoDB database: ', config.mongoUrl)
  })
  .catch( error => {
    console.log(error)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.logger)

app.use('/api/temperature', temperaturesRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

formatDate = (date) => {
  const day = date.date().toString()
  let month = (date.month()+1).toString()
  const year = date.year().toString()

  if (month < 10) {
    month = '0' + month
  }

  return day + month + year
}

formatTime = (time) => {
  let hours = time.hours().toString()
  let minutes = time.minutes().toString()

  if ( hours < 10) {
    hours = '0' + hours
  }

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  return parseFloat(hours + '.' + minutes)
}

fetchTemperature = async () => {
  const newValue = 25.0
  const newTime = formatTime(moment())

  const temp = await Temperature
    .find({ date: formatDate(moment()) })

  console.log(temp)

  if (typeof temp[0] === 'undefined') {
    const newTemp = new Temperature({
      date: formatDate(moment()),
      temperatures: [ {x: newTime, y: newValue }]
    })

    const savedTemp = await newTemp.save()
    console.log(savedTemp)
  } else {
    const temperatures = temp[0].temperatures
    const id = temp[0]._id
  
    await Temperature
      .findByIdAndUpdate({ _id: id }, {temperatures: temperatures.concat([{ x: newTime, y: newValue }])})
    const result = await Temperature.findById(id)
    console.log(result)
  }
}

setInterval(function(){fetchTemperature()}, 60*60*1000)

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}