import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as campController from '../controllers/camps'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupCampRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(campController.getCamps))
    .post(auth.required, guard({}).check('admin'), catchErrors(campController.createCamp))
  router
    .route('/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(campController.deleteCamp))
    .put(auth.required, guard({}).check('admin'), catchErrors(campController.updateCamp))
  router
    .route('/:campId/dates')
    .get(auth.optional, catchErrors(campController.getCampDates))
    .post(auth.required, guard({}).check('admin'), catchErrors(campController.createCampDate))
  router
    .route('/:campId/dates/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(campController.deleteCampDate))
    .put(auth.required, guard({}).check('admin'), catchErrors(campController.updateCampDate))
}
export default setupCampRoutes
