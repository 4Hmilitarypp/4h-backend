import { Router } from 'express'
import * as educatorController from '../controllers/research'

import { catchErrors } from '../handlers/errorHandlers'

const setupEducatorRoutes = (router: Router) => {
  router
    .route('/')
    .get(catchErrors(educatorController.getResearch))
    .post(catchErrors(educatorController.createResearch))
  router
    .route('/:_id')
    .delete(catchErrors(educatorController.deleteResearch))
    .put(catchErrors(educatorController.updateResearch))
}
export default setupEducatorRoutes
