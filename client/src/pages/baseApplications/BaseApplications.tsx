import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IApplication } from '../../sharedTypes'
import BaseApplication from './BaseApplication'
import BaseApplicationTable from './BaseApplicationTable'
import useBaseApplications, { TUpdateBaseApplications } from './useBaseApplications'

export interface IBaseApplicationContext {
  baseApplications: IApplication[]
  updateBaseApplications: TUpdateBaseApplications
  findById: (id: string) => IApplication | undefined
}
export const BaseApplicationContext = React.createContext<IBaseApplicationContext>(undefined as any)

const BaseApplications: React.FC<RouteComponentProps> = () => {
  const { handleError, baseApplications, updateBaseApplications } = useBaseApplications()

  const findById = (id: string) => (baseApplications ? baseApplications.find(r => r._id === id) : undefined)

  return (
    <BaseApplicationContext.Provider value={{ baseApplications, updateBaseApplications, findById }}>
      {baseApplications.length > 0 && <div data-testid="BaseApplications" />}
      <Router>
        <BaseApplicationTable path="/" />
        <BaseApplication handleError={handleError} path="/:_id" />
      </Router>
    </BaseApplicationContext.Provider>
  )
}
export default BaseApplications
