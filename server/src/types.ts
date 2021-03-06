import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

export interface IApiError extends Error {
  status?: number
  type?: string
}

export type Controller = (req: Request, res: Response, next?: NextFunction) => Promise<Response>
export type ErrorHandler = (err: IApiError, req: Request, res: Response, next: NextFunction) => Response | void
const hasNested = (err: any) => {
  for (const key in err.errors) {
    if ((err.errors[key] && err.errors[key].name === 'ValidatorError') || err.errors[key].name === 'ValidationError') {
      return true
    }
  }
  return false
}
export const isValidationError = (err: Error): err is mongoose.Error.ValidationError =>
  err.name === 'ValidatorError' || hasNested(err)

export const isCastError = (err: Error): err is mongoose.Error.CastError => err.name === 'CastError'
