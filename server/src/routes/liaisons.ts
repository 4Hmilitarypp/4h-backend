import { Router } from 'express'
import * as liaisonController from '../controllers/liaisons'

import { catchErrors } from '../handlers/errorHandlers'

const setupLiaisonRoutes = (router: Router) => {
  router
    .route('/')
    .get(catchErrors(liaisonController.getLiaisons))
    .post(catchErrors(liaisonController.createLiaison))
  router
    .route('/:_id')
    .delete(catchErrors(liaisonController.deleteLiaison))
    .put(catchErrors(liaisonController.updateLiaison))
}
export default setupLiaisonRoutes
