import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as resourceController from '../controllers/resources'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupResourceRoutes = (router: Router) => {
  router.route('/slug/:slug').get(catchErrors(resourceController.getResourceBySlug))
  router.route('/nested/:parent').get(catchErrors(resourceController.getNestedResources))
  router
    .route('/')
    .get(auth.optional, catchErrors(resourceController.getResources))
    .post(auth.required, guard({}).check('admin'), catchErrors(resourceController.createResource))
  router
    .route('/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(resourceController.deleteResource))
    .get(auth.optional, catchErrors(resourceController.getResource))
    .put(auth.required, guard({}).check('admin'), catchErrors(resourceController.updateResource))
  router
    .route('/:resourceId/lessons')
    .get(auth.optional, catchErrors(resourceController.getLessons))
    .post(auth.required, guard({}).check('admin'), catchErrors(resourceController.createLesson))
  router
    .route('/:resourceId/lessons/:_id')
    .delete(auth.required, guard({}).check('admin'), catchErrors(resourceController.deleteLesson))
    .put(auth.required, guard({}).check('admin'), catchErrors(resourceController.updateLesson))
}
export default setupResourceRoutes
