import * as React from 'react'
import { fireEvent, render } from 'react-testing-library'
import SignInModal from '../SignInModal'

interface IProps {
  initialOpen: string
}

const setup = (propOverrides?: IProps) => {
  const props = Object.assign(
    {
      initialOpen: false,
    },
    propOverrides
  )

  const utils = render(
    <SignInModal {...props}>
      <button>Sign In</button>
    </SignInModal>
  )
  const button = utils.getByText(/sign in/i)
  return {
    ...utils,
    button,
  }
}

it('should render', () => {
  const { button } = setup()
  fireEvent.click(button)
  expect(/Enter your email and password/i).toBeDefined()
})
