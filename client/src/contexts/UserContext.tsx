import * as React from 'react'
// import useErrorHandler from '../hooks/useErrorHandler'
import { IApiError, ILoginForm, IRegisterForm, IUser } from '../sharedTypes'
import api from '../utils/api'

interface IUserState {
  email: string
  name: string
  permissions: string[]
  _id: string
}

export interface IUserContext {
  login: (loginForm: ILoginForm) => Promise<void>
  logout: () => Promise<void>
  register: (registerForm: IRegisterForm) => Promise<void>
  user?: IUserState
}

const UserContext = React.createContext<IUserContext>(undefined as any)

export const useUser = () => {
  const [user, setUser] = React.useState<IUserContext['user'] | undefined>(undefined)

  React.useEffect(() => {
    api.users
      .me()
      .then(u => setUser(u))
      .catch(console.error)
  }, [])

  const login: IUserContext['login'] = (loginForm: ILoginForm) =>
    api.users
      .login(loginForm)
      .then((responseUser: IUser) => {
        setUser({ ...responseUser })
        return Promise.resolve()
      })
      .catch((err: IApiError) => {
        return Promise.reject(err)
      })

  const logout: IUserContext['logout'] = () =>
    api.users
      .logout()
      .then(() => {
        setUser(undefined)
        return Promise.resolve()
      })
      .catch((err: IApiError) => {
        return Promise.reject(err)
      })

  const register: IUserContext['register'] = (registerForm: IRegisterForm) =>
    api.users
      .register(registerForm)
      .then((responseUser: IUser) => {
        setUser({ ...responseUser })
        return Promise.resolve()
      })
      .catch((err: IApiError) => {
        return Promise.reject(err)
      })

  return { user, login, logout, register }
}

export default UserContext
