import { Router } from 'express'
import * as resourceController from '../controllers/resources'

import { catchErrors } from '../handlers/errorHandlers'

const setupResourceRoutes = (router: Router) => {
  router.route('/slug/:slug').get(catchErrors(resourceController.getResourceBySlug))
  router
    .route('/')
    .get(catchErrors(resourceController.getResources))
    .post(catchErrors(resourceController.createResource))
    .put(catchErrors(resourceController.updateResource))
  router
    .route('/:id')
    .delete(catchErrors(resourceController.deleteResource))
    .get(catchErrors(resourceController.getResource))
  router
    .route('/:resourceId/lessons')
    .get(catchErrors(resourceController.getLessons))
    .post(catchErrors(resourceController.createLesson))
    .put(catchErrors(resourceController.updateLesson))
  router.route('/:resourceId/lessons/:id').delete(catchErrors(resourceController.deleteLesson))
}
export default setupResourceRoutes
