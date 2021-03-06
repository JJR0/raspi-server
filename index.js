const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const moment = require('moment')

const middleware = require('./utils/middleware')
const { temperaturesRouter, freq } = require('./controllers/temperatures')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const Temperature = require('./models/temperature')

// For production
// const tempValue = require('rpi-temperature')

const app = express()

moment.locale('fi')

require('dotenv').config()

// For production
//  mongoose
//    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
//    .then(() => {
//      console.log('Connected to MongoDB database: ', process.env.MONGOBB_URI)
//    })
//    .catch((error) => {
//      console.log(error)
//    })

// For development
mongoose
  .connect(process.env.MONGODB_URI_DEV, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB database: ', process.env.MONGOBB_URI_DEV)
  })
  .catch((error) => {
    console.log(error)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)

app.use('/api/temperature', temperaturesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.error)

const server = http.createServer(app)

// For production
// const PORT = 5000
// server.listen(PORT, () => {
//   console.log('Server running on port: ', PORT)
// })

// For development
const PORT_DEV = 5001
server.listen(PORT_DEV, () => {
  console.log('Server running on port: ', PORT_DEV)
})

const fetchTemperature = async () => {
  // For production
  // const newValue = tempValue.getTemperature()

  // For development
  const newValue = 25

  const newTime = moment().format('HH.mm')

  const temp = await Temperature
    .find({ date: moment().format('DDMMYYYY') })

  if (typeof temp[0] === 'undefined') {
    const newTemp = new Temperature({
      date: moment().format('DDMMYYYY'),
      temperatures: [{ x: newTime, y: newValue }],
    })

    await newTemp.save()
  } else {
    const temperatures = temp[0].temperatures
    const id = temp[0]._id

    await Temperature
      .findByIdAndUpdate(
        { _id: id },
        { temperatures: temperatures.concat([{ x: newTime, y: newValue }]) },
      )
    await Temperature.findById(id)
  }
}

fetchTemperature()
setInterval(() => fetchTemperature(), freq)

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server,
}
