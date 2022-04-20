// import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../clientTypes'
// import UserContext from '../contexts/UserContext'
// import useErrorHandler from '../hooks/useErrorHandler'
// import { IApiError } from '../sharedTypes'
import { Button, InputGroup } from './Elements'
import Modal from './Modal'

interface IProps {
  initialOpen?: boolean
}

const SignInModal: React.FC<IProps> = ({ children, initialOpen = false }) => {
  // const handleError = useErrorHandler()
  const [open, setOpen] = React.useState<boolean>(initialOpen)
  const [password, setPassword] = React.useState<string>('')
  // const userContext = React.useContext(UserContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()

    // const { email: submittedEmail, password: submittedPassword } = e.currentTarget.elements

    // userContext
    //   .login({
    //     email: submittedEmail.value,
    //     password: submittedPassword.value,
    //   })
    //   .catch((err: IApiError) => {
    //     setPassword('')
    //     handleError(err, 'login')
    //   })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPassword(e.target.value)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal open={open} setOpen={setOpen}>
        <Header>
          <Heading>Enter your email and password</Heading>
        </Header>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required={true} autoFocus={true} placeholder="brianna.smith@example.com" />
          </InputGroup>
          <InputGroup>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required={true}
              value={password}
              onChange={handlePasswordChange}
              placeholder="password"
            />
          </InputGroup>
          <MyButton type="submit">Sign In</MyButton>
        </Form>
      </Modal>
    </>
  )
}

export default SignInModal

const Header = styled.div`
  background: ${props => props.theme.primaryGrey};
  padding: 0.7rem 2rem;
`
const Heading = styled.h2`
  text-align: center;
  color: ${props => props.theme.white};
  font-size: 2.2rem;
`
const Form = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`
const MyButton = styled(Button)`
  padding: 1.2rem 2.5rem;
  margin-top: 1.2rem;
  align-self: center;
`
