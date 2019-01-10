import * as React from 'react'
import { flushEffects, render, waitForElement } from 'react-testing-library'
import Liaisons from '../Liaisons'
jest.mock('../../../utils/api')
import fakeApi from '../../../utils/api'
import generate from '../../../utils/generate'

beforeEach(() => (fakeApi as any).reset())

interface IProps {
  value: string
}

const setup = async (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)
  const liaisons = generate.liaisons(5)
  const liaisonsMock = fakeApi.liaisons.get as any
  liaisonsMock.mockImplementationOnce(() => Promise.resolve(liaisons))

  const utils = render(<Liaisons {...props} />)
  flushEffects()

  await waitForElement(() => utils.getByTestId('liaisons'))

  return {
    ...utils,
  }
}

it('should render', async () => {
  await setup()
})
