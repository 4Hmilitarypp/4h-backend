import * as React from 'react'
import { flushEffects, render, waitForElement } from 'react-testing-library'
import EducatorResources from '../EducatorResources'
jest.mock('../../../utils/api')
import fakeApi from '../../../utils/api'
import generate from '../../../utils/generate'

beforeEach(() => (fakeApi as any).reset())

interface IProps {
  value: string
}

const setup = async (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)
  const resources = generate.resources(5)
  const resourcesMock = fakeApi.resources.get as any
  resourcesMock.mockImplementationOnce(() => Promise.resolve(resources))

  const utils = render(<EducatorResources {...props} />)
  flushEffects()

  await waitForElement(() => utils.getByTestId(/Resources/i))

  return {
    ...utils,
  }
}

it('should render', async () => {
  await setup()
})
