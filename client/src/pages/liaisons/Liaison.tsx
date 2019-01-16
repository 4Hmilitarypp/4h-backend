import * as React from 'react'
import styled from 'styled-components/macro'
import { TSetModalState } from '../../components/table/useTable'
import { ILiaison } from '../../sharedTypes'
import { hoveredRow } from '../../utils/mixins'

interface IProps {
  item: ILiaison
  setModalState: TSetModalState<ILiaison>
}

const Liaison: React.FC<IProps> = ({ item: liaison, setModalState }) => (
  <LiaisonWrapper onClick={() => setModalState({ action: 'update', item: liaison })}>
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
)

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
  color: ${props => props.theme.primaryGrey};
`
const Item = styled.span`
  display: block;
  font-weight: 500;
`
const Location = styled.div`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.lightGrey};
`
const SchoolLogo = styled.img`
  width: 100%;
  height: 8rem;
  object-fit: contain;
`
