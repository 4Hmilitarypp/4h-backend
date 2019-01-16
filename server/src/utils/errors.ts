import { IApiError } from '../types'

const notFoundError: IApiError = new Error()
notFoundError.type = 'itemNotFound'

const routeNotFoundError: IApiError = new Error()
notFoundError.type = 'routeNotFound'

export { notFoundError, routeNotFoundError }
