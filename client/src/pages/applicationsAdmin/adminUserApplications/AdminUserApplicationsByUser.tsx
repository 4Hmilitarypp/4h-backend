import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IFullUserApplication } from '../../../sharedTypes'
import AdminUserApplication from './AdminUserApplication'
import AdminUserApplicationTableByUser from './AdminUserApplicationTableByUser'
import useAdminUserApplications, { TUpdateAdminUserApplications } from './useAdminUserApplications'

export interface IAdminUserApplicationContextByUser {
  isLoaded: boolean
  adminUserApplications: IFullUserApplication[]
  updateAdminUserApplications: TUpdateAdminUserApplications
  findById: (id: string) => IFullUserApplication | undefined
}
export const AdminUserApplicationContextByUser = React.createContext<IAdminUserApplicationContextByUser>(
  undefined as any
)

interface IProps extends RouteComponentProps {
  refId?: string
}

const AdminUserApplications: React.FC<IProps> = ({ refId }) => {
  const { handleError, adminUserApplications, updateAdminUserApplications } = useAdminUserApplications(
    'user',
    refId as string
  )

  const findById = (id: string) => (adminUserApplications ? adminUserApplications.find(r => r._id === id) : undefined)

  return (
    <AdminUserApplicationContextByUser.Provider
      value={{ isLoaded: false, adminUserApplications, updateAdminUserApplications, findById }}
    >
      {adminUserApplications.length > 0 && <div data-testid="AdminUserApplications" />}
      <Router>
        <AdminUserApplicationTableByUser path="/" />
        <AdminUserApplication handleError={handleError} path="/:_id" refId={refId} type="user" />
      </Router>
    </AdminUserApplicationContextByUser.Provider>
  )
}
export default AdminUserApplications
