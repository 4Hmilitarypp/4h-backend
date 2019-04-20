import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IResource } from '../../sharedTypes'
import Resource from './resource/Resource'
import ResourceTable from './ResourceTable'
import useResources, { TUpdateResources } from './useResources'

export interface IResourceContext {
  resources: IResource[]
  updateResources: TUpdateResources
  findById: (id: string) => IResource | undefined
}
export const ResourceContext = React.createContext<IResourceContext>(undefined as any)

const Resources: React.FC<RouteComponentProps> = () => {
  const { handleError, resources, updateResources } = useResources()
  const findById = (id: string) => (resources ? resources.find(r => r._id === id) : undefined)

  return (
    <ResourceContext.Provider value={{ resources, updateResources, findById }}>
      {resources.length > 0 && <div data-testid="Resources" />}
      <Router>
        <ResourceTable path="/" />
        <Resource handleError={handleError} path="/:_id" />
      </Router>
    </ResourceContext.Provider>
  )
}
export default Resources
