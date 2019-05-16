import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import { IFullUserApplication } from '../../../sharedTypes'
import AdminUserApplication from './AdminUserApplication'
import AdminUserApplicationTableByBase from './AdminUserApplicationTableByBase'
import useAdminUserApplications, { TUpdateAdminUserApplications } from './useAdminUserApplications'

export interface IAdminUserApplicationContextByBase {
  isLoaded: boolean
  adminUserApplications: IFullUserApplication[]
  updateAdminUserApplications: TUpdateAdminUserApplications
  findById: (id: string) => IFullUserApplication | undefined
}
export const AdminUserApplicationContextByBase = React.createContext<IAdminUserApplicationContextByBase>(
  undefined as any
)

interface IProps extends RouteComponentProps {
  refId?: string
}

const AdminUserApplications: React.FC<IProps> = ({ refId }) => {
  const { handleError, adminUserApplications, updateAdminUserApplications } = useAdminUserApplications(
    'base',
    refId as string
  )

  const findById = (id: string) => (adminUserApplications ? adminUserApplications.find(r => r._id === id) : undefined)

  return (
    <AdminUserApplicationContextByBase.Provider
      value={{ isLoaded: false, adminUserApplications, updateAdminUserApplications, findById }}
    >
      {adminUserApplications.length > 0 && <div data-testid="AdminUserApplications" />}
      <Router>
        <AdminUserApplicationTableByBase path="/" />
        <AdminUserApplication handleError={handleError} path="/:_id" refId={refId} type="base" />
      </Router>
    </AdminUserApplicationContextByBase.Provider>
  )
}
export default AdminUserApplications
