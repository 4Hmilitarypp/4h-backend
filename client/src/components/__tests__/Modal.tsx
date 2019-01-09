import * as faker from 'faker'
import * as React from 'react'
import { fireEvent, getByTestId as globalGetByTestId, render, waitForElement } from 'react-testing-library'
import Modal from '../Modal'

beforeAll(async () => {
  const body = document.querySelector('body') as HTMLBodyElement
  const portal = document.createElement('div')
  portal.setAttribute('id', 'portal')
  portal.setAttribute('data-testid', 'portal')
  body.appendChild(portal)

  await waitForElement(() => globalGetByTestId(body, 'portal'))
})

const setup = ({ open }: { open: boolean }) => {
  const fakeChildrenText = faker.random.words(3)
  const testSetOpen = (openToSet: boolean) => {
    utils.rerender(<Modal open={openToSet} setOpen={testSetOpen} children={fakeChildrenText} />)
  }

  const utils = render(<Modal open={open} setOpen={testSetOpen} children={fakeChildrenText} />)
  return {
    ...utils,
    fakeChildrenText,
  }
}

it('should not show children if on is false', () => {
  const { fakeChildrenText, queryByText } = setup({ open: false })
  expect(queryByText(fakeChildrenText)).toBeNull()
})
it('should show children if on is true', () => {
  const { fakeChildrenText, getByText } = setup({ open: true })
  expect(getByText(fakeChildrenText)).toBeDefined()
})
it('the modal should close when the close button is clicked', () => {
  const { fakeChildrenText, getByTestId, getByText, queryByText } = setup({ open: true })
  expect(getByText(fakeChildrenText)).toBeDefined()
  fireEvent.click(getByTestId('close-button'))
  expect(queryByText(fakeChildrenText)).toBeNull()
})
it('the modal should close when the background is clicked', () => {
  const { fakeChildrenText, getByTestId, getByText, queryByText } = setup({ open: true })
  expect(getByText(fakeChildrenText)).toBeDefined()
  fireEvent.click(getByTestId('background'))
  expect(queryByText(fakeChildrenText)).toBeNull()
})
