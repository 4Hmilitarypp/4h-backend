import * as React from 'react'
import styled from 'styled-components/macro'
import { IWebinar } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'
import WebinarModal from './WebinarModal'

const Webinar: React.FC<{ webinar: IWebinar }> = ({ webinar }) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  return (
    <>
      <Wrapper onClick={() => setModalOpen(true)}>
        <Title>{webinar.title}</Title>
      </Wrapper>
      <WebinarModal open={modalOpen} setOpen={setModalOpen} webinar={webinar} action="update" />
    </>
  )
}

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
