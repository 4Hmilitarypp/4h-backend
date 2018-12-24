import { Router } from 'express'
import * as educatorController from '../controllers/research'

import { catchErrors } from '../handlers/errorHandlers'

const setupEducatorRoutes = (router: Router) => {
  router
    .route('/')
    .get(catchErrors(educatorController.getResearch))
    .post(catchErrors(educatorController.createResearch))
    .put(catchErrors(educatorController.updateResearch))
  router.route('/:id').delete(catchErrors(educatorController.deleteResearch))
}
export default setupEducatorRoutes
