import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import usePermission from '../../hooks/useRole'
import AdminHome from './AdminHome'
import CloudinaryReports from './CloudinaryReports'
import Users from './users/Users'

const Admin: React.FC<RouteComponentProps> = () => {
  React.useEffect(() => window.scrollTo(0, 0), [])
  usePermission('admin')

  return (
    <Router>
      <AdminHome path="/" />
      <CloudinaryReports path="cloudinary-reports" />
      <Users path="users" />
    </Router>
  )
}
export default Admin
