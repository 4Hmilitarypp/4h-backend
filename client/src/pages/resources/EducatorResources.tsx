import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import usePermission from '../../hooks/usePermission'
import { IResource } from '../../sharedTypes'
import EducatorResource from './resource/EducatorResource'
import EducatorResourceTable from './resource/EducatorResourceTable'
import useResources, { TUpdateResources } from './useResources'

export interface IResourceContext {
  resources: IResource[]
  updateResources: TUpdateResources
  findById: (id: string) => IResource | undefined
}
export const ResourceContext = React.createContext<IResourceContext>(undefined as any)

const EducatorResources: React.FC<RouteComponentProps> = () => {
  const { handleError, resources, updateResources } = useResources()
  usePermission('admin')

  const findById = (id: string) => (resources ? resources.find(r => r._id === id) : undefined)

  return (
    <ResourceContext.Provider value={{ resources, updateResources, findById }}>
      {resources.length > 0 && <div data-testid="Resources" />}
      <Router>
        <EducatorResourceTable path="/" />
        <EducatorResource handleError={handleError} path="/:_id" />
      </Router>
    </ResourceContext.Provider>
  )
}
export default EducatorResources
