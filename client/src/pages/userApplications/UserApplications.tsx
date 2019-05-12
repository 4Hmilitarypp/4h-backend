import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IFullUserApplication } from '../../sharedTypes'
import UserApplication from './UserApplication'
import UserApplicationTable from './UserApplicationTable'
import useUserApplications, { TUpdateUserApplications } from './useUserApplications'

export interface IUserApplicationContext {
  userApplications: IFullUserApplication[]
  updateUserApplications: TUpdateUserApplications
  findById: (id: string) => IFullUserApplication | undefined
}
export const UserApplicationContext = React.createContext<IUserApplicationContext>(undefined as any)

const UserApplications: React.FC<RouteComponentProps> = () => {
  const { handleError, userApplications, updateUserApplications } = useUserApplications()

  const findById = (id: string) => (userApplications ? userApplications.find(r => r._id === id) : undefined)

  return (
    <UserApplicationContext.Provider value={{ userApplications, updateUserApplications, findById }}>
      {userApplications.length > 0 && <div data-testid="UserApplications" />}
      <Router>
        <UserApplicationTable path="/" />
        <UserApplication handleError={handleError} path="/:_id" />
      </Router>
    </UserApplicationContext.Provider>
  )
}
export default UserApplications
