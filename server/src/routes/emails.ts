import { Router } from 'express'

import * as emails from '../controllers/emails'
import { catchErrors } from '../utils/errorHandlers'

const setupUserRoutes = (router: Router) => {
  router.post('/contact-us', catchErrors(emails.contactUs))
}
export default setupUserRoutes
