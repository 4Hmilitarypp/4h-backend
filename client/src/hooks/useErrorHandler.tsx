import * as React from 'react'
import FlashContext from '../contexts/FlashContext'
import UserContext from '../contexts/UserContext'
import { IApiError } from '../sharedTypes'

export const createError = (message: string, status: number) =>
  ({ response: { data: { message }, status, statusText: '' } } as IApiError)

export const formatError = (err: IApiError) => {
  if (err.response) {
    if (err.response.data) {
      return { message: err.response.data.message, status: err.response.status }
    }
  }
  return { message: typeof err === 'object' ? JSON.stringify(err) : err, status: 500 }
}

const useErrorHandler = () => {
  const userContext = React.useContext(UserContext)
  const flashContext = React.useContext(FlashContext)

  const handleError = (dirtyError: IApiError, type?: string) => {
    console.error(dirtyError)

    if (!flashContext) return

    const error = formatError(dirtyError)
    if (type === 'login') {
      return flashContext.set({ isError: true, message: 'Username or Password is invalid, please try again.' })
    } else if (error.status === 401) {
      userContext.logout()
      return flashContext.set({
        isError: true,
        message: error.message || 'You must be signed in to perform that action.',
      })
    } else if (error.status === 403) {
      return flashContext.set({
        isError: true,
        message: error.message || 'You do not have sufficient permissions to perform that action.',
      })
    }
    flashContext.set({ message: error.message, isError: true })
  }

  return handleError
}

export default useErrorHandler
