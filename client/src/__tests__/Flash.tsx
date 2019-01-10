import * as React from 'react'
import { render } from 'react-testing-library'
import FlashContext, { useFlash } from '../contexts/FlashContext'
import Flash from '../Flash'

interface IProps {
  value: string
}

const Comp: React.FC<IProps> = () => {
  const { flashState, resetFlashState, setFlashState } = useFlash()

  return (
    <FlashContext.Provider value={{ ...flashState, reset: resetFlashState, set: setFlashState }}>
      <Flash />
    </FlashContext.Provider>
  )
}

const setup = (propOverrides?: IProps) => {
  const props = Object.assign({}, propOverrides)

  const utils = render(<Comp {...props} />)
  return {
    ...utils,
  }
}

it('should render', () => {
  setup()
})
