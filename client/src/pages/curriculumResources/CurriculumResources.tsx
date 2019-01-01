import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { ICurriculumResource } from '../../sharedTypes'
import CurriculumResource from './curriculumResource/CurriculumResource'
import useCurriculumResources from './curriculumResource/useCurriculumResources'
import CurriculumResourceTable from './CurriculumResourceTable'

interface ICurriculumResourceContext {
  curriculumResources: ICurriculumResource[] | undefined
  updateCurriculumResources: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      curriculumResource?: ICurriculumResource
    }
  ) => void
}
export const CurriculumResourceContext = React.createContext<ICurriculumResourceContext>(undefined as any)

const CurriculumResources: React.FC<RouteComponentProps> = () => {
  const { curriculumResources, updateCurriculumResources } = useCurriculumResources()

  return (
    <CurriculumResourceContext.Provider value={{ curriculumResources, updateCurriculumResources }}>
      <Router>
        <CurriculumResourceTable path="/" />
        <CurriculumResource path="/:_id" />
      </Router>
    </CurriculumResourceContext.Provider>
  )
}
export default CurriculumResources
