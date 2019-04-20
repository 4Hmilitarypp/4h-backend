import * as React from 'react'
import { render } from 'react-testing-library'
import Home from '../Home'

interface IProps {
  value: string
}

const setup = (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)

  const utils = render(<Home {...props} />)
  return {
    ...utils,
  }
}

it('should render', () => {
  setup()
})
