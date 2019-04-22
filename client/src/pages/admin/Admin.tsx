import { navigate, RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import UserContext from '../../contexts/UserContext'
import AdminHome from './AdminHome'
import CloudinaryReports from './CloudinaryReports'
import Users from './users/Users'

const Admin: React.FC<RouteComponentProps> = () => {
  React.useEffect(() => window.scrollTo(0, 0), [])
  const userContext = React.useContext(UserContext)

  React.useEffect(() => {
    if (userContext.isLoaded) {
      if (!userContext.user || !userContext.user.permissions.includes('admin')) navigate('../')
    }
  }, [userContext.user, userContext.isLoaded])

  return (
    <Router>
      <AdminHome path="/" />
      <CloudinaryReports path="cloudinary-reports" />
      <Users path="users" />
    </Router>
  )
}
export default Admin
