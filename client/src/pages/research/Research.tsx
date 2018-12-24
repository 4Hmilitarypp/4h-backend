import * as React from 'react'
import styled from 'styled-components/macro'
import { IResearch } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'
import ResearchModal from './ResearchModal'

const Research: React.FC<{ research: IResearch }> = ({ research }) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  return (
    <>
      <ResearchWrapper onClick={() => setModalOpen(true)}>
        <Title>{research.title}</Title>
      </ResearchWrapper>
      <ResearchModal open={modalOpen} setOpen={setModalOpen} research={research} action="update" />
    </>
  )
}

export default Research

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
