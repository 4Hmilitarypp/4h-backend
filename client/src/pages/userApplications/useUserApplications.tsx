import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import usePermission from '../../hooks/usePermission'
import { IFullUserApplication } from '../../sharedTypes'
import api from '../../utils/api'
import { numericSort } from '../../utils/string'

export type TUpdateUserApplications = ({
  _id,
  action,
  userApplication,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete'
  userApplication?: IFullUserApplication
}) => void

const useUserApplications = () => {
  usePermission(['application-user', 'admin'])
  const handleError = useErrorHandler()

  const [userApplications, setUserApplications] = React.useState<IFullUserApplication[]>([])
  React.useEffect(() => {
    api.userApplications
      .get()
      .then(c => setUserApplications(c))
      .catch(handleError)
  }, [])

  const flashContext = React.useContext(FlashContext)

  const updateUserApplications: TUpdateUserApplications = ({ _id, action, userApplication }) => {
    let newUserApplications: IFullUserApplication[] = []
    if (action === 'update' && userApplication) {
      newUserApplications = map(userApplications, r => (r._id === userApplication._id ? userApplication : r))
      flashContext.set({ message: 'Application Updated Successfully' })
    } else if (action === 'create' && userApplication) {
      const unsorted = [userApplication, ...userApplications]
      newUserApplications = numericSort(unsorted, 'dueDate')
      flashContext.set({ message: 'Application Created Successfully' })
    } else if (action === 'delete') {
      newUserApplications = filter(userApplications, c => c._id !== _id)
      flashContext.set({ message: 'Application Deleted Successfully' })
    }
    setUserApplications(newUserApplications)
  }
  return { handleError, userApplications, updateUserApplications }
}
export default useUserApplications
