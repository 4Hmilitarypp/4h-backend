import { filter, map } from 'lodash'
import * as React from 'react'
import FlashContext from '../../contexts/FlashContext'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IResource } from '../../sharedTypes'
import api from '../../utils/api'
import { numericSort } from '../../utils/string'

export type TUpdateTechResources = ({
  _id,
  action,
  resource,
}: {
  _id?: string
  action: 'create' | 'update' | 'delete'
  resource?: IResource
}) => void

const useTechResources = () => {
  const [techResources, setTechResources] = React.useState<IResource[]>([])
  const handleError = useErrorHandler()
  React.useEffect(() => {
    api.resources
      .getByParent('tech-curriculum')
      .then(r => setTechResources(r))
      .catch(handleError)
  }, [handleError])

  const flashContext = React.useContext(FlashContext)

  const updateTechResources: TUpdateTechResources = ({ _id, action, resource }) => {
    let newTechResources: IResource[] = []
    if (action === 'update' && resource) {
      newTechResources = map(techResources, r => (r._id === resource._id ? resource : r))
      flashContext.set({ message: 'Resource Updated Successfully' })
    } else if (action === 'create' && resource) {
      const unsorted = [resource, ...techResources]
      newTechResources = numericSort(unsorted, 'title')
      flashContext.set({ message: 'Resource Created Successfully' })
    } else if (action === 'delete') {
      newTechResources = filter(techResources, r => r._id !== _id)
      flashContext.set({ message: 'Resource Deleted Successfully' })
    }
    setTechResources(newTechResources)
  }
  return { handleError, techResources, updateTechResources }
}
export default useTechResources
