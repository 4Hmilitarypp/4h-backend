import * as React from 'react'
import { render } from 'react-testing-library'
import Header from '../Header'

interface IProps {
  value: string
}

const setup = (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)

  const utils = render(<Header {...props} />)
  return {
    ...utils,
  }
}

it('should render', () => {
  setup()
})
