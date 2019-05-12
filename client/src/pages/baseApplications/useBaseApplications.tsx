import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import usePermission from '../../hooks/useRole'
import { IApplication } from '../../sharedTypes'
import api from '../../utils/api'
import { numericSort } from '../../utils/string'

export type TUpdateBaseApplications = ({
  _id,
  action,
  baseApplication,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete'
  baseApplication?: IApplication
}) => void

const useBaseApplications = () => {
  usePermission('admin')
  const handleError = useErrorHandler()

  const [baseApplications, setBaseApplications] = React.useState<IApplication[]>([])
  React.useEffect(() => {
    api.applications
      .get()
      .then(c => setBaseApplications(c))
      .catch(handleError)
  }, [])

  const flashContext = React.useContext(FlashContext)

  const updateBaseApplications: TUpdateBaseApplications = ({ _id, action, baseApplication }) => {
    let newBaseApplications: IApplication[] = []
    if (action === 'update' && baseApplication) {
      newBaseApplications = map(baseApplications, r => (r._id === baseApplication._id ? baseApplication : r))
      flashContext.set({ message: 'Application Updated Successfully' })
    } else if (action === 'create' && baseApplication) {
      const unsorted = [baseApplication, ...baseApplications]
      newBaseApplications = numericSort(unsorted, 'dueDate')
      flashContext.set({ message: 'Application Created Successfully' })
    } else if (action === 'delete') {
      newBaseApplications = filter(baseApplications, c => c._id !== _id)
      flashContext.set({ message: 'Application Deleted Successfully' })
    }
    setBaseApplications(newBaseApplications)
  }
  return { handleError, baseApplications, updateBaseApplications }
}
export default useBaseApplications
