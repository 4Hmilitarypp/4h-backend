import * as React from 'react'
import styled from 'styled-components/macro'
import { IReport } from '../../../sharedTypes'
import { hoveredRow } from '../../../utils/mixins'
import { TSetModalState } from './useReports'

interface IProps {
  report: IReport
  partnerId: string
  setModalState: TSetModalState
}

const Report: React.FC<IProps> = ({ report, setModalState, partnerId }) => (
  <Wrapper onClick={() => setModalState({ action: 'update', report, partnerId })}>
    <Title>{report.title}</Title>
  </Wrapper>
)

export default Report

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
