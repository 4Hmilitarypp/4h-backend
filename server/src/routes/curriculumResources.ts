import { Router } from 'express'
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
  router
    .route('/:resourceId/lessons')
    .get(catchErrors(curriculumResourceController.getLessons))
    .post(catchErrors(curriculumResourceController.createLesson))
    .put(catchErrors(curriculumResourceController.updateLesson))
  router.route('/:resourceId/lessons/:id').delete(catchErrors(curriculumResourceController.deleteLesson))
}
export default setupCurriculumResourceRoutes
