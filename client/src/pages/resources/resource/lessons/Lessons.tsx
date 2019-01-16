import { map } from 'lodash'
import * as React from 'react'
import styled from 'styled-components/macro'
import { CreateButton, Heading } from '../../../../components/Elements'
import { IApiError } from '../../../../sharedTypes'
import Lesson from './Lesson'
import LessonModal from './LessonModal'
import useLessons from './useLessons'

interface IProps {
  resourceId: string
  handleError: (err: IApiError) => void
}

const Lessons: React.FC<IProps> = ({ resourceId, handleError }) => {
  const { modalController, lessons } = useLessons(handleError, resourceId)

  return (
    <Wrapper>
      <TableHeader>
        <CustomHeading>Lessons</CustomHeading>
        <CreateButton onClick={() => modalController.set({ action: 'create', resourceId })}>+ New Lesson</CreateButton>
      </TableHeader>
      <div>
        {map(lessons, l => {
          return <Lesson lesson={l} key={l._id} resourceId={resourceId} setModalState={modalController.set} />
        })}
      </div>
      <LessonModal controller={modalController} />
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
const BottomPadding = styled.div`
  height: 3.2rem;
  width: 100%;
  background: ${props => props.theme.primaryBackground};
`
