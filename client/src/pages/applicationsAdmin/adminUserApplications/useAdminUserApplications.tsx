import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../contexts/FlashContext'
import useErrorHandler from '../../../hooks/useErrorHandler'
import usePermission from '../../../hooks/usePermission'
import { IFullUserApplication } from '../../../sharedTypes'
import api from '../../../utils/api'

export type TUpdateAdminUserApplications = ({
  _id,
  action,
  adminUserApplication,
}: {
  _id?: string
  action: 'update' | 'delete'
  adminUserApplication?: IFullUserApplication
}) => void

const useAdminUserApplications = (type: 'base' | 'user', refId: string) => {
  usePermission(['application-user', 'admin'])
  const handleError = useErrorHandler()

  const [adminUserApplications, setAdminUserApplications] = React.useState<IFullUserApplication[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  React.useEffect(() => {
    if (type === 'base') {
      api.userApplications
        .getByBaseId(refId)
        .then(c => {
          setAdminUserApplications(c)
          setIsLoaded(true)
        })
        .catch(handleError)
    } else {
      api.userApplications
        .getByUserId(refId)
        .then(c => {
          setAdminUserApplications(c)
          setIsLoaded(true)
        })
        .catch(handleError)
    }
  }, [refId, type]) // eslint-disable-line

  const flashContext = React.useContext(FlashContext)

  const updateAdminUserApplications: TUpdateAdminUserApplications = ({ _id, action, adminUserApplication }) => {
    let newAdminUserApplications: IFullUserApplication[] = []
    if (action === 'update' && adminUserApplication) {
      newAdminUserApplications = map(adminUserApplications, r =>
        r._id === adminUserApplication._id ? adminUserApplication : r
      )
      flashContext.set({ message: 'Application Updated Successfully' })
    } else if (action === 'delete') {
      newAdminUserApplications = filter(adminUserApplications, c => c._id !== _id)
      flashContext.set({ message: 'Application Deleted Successfully' })
    }
    setAdminUserApplications(newAdminUserApplications)
  }
  return { handleError, isLoaded, adminUserApplications, updateAdminUserApplications }
}
export default useAdminUserApplications
