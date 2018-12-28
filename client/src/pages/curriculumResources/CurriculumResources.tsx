import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import Flash from '../../components/Flash'
import { useFlash } from '../../hooks/hooks'
import { ICurriculumResource, IDisplayCurriculumResource } from '../../sharedTypes'
import CurriculumResource from './curriculumResource/CurriculumResource'
import { useCurriculumResources } from './curriculumResource/useCurriculumResources'
import CurriculumResourceTable from './CurriculumResourceTable'

interface ICurriculumResourceContext {
  curriculumResources: ICurriculumResource[] | IDisplayCurriculumResource[] | undefined
  setCurriculumResources: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      curriculumResource?: ICurriculumResource
    }
  ) => void
}
export const CurriculumResourceContext = React.createContext<ICurriculumResourceContext>(undefined as any)

const CurriculumResources: React.FC<RouteComponentProps> = () => {
  const { submitted, setSubmitted, successMessage, setSuccessMessage } = useFlash({ initialSubmitted: false })

  const { curriculumResources, setCurriculumResources } = useCurriculumResources({ setSubmitted, setSuccessMessage })

  return (
    <CurriculumResourcesContainer>
      <Flash successMessage={successMessage} submitted={submitted} closeClicked={() => setSubmitted(false)} />
      <CurriculumResourceContext.Provider value={{ curriculumResources, setCurriculumResources }}>
        <Router>
          <CurriculumResourceTable path="/" />
          <CurriculumResource path="/:_id" />
        </Router>
      </CurriculumResourceContext.Provider>
    </CurriculumResourcesContainer>
  )
}
export default CurriculumResources

const CurriculumResourcesContainer = styled.div``
