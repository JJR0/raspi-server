if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.MONGODB_URI_DEV
}

if (process.env.NODE_ENV === 'development') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.MONGODB_URI_DEV
}

module.exports = {
  mongoUrl,
  port,
}