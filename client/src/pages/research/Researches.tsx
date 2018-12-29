import { RouteComponentProps } from '@reach/router'
import { filter, map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../components/Elements'
import FlashContext from '../../contexts/FlashContext'
import { IResearch } from '../../sharedTypes'
import api from '../../utils/api'
import Research from './Research'
import ResearchModal from './ResearchModal'

interface IResearchContext {
  researches: IResearch[] | undefined
  updateResearches: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      research?: IResearch
    }
  ) => void
}
export const ResearchContext = React.createContext<IResearchContext>(undefined as any)

const Researches: React.FC<RouteComponentProps> = () => {
  const [researches, setResearches] = React.useState<IResearch[] | undefined>(undefined)
  const [modalOpen, setModalOpen] = React.useState(false)
  const flashContext = React.useContext(FlashContext)
  const updateResearches = ({
    _id,
    action,
    research,
  }: {
    _id?: string
    action: 'create' | 'update' | 'delete'
    research?: IResearch
  }) => {
    if (researches) {
      let newResearches: IResearch[] = []
      if (action === 'update' && research) {
        newResearches = map(researches, r => (r._id === research._id ? research : r))
        flashContext.set({ message: 'Research Updated Successfully' })
      } else if (action === 'create' && research) {
        newResearches = [research, ...researches]
        flashContext.set({ message: 'Research Created Successfully' })
      } else if (action === 'delete') {
        newResearches = filter(researches, r => r._id !== _id)
        flashContext.set({ message: 'Research Deleted Successfully' })
      }
      setResearches(newResearches)
    }
  }

  React.useEffect(() => {
    api.research
      .get()
      .then(r => setResearches(r))
      .catch(err => console.error(err))
  }, [])

  return (
    <ResearchesContainer>
      <ResearchContext.Provider value={{ researches, updateResearches }}>
        <TableHeader>
          <ResearchHeading>Research</ResearchHeading>
          <Button onClick={() => setModalOpen(true)}>+ Create a new Research</Button>
        </TableHeader>
        {researches && (
          <ul>
            {map(researches, r => (
              <Research key={r.title} research={r} />
            ))}
          </ul>
        )}
        <ResearchModal open={modalOpen} setOpen={setModalOpen} action="create" />
      </ResearchContext.Provider>
    </ResearchesContainer>
  )
}
export default Researches

const ResearchesContainer = styled.div``
const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const ResearchHeading = styled(Heading)`
  padding: 4rem 0 0;
`
