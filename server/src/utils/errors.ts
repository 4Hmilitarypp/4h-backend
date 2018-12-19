import { IApiError } from '../types'
const notFoundError: IApiError = new Error()
notFoundError.type = 'itemNotFound'
export { notFoundError }
