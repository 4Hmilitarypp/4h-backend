import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as applicationController from '../controllers/applications'
import { catchErrors } from '../utils/errorHandlers'
import auth from './auth'

const setupApplicationRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(applicationController.getApplications))
    .post(auth.required, guard().check('admin'), catchErrors(applicationController.createApplication))
  router
    .route('/:_id')
    .delete(auth.required, guard().check('admin'), catchErrors(applicationController.deleteApplication))
    .put(auth.required, guard().check('admin'), catchErrors(applicationController.updateApplication))
}
export default setupApplicationRoutes
