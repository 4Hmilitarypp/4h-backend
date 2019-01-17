import * as React from 'react'
import { render } from 'react-testing-library'
import UserContext from '../contexts/UserContext'
import Header from '../Header'

interface IProps {
  value: string
}

const setup = (propOverrides?: IProps) => {
  const user = undefined
  const login = (_: any) => Promise.resolve()
  const logout = () => Promise.resolve()
  const props = Object.assign({}, propOverrides)

  const utils = render(
    <>
      <UserContext.Provider value={{ user, login, logout }}>
        <Header {...props} />
      </UserContext.Provider>
    </>
  )
  return {
    ...utils,
  }
}

it('should render', () => {
  setup()
})
