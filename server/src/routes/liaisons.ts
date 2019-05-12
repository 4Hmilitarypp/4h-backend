import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as liaisonController from '../controllers/liaisons'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupLiaisonRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(liaisonController.getLiaisons))
    .post(auth.required, guard({}).check('admin'), catchErrors(liaisonController.createLiaison))
  router
    .route('/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(liaisonController.deleteLiaison))
    .put(auth.required, guard({}).check('admin'), catchErrors(liaisonController.updateLiaison))
}
export default setupLiaisonRoutes
