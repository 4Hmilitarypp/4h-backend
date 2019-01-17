import * as React from 'react'
import styled from 'styled-components/macro'
import { TSetModalState } from '../../components/table/useTable'
import { IWebinar } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'

interface IProps {
  webinar: IWebinar
  setModalState: TSetModalState<IWebinar>
}

const Webinar: React.FC<IProps> = ({ webinar, setModalState }) => (
  <Wrapper onClick={() => setModalState({ action: 'update', item: webinar })}>
    <Title>{webinar.title}</Title>
  </Wrapper>
)

export default Webinar

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
