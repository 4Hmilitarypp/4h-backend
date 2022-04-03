import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import FlashContext from './contexts/FlashContext'

const Flash: React.FC<RouteComponentProps> = () => {
  const context = React.useContext(FlashContext)
  return (
    <>
      {!context.isError && context.message && (
        <ResponseSuccess data-testid="create-success">
          <Message>{context.message}</Message>
        </ResponseSuccess>
      )}
      {context.isError && context.message && (
        <ResponseError data-testid="create-error">
          <Message>{context.message}</Message>
          <Close onClick={context.reset}>X</Close>
        </ResponseError>
      )}
    </>
  )
}

export default Flash

const Message = styled.h3`
  font-size: 1.8rem;
  position: relative;
  text-align: center;
`

const Response = styled.div`
  padding: 2rem;
  position: fixed;
  margin: 0 auto;
  top: 7.6rem;
  right: 0;
  left: 0;
  z-index: 2000;
  background: ${props => props.theme.white};
  max-width: 60rem;
  border-radius: 5px;
`

const Close = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.black};
  font-size: 1.6rem;
  font-weight: 900;
  position: absolute;
  top: 5px;
  right: 7px;
  &:hover {
    cursor: pointer;
  }
`

const ResponseSuccess = styled(Response)`
  border: 5px solid ${props => props.theme.success};
`
const ResponseError = styled(Response)`
  border: 5px solid ${props => props.theme.warning};
`
