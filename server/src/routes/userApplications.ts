import { Router } from 'express'
// @ts-ignore
import guard from 'express-jwt-permissions'

import * as userApplicationController from '../controllers/userApplications'
import { catchErrors } from '../utils/errorHandlers'
import auth from './auth'

// const checkAny = guard().check as any

const setupUserApplicationRoutes = (router: Router) => {
  router
    .route('/')
    .get(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.getUserApplications)
    )
    .post(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.createUserApplication)
    )
  router
    .route('/:_id')
    .get(auth.optional, catchErrors(userApplicationController.getUserApplication))
    .delete(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.deleteUserApplication)
    )
    .put(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.updateUserApplication)
    )
  router
    .route('/:userApplicationId/comments')
    .get(auth.optional, catchErrors(userApplicationController.getComments))
    .post(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.createComment)
    )
  router
    .route('/:userApplicationId/comments/:_id')
    .delete(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.deleteComment)
    )
    .put(
      auth.required,
      guard().check([['admin'], ['application-user']]),
      catchErrors(userApplicationController.updateComment)
    )
}

export default setupUserApplicationRoutes
