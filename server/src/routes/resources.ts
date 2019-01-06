import { Router } from 'express'
import * as resourceController from '../controllers/resources'

import { catchErrors } from '../handlers/errorHandlers'

const setupResourceRoutes = (router: Router) => {
  router.route('/slug/:slug').get(catchErrors(resourceController.getResourceBySlug))
  router
    .route('/')
    .get(catchErrors(resourceController.getResources))
    .post(catchErrors(resourceController.createResource))
  router
    .route('/:_id')
    .delete(catchErrors(resourceController.deleteResource))
    .get(catchErrors(resourceController.getResource))
    .put(catchErrors(resourceController.updateResource))
  router
    .route('/:resourceId/lessons')
    .get(catchErrors(resourceController.getLessons))
    .post(catchErrors(resourceController.createLesson))
  router
    .route('/:resourceId/lessons/:_id')
    .delete(catchErrors(resourceController.deleteLesson))
    .put(catchErrors(resourceController.updateLesson))
}
export default setupResourceRoutes
