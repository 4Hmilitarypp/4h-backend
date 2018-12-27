/* import { Router } from 'express'
import * as curriculumResourceController from '../controllers/curriculumResources'

import { catchErrors } from '../handlers/errorHandlers'

const setupCurriculumResourceRoutes = (router: Router) => {
  router
    .route('/')
    .get(catchErrors(curriculumResourceController.getCurriculumResources))
    .post(catchErrors(curriculumResourceController.createCurriculumResource))
    .put(catchErrors(curriculumResourceController.updateCurriculumResource))
  router
    .route('/:id')
    .delete(catchErrors(curriculumResourceController.deleteCurriculumResource))
    .get(catchErrors(curriculumResourceController.getCurriculumResource))
}
export default setupCurriculumResourceRoutes
 */
