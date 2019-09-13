import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import usePermission from '../../hooks/usePermission'
import { IResource } from '../../sharedTypes'
import TechResource from './TechResource'
import TechResourceTable from './TechResourceTable'
import useResources, { TUpdateTechResources } from './useTechResources'

export interface IResourceContext {
  techResources: IResource[]
  updateTechResources: TUpdateTechResources
  findById: (id: string) => IResource | undefined
}
export const ResourceContext = React.createContext<IResourceContext>(undefined as any)

const TechCurriculum: React.FC<RouteComponentProps> = () => {
  const { handleError, techResources, updateTechResources } = useResources()
  usePermission('admin')

  const findById = (id: string) => (techResources ? techResources.find(r => r._id === id) : undefined)

  return (
    <ResourceContext.Provider value={{ techResources, updateTechResources, findById }}>
      {techResources.length > 0 && <div data-testid="Resources" />}
      <Router>
        <TechResourceTable path="/" />
        <TechResource handleError={handleError} path="/:_id" />
      </Router>
    </ResourceContext.Provider>
  )
}
export default TechCurriculum
