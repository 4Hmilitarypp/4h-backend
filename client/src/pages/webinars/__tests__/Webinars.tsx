import * as React from 'react'
import { flushEffects, render, waitForElement } from 'react-testing-library'
import Webinars from '../Webinars'
jest.mock('../../../utils/api')
import fakeApi from '../../../utils/api'
import generate from '../../../utils/generate'

beforeEach(() => (fakeApi as any).reset())

interface IProps {
  value: string
}

const setup = async (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)
  const webinars = generate.webinars(5)
  const webinarsMock = fakeApi.webinars.get as any
  webinarsMock.mockImplementationOnce(() => Promise.resolve(webinars))

  const utils = render(<Webinars {...props} />)
  flushEffects()

  await waitForElement(() => utils.getByTestId(/Webinars/i))

  return {
    ...utils,
  }
}

it('should render', async () => {
  await setup()
})
