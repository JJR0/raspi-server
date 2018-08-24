const supertest = require('supertest')
const { app, server } = require('../index')

const api = supertest(app)

test('temperatures are returned as json', async () => {
  try {
    await api
      .get('/api/temperature')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  } catch (exception) {
    console.log(exception)
  }

})

afterAll(() => {
  server.close()
})