import { navigate } from '@reach/router'
import * as React from 'react'
import UserContext from '../contexts/UserContext'
import useErrorHandler, { createError } from './useErrorHandler'

const usePermission = (orPermissions: string | string[]) => {
  const userContext = React.useContext(UserContext)
  const handleError = useErrorHandler()

  React.useEffect(() => {
    if (userContext.isLoaded) {
      if (!userContext.user) {
        handleError(createError('You must be signed in to visit that route', 401))
        navigate('/')
      } else {
        let isValidated = true
        if (typeof orPermissions === 'string') isValidated = userContext.user.permissions.includes(orPermissions)
        else isValidated = (orPermissions as string[]).some(p => (userContext as any).user.permissions.includes(p))

        if (!isValidated) {
          handleError(createError('You do not have sufficient permissions to visit that route', 403))
          navigate('/')
        }
      }
    }
  }, [userContext.user, userContext.isLoaded])
}
export default usePermission
