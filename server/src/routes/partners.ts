import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as partnerController from '../controllers/partners'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupPartnerRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(partnerController.getPartnerSections))
    .post(auth.required, guard().check('admin'), catchErrors(partnerController.createPartner))
  router.route('/slug/:slug').get(auth.optional, catchErrors(partnerController.getPartner))
  router
    .route('/:_id')
    .delete(auth.required, guard().check('admin'), catchErrors(partnerController.deletePartner))
    .put(auth.required, guard().check('admin'), catchErrors(partnerController.updatePartner))
  router
    .route('/:partnerId/reports')
    .get(auth.optional, catchErrors(partnerController.getReports))
    .post(auth.required, guard().check('admin'), catchErrors(partnerController.createReport))
  router
    .route('/:partnerId/reports/:_id')
    .delete(auth.required, guard().check('admin'), catchErrors(partnerController.deleteReport))
    .put(auth.required, guard().check('admin'), catchErrors(partnerController.updateReport))
}

export default setupPartnerRoutes
