import { navigate, RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import UserContext from '../../contexts/UserContext'
import AdminHome from './AdminHome'
import CloudinaryReports from './CloudinaryReports'

const Admin: React.FC<RouteComponentProps> = () => {
  React.useEffect(() => window.scrollTo(0, 0), [])
  const userContext = React.useContext(UserContext)

  React.useEffect(() => {
    if (!userContext.user || !userContext.user.permissions.includes('admin')) navigate('../')
  }, [userContext.user])
  return (
    <Router>
      <AdminHome path="/" />
      <CloudinaryReports path="cloudinary-reports" />
    </Router>
  )
}
export default Admin
