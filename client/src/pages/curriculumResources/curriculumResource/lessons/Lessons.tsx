import { Link } from '@reach/router'
import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../../../components/Elements'
import { ILesson } from '../../../../sharedTypes'
import { hoveredRow } from '../../../../utils/mixins'
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
    <div>
      <TableHeader>
        <Heading>Lessons</Heading>
        <Button as={Link} to="new">
          + Create a new Lesson
        </Button>
      </TableHeader>
      <LessonContext.Provider value={{ lessons, updateLessons, resourceId }}>
        {map(lessons, l => (
          <Wrapper key={l._id}>
            <Title>{l.title}</Title>
            <LessonModal open={modalOpen} setOpen={setModalOpen} lesson={l} action="update" />
          </Wrapper>
        ))}
      </LessonContext.Provider>
    </div>
  )
}

export default Lessons

const TableHeader = styled.div`
  padding: 0rem 4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const Wrapper = styled.div`
  padding: 2rem;
  position: relative;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const Title = styled.span`
  font-weight: 500;
`
