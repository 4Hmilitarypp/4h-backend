import * as React from 'react'
import styled from 'styled-components/macro'
import { ILiaison } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'
import LiaisonModal from './LiaisonModal'

const Liaison: React.FC<{ liaison: ILiaison }> = ({ liaison }) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  return (
    <>
      <LiaisonWrapper onClick={() => setModalOpen(true)}>
        <NameAndLocation>
          <Name>{liaison.name}</Name>
          <Location>{`${liaison.region} (${liaison.abbreviation || 'None'})`}</Location>
        </NameAndLocation>
        <Contact>
          <Item>{liaison.email}</Item>
          <Item>{liaison.phoneNumber}</Item>
        </Contact>
        <SchoolLogo src={liaison.image} alt={`${liaison.region} Land Grand University Logo`} />
      </LiaisonWrapper>
      <LiaisonModal open={modalOpen} setOpen={setModalOpen} liaison={liaison} action="update" />
    </>
  )
}

export default Liaison

const LiaisonWrapper = styled.div`
  display: grid;
  align-items: center;
  justify-content: left;
  padding: 2rem;
  width: 100%;
  grid-template-columns: 1fr minmax(25rem, 1fr) 2fr;
  column-gap: 2rem;
  position: relative;
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.white};
  }
`
const NameAndLocation = styled.div``
const Contact = styled.div`
  display: inline-block;
`
const Name = styled.span`
  font-weight: 700;
  display: block;
`
const Item = styled.span`
  display: block;
  font-weight: 500;
`
const Location = styled.div`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.lightGray};
`
const SchoolLogo = styled.img`
  width: 100%;
  height: 8rem;
  object-fit: contain;
`
