import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as adminController from '../controllers/admin'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupAdminRoutes = (router: Router) => {
  router
    .route('/cloudinary-reports/usage')
    .get(auth.required, guard().check('admin'), catchErrors(adminController.getUsage))
  router
    .route('/cloudinary-reports/:beginDate/:endDate')
    .get(auth.required, guard().check('admin'), catchErrors(adminController.getReport))
}
export default setupAdminRoutes
