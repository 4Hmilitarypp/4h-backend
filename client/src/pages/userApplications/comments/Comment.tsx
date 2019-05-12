import * as React from 'react'
import styled from 'styled-components/macro'
import { IComment } from '../../../sharedTypes'
import { hoveredRow } from '../../../utils/mixins'
import { TSetModalState } from './useComments'

interface IProps {
  comment: IComment
  applicationId: string
  setModalState: TSetModalState
}

const Comment: React.FC<IProps> = ({ comment, setModalState, applicationId }) => (
  <Wrapper onClick={() => setModalState({ action: 'update', comment, applicationId })}>
    <Title>{`${comment.text} ${comment.user}`}</Title>
  </Wrapper>
)

export default Comment

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
  color: ${props => props.theme.primaryGrey};
`
