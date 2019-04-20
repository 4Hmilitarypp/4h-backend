// @ts-ignore
import guard from 'express-jwt-permissions'

import { Router } from 'express'
import * as webinarController from '../controllers/webinars'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupWebinarRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(webinarController.getWebinars))
    .post(auth.required, guard({}).check('admin'), catchErrors(webinarController.createWebinar))
  router
    .route('/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(webinarController.deleteWebinar))
    .put(auth.required, guard({}).check('admin'), catchErrors(webinarController.updateWebinar))
}
export default setupWebinarRoutes
