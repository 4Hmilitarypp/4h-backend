import * as React from 'react'
import FlashContext from '../contexts/FlashContext'
import { IApiError } from '../types'

export const formatError = (err: IApiError) => err.response.data.message

const useErrorHandler = () => {
  const flashContext = React.useContext(FlashContext)

  const handleError = (err: IApiError) => flashContext.set({ message: formatError(err), isError: true })

  return { handleError }
}

export default useErrorHandler
