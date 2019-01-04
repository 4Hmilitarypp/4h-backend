import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../../contexts/FlashContext'
import { IResource } from '../../../sharedTypes'
import api from '../../../utils/api'
import { numericSort } from '../../../utils/string'

const useResources = () => {
  const [resources, setResources] = React.useState<IResource[]>([])
  React.useEffect(() => {
    api.resources
      .get()
      .then(r => setResources(r))
      .catch(err => console.error(err))
  }, [])

  const flashContext = React.useContext(FlashContext)

  const updateResources = ({
    _id,
    action,
    resource,
  }: {
    _id?: string
    action: 'create' | 'update' | 'delete'
    resource?: IResource
  }) => {
    let newResources: IResource[] = []
    if (action === 'update' && resource) {
      newResources = map(resources, r => (r._id === resource._id ? resource : r))
      flashContext.set({ message: 'Resource Updated Successfully' })
    } else if (action === 'create' && resource) {
      const unsorted = [resource, ...resources]
      newResources = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Resource Created Successfully' })
    } else if (action === 'delete') {
      newResources = filter(resources, r => r._id !== _id)
      flashContext.set({ message: 'Resource Deleted Successfully' })
    }
    setResources(newResources)
  }
  return { resources, updateResources }
}
export default useResources
