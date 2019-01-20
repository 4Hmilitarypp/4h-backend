import { IApiError } from '../types'

const notFoundError: IApiError = new Error()
notFoundError.type = 'itemNotFound'

const routeNotFoundError: IApiError = new Error()
notFoundError.type = 'routeNotFound'

const emailError = (msg: string, status: number): IApiError => {
  const err: IApiError = new Error(
    `This wasn't supposed to happen... Please let Meredith or Suzie know this EMAIL error occurred: ${msg}`
  )
  err.status = status
  err.type = 'emailError'
  console.error(msg, status)
  return err
}

export { notFoundError, routeNotFoundError, emailError }
