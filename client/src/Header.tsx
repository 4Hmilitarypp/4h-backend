import { RouteComponentProps } from '@reach/router'
// import { Link, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Link as A } from './components/Elements'
// import SignInModal from './components/SignInModal'
import UserContext from './contexts/UserContext'
import useErrorHandler from './hooks/useErrorHandler'
import { IApiError } from './sharedTypes'
import { media } from './utils/mixins'

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
      {userContext.isLoaded ? (
        <User>
          {userContext.user ? (
            <>
              <Name>{userContext.user.name}</Name>
              <CustomButton onClick={handleLogoutClicked}>Logout</CustomButton>
            </>
          ) : (
            <>
              {/* <Register as={Link} to="register">
                Register
              </Register> */}
              <Register
                as="a"
                href={`${process.env.REACT_APP_AWS_COGNITO_BASEURL}/login?client_id=${process.env.REACT_APP_AWS_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile+aws.cognito.signin.user.admin&redirect_uri=${process.env.REACT_APP_COGNITO_REDIRECT_URI}`}
              >
                Register
              </Register>
              <CustomButton
                as="a"
                href={`${process.env.REACT_APP_AWS_COGNITO_BASEURL}/login?client_id=${process.env.REACT_APP_AWS_COGNITO_CLIENT_ID}&response_type=code&scope=email+openid+profile+aws.cognito.signin.user.admin&redirect_uri=${process.env.REACT_APP_COGNITO_REDIRECT_URI}`}
              >
                Login
              </CustomButton>
            </>
          )}
        </User>
      ) : (
        <User />
      )}
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
  ${media.tabletPort`
    display: none;
  `}
`
const CustomA = styled(A)`
  color: ${props => props.theme.white};
`
const Title = styled.h1`
  font-size: 2.4rem;
  ${media.tabletPort`
    font-size: 1.8rem;
  `}
`
const User = styled.div`
  padding-right: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 30rem;
  ${media.tabletPort`
    padding-right: 0rem;
  `}
`
const Name = styled.span`
  padding-right: 2.4rem;
  font-size: 1.8rem;
`
const CustomButton = styled(Button)`
  color: ${props => props.theme.primary};
  background: ${props => props.theme.white};
  ${media.tabletPort`
  padding: .4rem .8rem;
  font-size: 1.6rem;
  `}
`
const Register = styled(CustomButton)`
  margin-right: 2rem;
`
