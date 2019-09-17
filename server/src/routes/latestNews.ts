import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as latestNewsController from '../controllers/latestNews'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupPartnerRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(latestNewsController.getAllLatestNews))
    .post(auth.optional, catchErrors(latestNewsController.createLatestNews))
  // !! .post(auth.required, guard({}).check('admin'), catchErrors(latestNewsController.createLatestNews))
  router
    .route('/:slug')
    .get(auth.optional, catchErrors(latestNewsController.getLatestNews))
    // ! .delete(auth.required, guard({}).check('admin'), catchErrors(latestNewsController.deleteLatestNews))
    .delete(auth.optional, catchErrors(latestNewsController.deleteLatestNews))
    .put(auth.optional, catchErrors(latestNewsController.updateLatestNews))
  // ! .put(auth.required, guard({}).check('admin'), catchErrors(latestNewsController.updateLatestNews))
}

export default setupPartnerRoutes
