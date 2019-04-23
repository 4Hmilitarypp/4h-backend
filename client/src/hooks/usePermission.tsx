import { navigate } from '@reach/router'
import * as React from 'react'
import UserContext from '../contexts/UserContext'
import useErrorHandler, { createError } from './useErrorHandler'

const usePermission = (permission: string) => {
  const userContext = React.useContext(UserContext)
  const handleError = useErrorHandler()

  React.useEffect(() => {
    if (userContext.isLoaded) {
      if (!userContext.user) {
        handleError(createError('You must be signed in to visit that route', 401))
        navigate('/')
      } else {
        if (!userContext.user.permissions.includes(permission)) {
          handleError(createError('You do not have sufficient permissions to visit that route', 403))
          navigate('/')
        }
      }
    }
  }, [userContext.user, userContext.isLoaded])
}
export default usePermission
