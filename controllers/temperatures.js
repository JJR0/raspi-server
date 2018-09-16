const temperaturesRouter = require('express').Router()
const Temperature = require('../models/temperature')
const moment = require('moment')

moment.locale('fi')

// For production
 const tempValue = require('rpi-temperature')

let freq = 1800000

// Hakee kaiken datan
temperaturesRouter.get('/', async (request, response) => {
  try {
    const temperatures = await Temperature
      .find({})

    response.json(temperatures.map(Temperature.format))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

// Hakee tämän hetken sisälämpötilan
temperaturesRouter.get('/now', async (request, response) => {
  try {
    // For production
    response.json(tempValue.getTemperature())
    console.log('Tämän hetken lämpötila: ', tempValue.getTemperature())

    // For development
    // response.json(25)

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

temperaturesRouter.get('/:date', async (request, response) => {
  try {
    const temp = await Temperature
      .find({ date: request.params.date })

    if (typeof temp[0] === 'undefined') {
      response.status(404).json({ error: 'temperature data not found on that date' })
    } else {
      response.json(temp)
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

temperaturesRouter.post('/', (request, response) => {
  const updateFreq = request.body

  if (Object.keys(updateFreq).length === 0 && updateFreq.constructor === Object) {
    response.status(400).json({ error: 'content missing' })
  }

  freq = updateFreq
  response.json(freq)
})

temperaturesRouter.post('/olohuone', async (request, response) => {
  try {
    const body = request.body
    console.log('Olohuoneen lämpötila: ', body['olohuone'])

    if (body['olohuone'] === null || body['olohuone'] === undefined) {
      response.status(400).json({ error: 'incorrect body structure in request' })
      return
    }

    const newValue = body['olohuone']
    const newTime = moment().format('HH.mm')

    const temp = await Temperature
      .find({ date: moment().format('DDMMYYYY') })

    if (typeof temp[0] === 'undefined') {
      const newTemp = new Temperature({
        date: moment().format('DDMMYYYY'),
        livingroom_temp: [{ x: newTime, y: newValue }],
      })

      const result = await newTemp.save()
      response.json(result)
    } else {
      const livingroom_temp = temp[0].livingroom_temp
      const id = temp[0]._id

      await Temperature
        .findByIdAndUpdate(
          { _id: id },
          { livingroom_temp: livingroom_temp.concat([{ x: newTime, y: newValue }]) },
        )
      const result = await Temperature.findById(id)
      response.json(result)
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

temperaturesRouter.post('/ulko', async (request, response) => {
  try {
    const body = request.body
    console.log('Ulkolämpötila: ', body['ulko'])

    if (body['ulko'] === null || body['ulko'] === undefined) {
      response.status(400).json({ error: 'incorrect body structure in request' })
      return
    }

    const newValue = body['ulko']
    const newTime = moment().format('HH.mm')

    const temp = await Temperature
      .find({ date: moment().format('DDMMYYYY') })

    if (typeof temp[0] === 'undefined') {
      const newTemp = new Temperature({
        date: moment().format('DDMMYYYY'),
        outside_temp: [{ x: newTime, y: newValue }],
      })

      const result = await newTemp.save()
      response.json(result)
    } else {
      const outside_temp = temp[0].outside_temp
      const id = temp[0]._id

      await Temperature
        .findByIdAndUpdate(
          { _id: id },
          { outside_temp: outside_temp.concat([{ x: newTime, y: newValue }]) },
        )
      const result = await Temperature.findById(id)

      response.json(result)
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = { temperaturesRouter, freq }
