import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading } from '../components/Elements'

const NotFound: React.FC<RouteComponentProps> = () => {
  return (
    <NotFoundContainer>
      <Heading>Oops... We couldn't find the page you're looking for</Heading>
    </NotFoundContainer>
  )
}
export default NotFound

const NotFoundContainer = styled.div`
  padding: 2rem;
`
