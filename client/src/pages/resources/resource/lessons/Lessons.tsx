import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading } from '../../../../components/Elements'
import { ILesson } from '../../../../sharedTypes'
import Lesson from './Lesson'
import LessonModal from './LessonModal'
import useLessons from './useLessons'

interface ILessonContext {
  lessons: ILesson[] | undefined
  resourceId: string
  updateLessons: (
    args: {
      _id?: string
      action: 'create' | 'update' | 'delete'
      lesson?: ILesson
    }
  ) => void
}
export const LessonContext = React.createContext<ILessonContext>(undefined as any)

const Lessons: React.FC<{ resourceId: string }> = ({ resourceId }) => {
  const { lessons, updateLessons } = useLessons(resourceId)

  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <Wrapper>
      <TableHeader>
        <CustomHeading>Lessons</CustomHeading>
        <CreateButton onClick={() => setModalOpen(true)}>+ New Lesson</CreateButton>
      </TableHeader>
      <LessonContext.Provider value={{ lessons, updateLessons, resourceId }}>
        {map(lessons, l => {
          return <Lesson lesson={l} key={l._id} />
        })}
        <LessonModal open={modalOpen} setOpen={setModalOpen} action="create" />
      </LessonContext.Provider>
      <BottomPadding />
    </Wrapper>
  )
}

export default Lessons
const Wrapper = styled.div`
  margin-top: 3.2rem;
  background: ${props => props.theme.primaryLight};
`
const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 3.2rem;
`
const CustomHeading = styled(Heading)`
  font-size: 2.4rem;
`
const CreateButton = styled.button`
  background: ${props => props.theme.primaryBackground};
  border: none;
  color: ${props => props.theme.primaryLink};
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-size: 1.4rem;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
const BottomPadding = styled.div`
  height: 3.2rem;
  width: 100%;
  background: ${props => props.theme.primaryBackground};
`
