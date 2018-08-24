const temperaturesRouter = require('express').Router()
const Temperature = require('../models/temperature')
// const tempValue = require('rpi-temperature')
let freq = 1800000

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

temperaturesRouter.get('/now', async (request, response) => {
  try {
    response.json(25) // tempValue.getTemperature()
    // console.log('Tämän hetken lämpötila: ', tempValue.getTemperature())
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
      // const temperatures = temp[0].temperatures
      // const id = temp[0]._id

      // console.log('löydetty temp: ', temperatures)
      // console.log('löydetty temp: ', id)

      response.json(temp)
    }
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

temperaturesRouter.post('/', (request, response) => {
  const updateFreq = request.body
  // console.log(updateFreq)

  if (Object.keys(updateFreq).length === 0 && updateFreq.constructor === Object) {
    response.status(400).json({ error: 'content missing' })
  }

  freq = updateFreq
  response.json(freq)
})

module.exports = { temperaturesRouter, freq }
