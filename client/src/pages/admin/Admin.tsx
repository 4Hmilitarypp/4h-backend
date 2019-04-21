import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import AdminHome from './AdminHome'
import CloudinaryReports from './CloudinaryReports'

const Admin: React.FC<RouteComponentProps> = () => {
  React.useEffect(() => window.scrollTo(0, 0), [])
  return (
    <Router>
      <AdminHome path="/" />
      <CloudinaryReports path="cloudinary-reports" />
    </Router>
  )
}
export default Admin
