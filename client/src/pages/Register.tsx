import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../clientTypes'
import { Button, InputGroup, P, SubHeading } from '../components/Elements'
import FlashContext from '../contexts/FlashContext'
import UserContext from '../contexts/UserContext'
import useErrorHandler from '../hooks/useErrorHandler'

const Register: React.FC<RouteComponentProps> = () => {
  const handleError = useErrorHandler()
  const userContext = React.useContext(UserContext)
  const flashContext = React.useContext(FlashContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()

    const { email, password, confirmPassword, name } = e.currentTarget.elements

    userContext
      .register({
        confirmPassword: confirmPassword.value,
        email: email.value,
        name: name.value,
        password: password.value,
      })
      .then(() => {
        flashContext.set({
          message:
            'You successfully registered. Feel free to browse around until you are granted access to update data',
        })
        navigate('/')
      })
      .catch(handleError)
  }

  return (
    <RegisterContainer>
      <SubHeading>Register for an account</SubHeading>
      <CustomP>Meredith or Suzie will approve your account and then you will be able to modify content</CustomP>
      <Form onSubmit={handleSubmit}>
        <CustomInputGroup>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" required={true} autoFocus={true} placeholder="Brianna Smith" />
        </CustomInputGroup>
        <CustomInputGroup>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required={true} autoFocus={true} placeholder="brianna.smith@example.com" />
        </CustomInputGroup>
        <CustomInputGroup>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required={true} />
        </CustomInputGroup>
        <CustomInputGroup>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" required={true} />
        </CustomInputGroup>
        <MyButton type="submit">Sign In</MyButton>
      </Form>
    </RegisterContainer>
  )
}
export default Register

const RegisterContainer = styled.div`
  padding: 1rem;
`
const CustomP = styled(P)`
  text-align: center;
`
const Form = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  max-width: 40rem;
  margin: 0 auto;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`

const MyButton = styled(Button)`
  padding: 1.2rem 2.5rem;
  margin-top: 1.2rem;
  align-self: center;
`
