import * as React from 'react'
import FlashContext from '../contexts/FlashContext'
import { useUser } from '../contexts/UserContext'
import { IApiError } from '../sharedTypes'

export const formatError = (err: IApiError) => err.response.data.message

const useErrorHandler = () => {
  const userContext = useUser()
  const flashContext = React.useContext(FlashContext)

  const handleError = (err: IApiError) => {
    flashContext.set({ message: formatError(err), isError: true })
    if (err.status === 401) {
      userContext.logout()
    }
  }

  return { handleError }
}

export default useErrorHandler
