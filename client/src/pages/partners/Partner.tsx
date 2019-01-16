import * as React from 'react'
import styled from 'styled-components/macro'
import { TSetModalState } from '../../components/table/useTable'
import { IPartner } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'

interface IProps {
  item: IPartner
  setModalState: TSetModalState<IPartner>
}

const Partner: React.FC<IProps> = ({ item: partner, setModalState }) => (
  <Wrapper onClick={() => setModalState({ action: 'update', item: partner })}>
    <Title>{partner.title}</Title>
  </Wrapper>
)

export default Partner

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
