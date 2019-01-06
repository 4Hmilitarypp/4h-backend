import { Router } from 'express'
import * as partnerController from '../controllers/partners'
import { catchErrors } from '../handlers/errorHandlers'

const setupPartnerRoutes = (router: Router) => {
  router
    .route('/')
    .get(catchErrors(partnerController.getPartners))
    .post(catchErrors(partnerController.createPartner))
  router
    .route('/:_id')
    .delete(catchErrors(partnerController.deletePartner))
    .put(catchErrors(partnerController.updatePartner))
}

export default setupPartnerRoutes
