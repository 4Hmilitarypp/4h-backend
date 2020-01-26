import { format } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import { ICampDate } from '../../../sharedTypes'
import { hoveredRow } from '../../../utils/mixins'
import { TSetModalState } from './useCampDates'

interface IProps {
  campDate: ICampDate
  campId: string
  setModalState: TSetModalState
}

const CampDate: React.FC<IProps> = ({ campDate, setModalState, campId }) => (
  <Wrapper onClick={() => setModalState({ action: 'update', campDate, campId })}>
    <Title>{`${format(new Date(campDate.beginDate), 'MMMM d yyyy')} to ${format(
      new Date(campDate.endDate),
      'MMMM d yyyy'
    )}`}</Title>
  </Wrapper>
)

export default CampDate

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
