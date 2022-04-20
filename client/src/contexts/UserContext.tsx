import * as React from 'react'
import Cookies from 'universal-cookie'
import useErrorHandler from '../hooks/useErrorHandler'
// import { IApiError, IRegisterForm } from '../sharedTypes'
import api from '../utils/api'

interface IUserState {
  _id?: string
  email: string
  name: string
  permissions: string[]
}

export interface IUserContext {
  isLoaded: boolean
  login: (authCode: string) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  // register: (registerForm: IRegisterForm) => Promise<void>
  user?: IUserState
}

const UserContext = React.createContext<IUserContext>(undefined as any)

const getRefreshToken = () => {
  const cookies = new Cookies()
  return cookies.get('refreshToken')
}

const setAccessToken = (accessToken: string, expires_in: number) => {
  const cookies = new Cookies()
  cookies.set('token', accessToken, {
    path: '/',
    maxAge: expires_in,
    expires: new Date(new Date().getTime() + expires_in * 1000),
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
  })
}

const setRefreshToken = (refreshToken: string) => {
  const cookies = new Cookies()
  const oneYear = 60 * 60 * 24 * 365
  cookies.set('refreshToken', refreshToken, {
    path: '/',
    maxAge: oneYear,
    expires: new Date(new Date().getTime() + oneYear * 1000),
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
  })
}

export const useUser = () => {
  const [user, setUser] = React.useState<IUserContext['user'] | undefined>(undefined)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const handleError = useErrorHandler()

  React.useEffect(() => {
    const go = async () => {
      const [originalRef, authCode] = window.location.href.split('?code=')
      if (authCode) {
        await login(authCode)

        window.history.pushState({}, '', originalRef)
      } else {
        api.users
          .me()
          .then(u => {
            setUser(u)
            setIsLoaded(true)
          })
          .catch(err => {
            if (err.response.status === 401) {
              refreshAccessToken()
            } else {
              setIsLoaded(true)
              handleError(err)
            }
          })
      }
    }
    go()
  }, []) // eslint-disable-line

  const login: IUserContext['login'] = async (authCode: string) => {
    try {
      const tokenResult = await api.cognito.getTokenFromAuthCode(authCode)
      setAccessToken(tokenResult.access_token, tokenResult.expires_in)
      setRefreshToken(tokenResult.refresh_token)
      const userResult = await api.users.login(tokenResult.access_token)
      setUser(userResult)
      setIsLoaded(true)
    } catch (err) {
      setIsLoaded(true)
      handleError(err)
    }
  }

  const refreshAccessToken: IUserContext['refreshAccessToken'] = async () => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        throw new Error('Unauthorized')
      }
      const tokenResult = await api.cognito.getTokenFromRefreshToken(refreshToken)
      setAccessToken(tokenResult.access_token, tokenResult.expires_in)

      const user = await api.users.me()
      setUser(user)
      setIsLoaded(true)
    } catch (err) {
      setIsLoaded(true)
      handleError(err)
    }
  }

  const logout: IUserContext['logout'] = async () => {
    setUser(undefined)
    const cookies = new Cookies()
    cookies.remove('token')
    cookies.remove('refreshToken')
  }

  // const register: IUserContext['register'] = (registerForm: IRegisterForm) =>
  //   api.users
  //     .register(registerForm)
  //     .then((responseUser: IUser) => {
  //       setUser({ ...responseUser })
  //       setIsLoaded(true)
  //       return Promise.resolve()
  //     })
  //     .catch((err: IApiError) => {
  //       return Promise.reject(err)
  //     })

  // return { user, login, logout, register, isLoaded }
  return { user, login, logout, isLoaded, refreshAccessToken }
}

export default UserContext
