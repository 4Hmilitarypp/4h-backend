import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../clientTypes'
import { A, Button, InputGroup, P, SubHeading } from '../components/Elements'
import FlashContext from '../contexts/FlashContext'
import UserContext from '../contexts/UserContext'
import useErrorHandler from '../hooks/useErrorHandler'
import api from '../utils/api'

const loadCaptcha = () => {
  const captchaScript = document.createElement('script')
  captchaScript.src = 'https://www.google.com/recaptcha/api.js?render=6LczLYsUAAAAAJ7UgMGSvCG-fCe9Q6seQrVIvLl9'
  captchaScript.type = 'text/javascript'
  document.body.appendChild(captchaScript)
}

const checkIfSpam = async () => {
  const token = await (window as any).grecaptcha.execute('6LczLYsUAAAAAJ7UgMGSvCG-fCe9Q6seQrVIvLl9', {
    action: 'register',
  })
  const isSpam = await api.users.checkIfSpam(token)
  return isSpam
}

const Register: React.FC<RouteComponentProps> = () => {
  const handleError = useErrorHandler()
  const userContext = React.useContext(UserContext)
  const flashContext = React.useContext(FlashContext)

  React.useEffect(() => loadCaptcha(), [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()

    const { email, password, confirmPassword, name } = e.currentTarget.elements

    try {
      const isSpam = await checkIfSpam()
      if (isSpam) {
        userContext.logout()
        return flashContext.set({ message: 'you failed to pass the captcha test, please try again', isError: true })
      }
    } catch (err) {
      return handleError(err)
    }

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
      {/* {getCaptcha()} */}
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
        <P>
          This site is protected by reCAPTCHA and the Google
          <A href="https://policies.google.com/privacy"> Privacy Policy</A> and
          <A href="https://policies.google.com/terms"> Terms of Service</A> apply.
        </P>
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
