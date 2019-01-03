import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IResource } from '../../sharedTypes'
import Resource from './resource/Resource'
import useResources from './resource/useResources'
import ResourceTable from './ResourceTable'

interface IResourceContext {
  resources: IResource[] | undefined
  updateResources: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      resource?: IResource
    }
  ) => void
}
export const ResourceContext = React.createContext<IResourceContext>(undefined as any)

const Resources: React.FC<RouteComponentProps> = () => {
  const { resources, updateResources } = useResources()

  return (
    <ResourceContext.Provider value={{ resources, updateResources }}>
      <Router>
        <ResourceTable path="/" />
        <Resource path="/:_id" />
      </Router>
    </ResourceContext.Provider>
  )
}
export default Resources
