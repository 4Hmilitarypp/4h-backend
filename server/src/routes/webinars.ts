import { Router } from 'express'
import * as webinarController from '../controllers/webinars'
import auth from '../routes/auth'

import { catchErrors } from '../handlers/errorHandlers'

const setupWebinarRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(webinarController.getWebinars))
    .post(auth.required, catchErrors(webinarController.createWebinar))
  router
    .route('/:_id')
    .delete(auth.required, catchErrors(webinarController.deleteWebinar))
    .put(auth.required, catchErrors(webinarController.updateWebinar))
}
export default setupWebinarRoutes
