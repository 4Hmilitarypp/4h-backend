import express, { Express } from 'express'
import setupLiaisonRoutes from './liaisons'
import setupPartnerRoutes from './partners'
import setupResearchRoutes from './research'
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
}
export default setupRoutes
