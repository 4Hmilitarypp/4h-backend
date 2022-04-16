import * as React from 'react'
import useErrorHandler from '../hooks/useErrorHandler'
import { IApiError, ILoginForm, IRegisterForm, IUser } from '../sharedTypes'
import api from '../utils/api'

interface IUserState {
  _id?: string
  email: string
  name: string
  permissions: string[]
}

export interface IUserContext {
  isLoaded: boolean
  login: (loginForm: ILoginForm) => Promise<void>
  logout: () => Promise<void>
  register: (registerForm: IRegisterForm) => Promise<void>
  user?: IUserState
}

const UserContext = React.createContext<IUserContext>(undefined as any)

export const useUser = () => {
  const [user, setUser] = React.useState<IUserContext['user'] | undefined>(undefined)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const handleError = useErrorHandler()

  React.useEffect(() => {
    const go = async () => {
      const [originalRef, idTokenParts] = window.location.href.split('#id_token=')
      console.log({ originalRef, idTokenParts })
      if (idTokenParts) {
        console.log({ userInUseEffectBegin: user, name: user?.name })
        const accessToken = idTokenParts?.split('&access_token=')?.[1]?.split('&expires_in=')?.[0]

        console.log({ originalRef, accessToken })

        try {
          const userResult = await api.users.login(accessToken)
          console.log({ userResult })
          setUser(userResult)
          setIsLoaded(true)
        } catch (err) {
          setIsLoaded(true)
          handleError(err)
        }

        // api.users
        //   .login(accessToken)
        //   .then(u => {
        //     setUser(u)
        //     setIsLoaded(true)
        //   })
        //   .catch(err => {
        //     setIsLoaded(true)
        //     handleError(err)
        //   })

        // window.history.pushState({}, '', originalRef)
      } else {
        console.log('calling users me')
        api.users
          .me()
          .then(u => {
            setUser(u)
            setIsLoaded(true)
          })
          .catch(err => {
            setIsLoaded(true)
            handleError(err)
          })
      }
    }
    go()
  }, []) // eslint-disable-line

  const login: IUserContext['login'] = (loginForm: ILoginForm) => {
    console.log({ loginForm })
    throw new Error('unemplemented')
  }
  // api.users
  //   .login(loginForm)
  //   .then((responseUser: IUser) => {
  //     setUser({ ...responseUser })
  //     setIsLoaded(true)
  //     return Promise.resolve()
  //   })
  //   .catch((err: IApiError) => {
  //     setIsLoaded(true)
  //     return Promise.reject(err)
  //   })

  const logout: IUserContext['logout'] = () =>
    api.users
      .logout()
      .then(() => {
        setUser(undefined)
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
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
        setIsLoaded(true)
        return Promise.resolve()
      })
      .catch((err: IApiError) => {
        return Promise.reject(err)
      })

  return { user, login, logout, register, isLoaded }
}

export default UserContext
