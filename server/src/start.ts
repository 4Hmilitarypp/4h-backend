import mongoose from 'mongoose'
import { AddressInfo } from 'net'

// import environmental variables from our .env file
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

// Connect to our Database and handle any bad connections
mongoose.connect(
  process.env.DATABASE_URL || '',
  { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
)
mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`)
})

// register models with mongoose
import './models/Archive'
import './models/Liaison'
import './models/Partner'
import './models/PartnerSection'
import './models/Research'
import './models/Resource'
import './models/User'
import './models/Webinar'

// must be below models
import './config/passport'

// bring in the app
import app from './app'

app.set('port', process.env.PORT || 7777)
const server = app.listen(process.env.PORT, () => {
  // tslint:disable-next-line
  console.log(`Express running → PORT ${(server.address() as AddressInfo).port}`)
})
