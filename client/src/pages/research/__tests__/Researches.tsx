import * as React from 'react'
import { flushEffects, render, waitForElement } from 'react-testing-library'
import Researches from '../Researches'
import fakeApi from '../../../utils/api'
import generate from '../../../utils/generate'
jest.mock('../../../utils/api')

beforeEach(() => (fakeApi as any).reset())

interface IProps {
  value: string
}

const setup = async (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)
  const researches = generate.researches(5)
  const researchMock = fakeApi.research.get as any
  researchMock.mockImplementationOnce(() => Promise.resolve(researches))

  const utils = render(<Researches {...props} />)
  flushEffects()

  await waitForElement(() => utils.getByTestId(/Researches/i))

  return {
    ...utils,
  }
}

it('should render', async () => {
  await setup()
})
