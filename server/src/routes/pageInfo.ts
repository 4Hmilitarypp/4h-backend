import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as pageInfoController from '../controllers/pageInfo'
import { catchErrors } from '../utils/errorHandlers'
import auth from './auth'

const setupPageInfoRoutes = (router: Router) => {
  router.route('/').post(auth.required, guard({}).check('admin'), catchErrors(pageInfoController.createPageInfo))
  router
    .route('/:page')
    .get(auth.optional, catchErrors(pageInfoController.getPageInfo))
    .put(auth.required, guard({}).check('admin'), catchErrors(pageInfoController.updatePageInfo))
}
export default setupPageInfoRoutes
