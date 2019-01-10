import * as React from 'react'
import { render } from 'react-testing-library'
import App from '../App'

interface IProps {
  value: string
}

const setup = (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)

  const utils = render(<App {...props} />)
  return {
    ...utils,
  }
}

it('should render', () => {
  setup()
})
