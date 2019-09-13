import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { ICamp } from '../../sharedTypes'
import Camp from './Camp'
import CampTable from './CampTable'
import useCamps, { TUpdateCamps } from './useCamps'

export interface ICampContext {
  camps: ICamp[]
  updateCamps: TUpdateCamps
  findById: (id: string) => ICamp | undefined
}
export const CampContext = React.createContext<ICampContext>(undefined as any)

const Camps: React.FC<RouteComponentProps> = () => {
  const { handleError, camps, updateCamps } = useCamps()

  const findById = (id: string) => (camps ? camps.find(r => r._id === id) : undefined)

  return (
    <CampContext.Provider value={{ camps, updateCamps, findById }}>
      {camps.length > 0 && <div data-testid="Camps" />}
      <Router>
        <CampTable path="/" />
        <Camp handleError={handleError} path="/:_id" />
      </Router>
    </CampContext.Provider>
  )
}
export default Camps
