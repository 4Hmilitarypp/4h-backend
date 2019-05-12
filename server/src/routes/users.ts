import { Router } from 'express'

// @ts-ignore
import guard from 'express-jwt-permissions'
import * as usersController from '../controllers/users'
import auth from '../routes/auth'
import { catchErrors } from '../utils/errorHandlers'

const setupUserRoutes = (router: Router) => {
  router
    .post('/register', auth.optional, catchErrors(usersController.register))
    .post('/login', auth.optional, catchErrors(usersController.login))
    // do not have auth.optional here because we want them to be able to logout if their token is invalid
    .post('/logout', catchErrors(usersController.logout))
    .post('/checkIfSpam', catchErrors(usersController.checkIfSpam))
    .get('/me', auth.optional, catchErrors(usersController.me))
  router
    .route('/')
    .get(auth.required, guard({}).check('admin'), catchErrors(usersController.getUsers))
    .post(auth.required, guard({}).check('admin'), catchErrors(usersController.createUser))

  router
    .route('/:_id')
    .put(auth.required, guard({}).check('admin'), catchErrors(usersController.updateUser))
    .delete(auth.required, guard({}).check('admin'), catchErrors(usersController.deleteUser))
}
export default setupUserRoutes
