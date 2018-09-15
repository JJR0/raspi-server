const temperaturesRouter = require('express').Router()
const Temperature = require('../models/temperature')

// For production
// const tempValue = require('rpi-temperature')

// For development
const tempValue = 25
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
    response.json(tempValue.getTemperature())
    console.log('Tämän hetken lämpötila: ', tempValue.getTemperature())
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

temperaturesRouter.post('/olohuone', (request, response) => {
  const body = request.body
  response.json(body['temp'])
})

temperaturesRouter.post('/ulko', (request, response) => {
  const body = request.body
  response.json(body['ulko'])
})

module.exports = { temperaturesRouter, freq }
