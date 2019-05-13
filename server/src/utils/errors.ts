import { IApiError } from '../types'

const notFoundError: IApiError = new Error()
notFoundError.name = 'itemNotFound'
notFoundError.message = 'The requested item was not found'

const routeNotFoundError: IApiError = new Error()
notFoundError.name = 'routeNotFound'
routeNotFoundError.message = 'The requested url was not found'

const forbiddenError: IApiError = new Error()
;(forbiddenError as any).code = 'permission_denied'
forbiddenError.name = 'forbiddenError'
forbiddenError.message = 'You are forbidden from making this request'

const emailError = (error: any): IApiError => {
  const formattedError: IApiError = new Error(
    `This wasn't supposed to happen... Please let Meredith or Suzie know this EMAIL error occurred: ${error.response}`
  )
  formattedError.status = error.responseCode
  formattedError.name = 'emailError'
  console.error(error)
  return formattedError
}

const captchaError = (error: any): IApiError => {
  const formattedError: IApiError = new Error(
    `This wasn't supposed to happen... Please let Meredith or Suzie know this CAPTCHA error occurred`
  )
  formattedError.status = 500
  formattedError.name = 'captchaError'
  console.error(error)
  return formattedError
}

export { captchaError, forbiddenError, notFoundError, routeNotFoundError, emailError }
