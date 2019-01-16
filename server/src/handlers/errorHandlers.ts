import { NextFunction, Request, Response } from 'express'

import { Controller, ErrorHandler, isCastError, isValidationError } from '../types'
/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

export const catchErrors = (fn: Controller) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next).catch(next)

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const routeNotFound: ErrorHandler = (err, _, res, next) => {
  if (err.type === 'routeNotFound') {
    return res.status(404).json({ message: 'The requested url was not found' })
  }
  return next(err)
}

export const itemNotFound: ErrorHandler = (err, _, res, next) => {
  if (err.type === 'itemNotFound') {
    return res.status(404).json({ message: 'The requested item was not found' })
  }
  return next(err)
}

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/
export const validationErrors: ErrorHandler = (err, _, res, next) => {
  if (!isValidationError(err)) {
    return next(err)
  }
  const errorMessages: string[] = []
  const errorKeys = Object.keys(err.errors)
  errorKeys.forEach(key => errorMessages.push(err.errors[key].message))
  const error = { message: `Failed to save data: ${errorMessages.join(' | ').replace('..', '.')}` }
  return res.status(400).json(error)
}

export const castErrors: ErrorHandler = (err, _, res, next) => {
  if (!isCastError(err)) {
    return next(err)
  }
  const { value } = err
  return res
    .status(404)
    .json({ message: `the passed in id: ${value} is formatted incorrectly and could not be found.` })
}

export const forbiddenError: ErrorHandler = (err: any, _, res, next) => {
  if (err.code !== 'permission_denied') {
    return next(err)
  }
  return res.status(403).json({ message: err.message })
}

export const unauthorizedError: ErrorHandler = (err, _, res, next) => {
  if (err.name !== 'UnauthorizedError') {
    return next(err)
  }
  return res.status(401).json({ message: err.message })
}

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
export const developmentErrors: ErrorHandler = (err, _, res) => {
  err.stack = err.stack || ''
  const errorDetails = {
    message: err.message,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
    status: err.status,
  }
  return res.status(err.status || 500).json(errorDetails)
}

/*
  Production Error Handler

  No stacktraces are leaked to user
*/
export const productionErrors: ErrorHandler = (err, _, res) => {
  err.message = 'Unexpected Server Error'
  return res.status(err.status || 500).json(err)
}
