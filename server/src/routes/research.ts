// @ts-ignore
import guard from 'express-jwt-permissions'

import { Router } from 'express'
import * as educatorController from '../controllers/research'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupEducatorRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(educatorController.getResearch))
    .post(auth.required, guard({}).check('admin'), catchErrors(educatorController.createResearch))
  router
    .route('/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(educatorController.deleteResearch))
    .put(auth.required, guard({}).check('admin'), catchErrors(educatorController.updateResearch))
}
export default setupEducatorRoutes
