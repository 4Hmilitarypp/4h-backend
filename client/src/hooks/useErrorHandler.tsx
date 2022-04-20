import * as React from 'react'
import FlashContext from '../contexts/FlashContext'
// import UserContext from '../contexts/UserContext'
import { IApiError } from '../sharedTypes'

export const createError = (message: string, status: number) =>
  ({ response: { data: { message }, status, statusText: '' } } as IApiError)

export const formatError = (err: IApiError | unknown) => {
  const apiError = err as IApiError
  if (apiError.response?.data?.message) {
    return { message: apiError.response.data.message, status: apiError.response.status }
  }
  if (apiError.message) {
    return { message: apiError.message, status: apiError.statusCode }
  }
  return {
    message: typeof err === 'object' ? JSON.stringify(err) : (err as any)?.message || (err as any).toString(),
    status: 500,
  }
}

const useErrorHandler = () => {
  // const userContext = React.useContext(UserContext)
  const flashContext = React.useContext(FlashContext)

  const handleError = (dirtyError: IApiError | unknown, type?: string) => {
    console.error(dirtyError)

    const error = formatError(dirtyError)
    if (type === 'login') {
      if (!flashContext) {
        return alert('Username or Password is invalid, please try again.')
      }
      return flashContext.set({ isError: true, message: 'Username or Password is invalid, please try again.' })
      // } else if (error.status === 401) {
      //   userContext.logout()
      //   if (!flashContext) {
      //     return alert(error.message || 'You must be signed in to perform that action.')
      //   }
      //   return flashContext.set({
      //     isError: true,
      //     message: error.message || 'You must be signed in to perform that action.',
      //   })
    } else if (error.status === 403) {
      if (!flashContext) {
        return alert(error.message || 'You do not have sufficient permissions to perform that action.')
      }
      return flashContext.set({
        isError: true,
        message: error.message || 'You do not have sufficient permissions to perform that action.',
      })
    }
    if (!flashContext) {
      return alert(error.message || 'unknown error')
    }
    flashContext.set({ message: error.message, isError: true })
  }

  return handleError
}

export default useErrorHandler
