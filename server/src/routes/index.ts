import express, { Express } from 'express'
import { notFoundError } from '../utils/errors'
import setupAdminRoutes from './admin'
import setupCampRoutes from './camps'
import setupEmailRoutes from './emails'
import setupLiaisonRoutes from './liaisons'
import setupPageInfoRoutes from './pageInfo'
import setupPartnerRoutes from './partners'
import setupResearchRoutes from './research'
import setupResourceRoutes from './resources'
import setupUserRoutes from './users'
import setupWebinarRoutes from './webinars'

const setupRoutes = (app: Express) => {
  const campRouter = express.Router()
  setupCampRoutes(campRouter)
  app.use('/api/camps', campRouter)

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

  const userRouter = express.Router()
  setupUserRoutes(userRouter)
  app.use('/api/users', userRouter)

  const emailRouter = express.Router()
  setupEmailRoutes(emailRouter)
  app.use('/api/emails', emailRouter)

  const adminRouter = express.Router()
  setupAdminRoutes(adminRouter)
  app.use('/api/admin', adminRouter)

  const pageInfoRouter = express.Router()
  setupPageInfoRoutes(pageInfoRouter)
  app.use('/api/page-info', pageInfoRouter)

  // Docker check to tell whether the app is ready or not
  app.get('/api/docker-check', (_, res) => res.send('app is ready'))

  // if a call reaches here, the route is not found
  app.use('/api', () => {
    throw notFoundError
  })
}
export default setupRoutes
