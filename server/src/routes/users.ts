import { Router } from 'express'

import * as usersController from '../controllers/users'
import { catchErrors } from '../handlers/errorHandlers'
import auth from '../routes/auth'

const setupUserRoutes = (router: Router) => {
  router.post('/register', auth.optional, catchErrors(usersController.register))
  router.post('/login', auth.optional, catchErrors(usersController.login))
  // do not have auth.optional here because we want them to be able to logout if their token is invalid
  router.post('/logout', catchErrors(usersController.logout))
  router.get('/me', auth.optional, catchErrors(usersController.me))
}
export default setupUserRoutes
