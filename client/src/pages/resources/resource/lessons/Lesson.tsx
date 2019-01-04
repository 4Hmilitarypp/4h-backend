import * as React from 'react'
import styled from 'styled-components/macro'
import { ILesson } from '../../../../sharedTypes'
import { hoveredRow } from '../../../../utils/mixins'
import LessonModal from './LessonModal'

const Lesson: React.FC<{ lesson: ILesson }> = ({ lesson }) => {
  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <>
      <Wrapper onClick={() => setModalOpen(true)}>
        <Title>{lesson.title}</Title>
      </Wrapper>
      {modalOpen && <LessonModal open={modalOpen} setOpen={setModalOpen} lesson={lesson} action="update" />}
    </>
  )
}

export default Lesson

const Wrapper = styled.div`
  padding: 2rem;
  position: relative;
  ${hoveredRow()};
  &:nth-child(2n) {
    background: ${props => props.theme.white};
  }
`
const Title = styled.span`
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
