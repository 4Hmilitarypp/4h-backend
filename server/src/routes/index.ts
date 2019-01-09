import express, { Express } from 'express'
import { notFoundError } from '../utils/errors'
import setupLiaisonRoutes from './liaisons'
import setupPartnerRoutes from './partners'
import setupResearchRoutes from './research'
import setupResourceRoutes from './resources'
import setupWebinarRoutes from './webinars'

const setupRoutes = (app: Express) => {
  const partnerRouter = express.Router()
  setupPartnerRoutes(partnerRouter)
  app.use('/api/partners', partnerRouter)

  const liaisonRouter = express.Router()
  setupLiaisonRoutes(liaisonRouter)
  app.use('/api/liaisons', liaisonRouter)

  const webinarRouter = express.Router()
  setupWebinarRoutes(webinarRouter)
  app.use('/api/webinars', webinarRouter)

  const researchRouter = express.Router()
  setupResearchRoutes(researchRouter)
  app.use('/api/research', researchRouter)

  const resourcesRouter = express.Router()
  setupResourceRoutes(resourcesRouter)
  app.use('/api/resources', resourcesRouter)

  // Docker check to tell whether the app is ready or not
  app.get('/api/docker-check', (req, res) => {
    res.send('app is ready')
  })

  // if a call reaches here, the route is not found
  app.use('/api', () => {
    throw notFoundError
  })
}
export default setupRoutes
