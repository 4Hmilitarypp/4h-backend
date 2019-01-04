import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IResource } from '../../sharedTypes'
import Resource from './resource/Resource'
import useResources from './resource/useResources'
import ResourceTable from './ResourceTable'

interface IResourceContext {
  resources: IResource[]
  updateResources: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      resource?: IResource
    }
  ) => void
  findById: (id: string) => IResource | undefined
}
export const ResourceContext = React.createContext<IResourceContext>(undefined as any)

const Resources: React.FC<RouteComponentProps> = () => {
  const { resources, updateResources } = useResources()
  const findById = (id: string) => (resources ? resources.find(r => r._id === id) : undefined)

  return (
    <ResourceContext.Provider value={{ resources, updateResources, findById }}>
      <Router>
        <ResourceTable path="/" />
        <Resource path="/:_id" />
      </Router>
    </ResourceContext.Provider>
  )
}
export default Resources
