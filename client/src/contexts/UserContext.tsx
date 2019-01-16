import * as React from 'react'
import { IUser } from '../sharedTypes'

interface IUserState {
  email: string
  name: string
  permissions: string[]
  _id: string
}

export interface IUserContext {
  user?: IUserState
  login: (user: IUser) => void
  logout: () => void
}

const UserContext = React.createContext<IUserContext>(undefined as any)

export const useUser = () => {
  const [user, setUser] = React.useState<IUserState | undefined>(undefined)
  const login = (u: IUser) => setUser({ ...u })

  const logout = () => setUser(undefined)

  return { user, login, logout }
}

export default UserContext
