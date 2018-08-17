const temperaturesRouter = require('express').Router()
const Temperature = require('../models/temperature')
//const tempValue = require('rpi-temperature')

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

    // tempValue.getTemperature()
    response.json(25)
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
      response.json(404).json({ error: 'temperature data not found on that date'})
    }

    const temperatures = temp[0].temperatures
    const id = temp[0]._id

    console.log('löydetty temp: ', temp)
    console.log('löydetty temp: ', id)

    response.json(temp)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

temperaturesRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    if (body.date === undefined && body.temperatures === undefined) {
      return response.status(400).json({ error: 'date and temperatures missing' })
    }
  
    const temp = new Temperature({
      date: body.date,
      temperatures: body.temperatures
    })
  
    const savedTemp = await temp.save()
  
    response.json(Temperature.format(savedTemp))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

temperaturesRouter.put('/:date', async (request, response) => {
  try {

    const temp = await Temperature
      .find({ date: request.params.date })

    const temperatures = temp[0].temperatures
    const id = temp[0]._id

    console.log('löydetty temp: ', temperatures)
    console.log('löydetty temp: ', id)

    await Temperature.findByIdAndUpdate({ _id: id }, { temperatures: temperatures.concat(request.body.temperatures) })
    const result = await Temperature.findById(id)
    response.json(Temperature.format(result))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = temperaturesRouter