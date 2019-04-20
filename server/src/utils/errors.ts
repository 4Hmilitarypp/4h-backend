import { IApiError } from '../types'

const notFoundError: IApiError = new Error()
notFoundError.type = 'itemNotFound'

const routeNotFoundError: IApiError = new Error()
notFoundError.type = 'routeNotFound'

const emailError = (error: any): IApiError => {
  const formattedError: IApiError = new Error(
    `This wasn't supposed to happen... Please let Meredith or Suzie know this EMAIL error occurred: ${error.response}`
  )
  formattedError.status = error.responseCode
  formattedError.type = 'emailError'
  console.error(error)
  return formattedError
}

const captchaError = (error: any): IApiError => {
  const formattedError: IApiError = new Error(
    `This wasn't supposed to happen... Please let Meredith or Suzie know this CAPTCHA error occurred`
  )
  formattedError.status = 500
  formattedError.type = 'captchaError'
  console.error(error)
  return formattedError
}

export { captchaError, notFoundError, routeNotFoundError, emailError }
