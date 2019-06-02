import * as React from 'react'
import styled from 'styled-components/macro'
import { ILesson } from '../../../../sharedTypes'
import { hoveredRow } from '../../../../utils/mixins'
import { TSetModalState } from './useLessons'

interface IProps {
  lesson: ILesson
  resourceId: string
  setModalState: TSetModalState
}

const Lesson: React.FC<IProps> = ({ lesson, setModalState, resourceId }) => (
  <Wrapper onClick={() => setModalState({ action: 'update', lesson, resourceId })}>
    <Title>{lesson.title}</Title>
    <NumberDisplay>
      {lesson.links.length} Link{lesson.links.length !== 1 && 's'}
    </NumberDisplay>
  </Wrapper>
)

export default Lesson

const Wrapper = styled.div`
  padding: 2rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const Title = styled.span`
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
const NumberDisplay = styled.span`
  padding-left: 3.2rem;
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
