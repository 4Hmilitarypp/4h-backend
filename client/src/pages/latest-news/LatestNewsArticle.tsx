import * as React from 'react'
import styled from 'styled-components/macro'
import { TSetModalState } from '../../components/table/useTable'
import { IResearch } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'

interface IProps {
  research: IResearch
  setModalState: TSetModalState<IResearch>
}

const LatestNewsArticle: React.FC<IProps> = ({ research, setModalState }) => (
  <ResearchWrapper onClick={() => setModalState({ action: 'update', item: research })}>
    <Title>{research.title}</Title>
  </ResearchWrapper>
)

export default LatestNewsArticle

const ResearchWrapper = styled.div`
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
