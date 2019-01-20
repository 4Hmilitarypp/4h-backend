import { Router } from 'express'

import * as usersController from '../controllers/users'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupUserRoutes = (router: Router) => {
  router.post('/register', auth.optional, catchErrors(usersController.register))
  router.post('/login', auth.optional, catchErrors(usersController.login))
  // do not have auth.optional here because we want them to be able to logout if their token is invalid
  router.post('/logout', catchErrors(usersController.logout))
  router.post('/checkIfSpam', catchErrors(usersController.checkIfSpam))
  router.get('/me', auth.optional, catchErrors(usersController.me))
}
export default setupUserRoutes
