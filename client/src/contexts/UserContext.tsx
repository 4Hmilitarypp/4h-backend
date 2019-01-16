import * as React from 'react'

interface IUserState {
  email?: string
  name?: string
  permissions: string[]
}

export interface IUserContext {
  userState: IUserState
  login: () => void
  logout: () => void
}

const UserContext = React.createContext<IUserContext>(undefined as any)

export const useUser = () => {
  const initialState = { email: undefined, name: undefined, permissions: [] }
  const [userState] = React.useState<IUserState>(initialState)

  const login = () => null
  const logout = () => null

  return { userState, login, logout }
}

export default UserContext
