import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as partnerController from '../controllers/partners'
import { catchErrors } from '../handlers/errorHandlers'
import auth from '../routes/auth'

const setupPartnerRoutes = (router: Router) => {
  router
    .route('/')
    .get(auth.optional, catchErrors(partnerController.getPartners))
    .post(auth.required, guard().check('admin'), catchErrors(partnerController.createPartner))
  router
    .route('/:_id')
    .delete(auth.required, guard().check('admin'), catchErrors(partnerController.deletePartner))
    .put(auth.required, guard().check('admin'), catchErrors(partnerController.updatePartner))
}

export default setupPartnerRoutes
