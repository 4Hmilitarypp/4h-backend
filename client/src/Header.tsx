import { Link, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Link as A } from './components/Elements'
import SignInModal from './components/SignInModal'
import UserContext from './contexts/UserContext'
import useErrorHandler from './hooks/useErrorHandler'
import { IApiError } from './sharedTypes'

const Header: React.FC<RouteComponentProps> = () => {
  const userContext = React.useContext(UserContext)
  const handleError = useErrorHandler()

  const handleLogoutClicked = () => {
    userContext.logout().catch((err: IApiError) => {
      handleError(err)
    })
  }

  return (
    <HeaderWrapper>
      <ExternalLink>
        <CustomA as="a" href="https://4-hmilitarypartnerships.org">
          View the Website
        </CustomA>
      </ExternalLink>
      <Title>4-HMPP CMS</Title>
      <User>
        {userContext.user ? (
          <>
            <Name>{userContext.user.name}</Name>
            <CustomButton onClick={handleLogoutClicked}>Logout</CustomButton>
          </>
        ) : (
          <>
            <Register as={Link} to="register">
              Register
            </Register>
            <SignInModal>
              <CustomButton>Login</CustomButton>
            </SignInModal>
          </>
        )}
      </User>
    </HeaderWrapper>
  )
}
export default Header

const HeaderWrapper = styled.header`
  background: ${props => props.theme.primary};
  color: ${props => props.theme.white};
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 1000;
`
const ExternalLink = styled.div`
  width: 26rem;
  padding-left: 2.4rem;
`
const CustomA = styled(A)`
  color: ${props => props.theme.white};
`
const Title = styled.h1`
  font-size: 2.4rem;
`
const User = styled.div`
  padding-right: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const Name = styled.span`
  padding-right: 2.4rem;
  font-size: 1.8rem;
`
const CustomButton = styled(Button)`
  color: ${props => props.theme.primary};
  background: ${props => props.theme.white};
`
const Register = styled(CustomButton)`
  margin-right: 2rem;
`
