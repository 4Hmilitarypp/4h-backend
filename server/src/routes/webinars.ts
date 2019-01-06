import { Router } from 'express'
import * as webinarController from '../controllers/webinars'

import { catchErrors } from '../handlers/errorHandlers'

const setupWebinarRoutes = (router: Router) => {
  router
    .route('/')
    .get(catchErrors(webinarController.getWebinars))
    .post(catchErrors(webinarController.createWebinar))
  router
    .route('/:_id')
    .delete(catchErrors(webinarController.deleteWebinar))
    .put(catchErrors(webinarController.updateWebinar))
}
export default setupWebinarRoutes
