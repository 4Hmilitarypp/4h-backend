/* eslint-disable no-console */
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import path from 'path'

import * as errorHandlers from './handlers/errorHandlers'
import setupRoutes from './routes'

// initialize the application and create the routes
const app = express()

// sets various http headers https://github.com/helmetjs/helmet
app.use(helmet())

// allow cors so my site can communicate with my back-end.
const corsOptions = {
  origin: [process.env.FRONTEND_URL || '', process.env.NODE_ENV === 'development' ? 'http://localhost:2323' : ''],
}
app.use(cors(corsOptions))

// so that I can look at the body of post requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// pass the app to our routes to set them up
setupRoutes(app)

// Serve any static files
app.use(express.static(path.resolve(__dirname, '../../client/build'), { maxAge: '30d' }))
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'), (err: Error) => {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// If that above routes didn't work, we 404 them and forward to error handler
app.use(errorHandlers.routeNotFound)

// if an item can't be found in the database
app.use(errorHandlers.itemNotFound)

// check if errors are mongoDB validation errors
app.use(errorHandlers.validationErrors)

// check if errors are mongoDB cast errors
app.use(errorHandlers.castErrors)

// forbiddenError needs to come before unauthorizedError because forbidden is a type of unauthorizedError
app.use(errorHandlers.forbiddenError)

app.use(errorHandlers.unauthorizedError)

// Programmer error handling in dev
if (process.env.NODE_ENV === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors)
}

// production error handling in prod, will stop the process!
app.use(errorHandlers.productionErrors)

export default app
