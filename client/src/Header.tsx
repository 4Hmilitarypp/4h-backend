import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button } from './components/Elements'
import SignInModal from './components/SignInModal'
import { useUser } from './contexts/UserContext'

const Header: React.FC<RouteComponentProps> = () => {
  const { user } = useUser()

  return (
    <HeaderWrapper>
      <ExternalLink>
        <Button as="a" href="https://4-hmpp-test.now.sh">
          View the Website
        </Button>
      </ExternalLink>
      <Title>4-HMPP CMS</Title>
      {user ? (
        <User>
          <Name>{user.name}</Name>
          <Button>Logout</Button>
        </User>
      ) : (
        <SignInModal>
          <Button>Login</Button>
        </SignInModal>
      )}
    </HeaderWrapper>
  )
}
export default Header

const HeaderWrapper = styled.header`
  background: ${props => props.theme.primary};
  color: ${props => props.theme.white};
  padding: 1.1rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 1000;
`
const ExternalLink = styled.div`
  width: 24rem;
  padding-left: 2rem;
`
const Title = styled.h1`
  font-size: 2.4rem;
`
const User = styled.div`
  width: 24rem;
  padding-right: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const Name = styled.span`
  padding-right: 2rem;
  font-size: 1.8rem;
`
