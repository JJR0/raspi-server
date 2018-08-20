const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const moment = require('moment')

const middleware = require('./utils/middleware')
const temperaturesRouter = require('./controllers/temperatures')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
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
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

fetchTemperature = async () => {
  const newValue = 25.0
  const newTime = moment().format('hh.mm')

  const temp = await Temperature
    .find({ date: moment().format('DDMMYYYY') })

  // console.log(temp)

  if (typeof temp[0] === 'undefined') {
    const newTemp = new Temperature({
      date: moment().format('DDMMYYYY'),
      temperatures: [ {x: newTime, y: newValue }]
    })

    const savedTemp = await newTemp.save()
    // console.log(savedTemp)
  } else {
    const temperatures = temp[0].temperatures
    const id = temp[0]._id
  
    await Temperature
      .findByIdAndUpdate({ _id: id }, {temperatures: temperatures.concat([{ x: newTime, y: newValue }])})
    const result = await Temperature.findById(id)
    // console.log(result)
  }
}

setInterval(() => fetchTemperature(), 60*60*1000)

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}