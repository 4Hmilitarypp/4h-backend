import * as React from 'react'
import { render } from 'react-testing-library'
import App from '../App'
import fakeApi from '../utils/api'
jest.mock('../utils/api')
beforeEach(() => (fakeApi as any).reset())

const setup = (propOverrides?: {}) => {
  const props = Object.assign({}, propOverrides)

  const usersMock = fakeApi.webinars.get as any
  usersMock.mockImplementationOnce(() => Promise.resolve())

  const utils = render(<App {...props} />)
  return {
    ...utils,
  }
}

it('should render', () => {
  setup()
})
