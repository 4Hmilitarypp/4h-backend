import * as React from 'react'
import styled from 'styled-components/macro'
import { TSetModalState } from '../../../components/table/useTable'
import { IUser } from '../../../sharedTypes'
import { hoveredRow } from '../../../utils/mixins'

interface IProps {
  user: IUser
  setModalState: TSetModalState<IUser>
}

const User: React.FC<IProps> = ({ user, setModalState }) => (
  <UserWrapper onClick={() => setModalState({ action: 'update', item: user })}>
    <NameAndEmail>
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
    </NameAndEmail>
    <PermissionsSection>
      <Name>Permissions:</Name>
      <Permissions>
        {user.permissions.map((permission, index) => (
          <Item key={permission}>
            {index > 0 && ', '}
            {permission}
          </Item>
        ))}
      </Permissions>
    </PermissionsSection>
    <NameAndEmail>
      <Name>Affiliation:</Name>
      <Email>{user.affiliation}</Email>
    </NameAndEmail>
  </UserWrapper>
)

export default User

const UserWrapper = styled.div`
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
const NameAndEmail = styled.div``
const PermissionsSection = styled.div`
  display: inline-block;
`
const Permissions = styled.div``
const Name = styled.span`
  font-weight: 700;
  display: block;
  color: ${props => props.theme.primaryGrey};
`
const Item = styled.span`
  font-weight: 500;
  color: ${props => props.theme.lightGrey};
`
const Email = styled.div`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.lightGrey};
`
