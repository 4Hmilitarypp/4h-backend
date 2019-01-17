import * as React from 'react'
// import useErrorHandler from '../hooks/useErrorHandler'
import { IApiError, ILoginForm, IUser } from '../sharedTypes'
import api from '../utils/api'

interface IUserState {
  email: string
  name: string
  permissions: string[]
  _id: string
}

export interface IUserContext {
  user?: IUserState
  login: (loginForm: ILoginForm) => Promise<void>
  logout: () => Promise<void>
}

const UserContext = React.createContext<IUserContext>(undefined as any)

export const useUser = () => {
  const [user, setUser] = React.useState<IUserState | undefined>(undefined)

  React.useEffect(() => {
    api.users
      .me()
      .then(u => setUser(u))
      .catch(console.error)
  }, [])

  const login = (loginForm: ILoginForm) => {
    return api.users
      .login(loginForm)
      .then((responseUser: IUser) => {
        setUser({ ...responseUser })
        return Promise.resolve()
      })
      .catch((err: IApiError) => {
        return Promise.reject(err)
      })
  }

  const logout = () => {
    return api.users
      .logout()
      .then(() => {
        setUser(undefined)
        return Promise.resolve()
      })
      .catch((err: IApiError) => {
        return Promise.reject(err)
      })
  }

  return { user, login, logout }
}

export default UserContext
