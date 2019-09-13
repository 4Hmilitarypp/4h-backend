import { RouteComponentProps, Router } from '@reach/router'
import * as React from 'react'
import usePermission from '../../hooks/usePermission'
import AdminUserApplicationsByBase from './adminUserApplications/AdminUserApplicationsByBase'
import AdminUserApplicationsByUser from './adminUserApplications/AdminUserApplicationsByUser'
import ApplicationDashboard from './ApplicationDashboard'
import BaseApplications from './baseApplications/BaseApplications'

const ApplicationsAdmin: React.FC<RouteComponentProps> = () => {
  React.useEffect(() => window.scrollTo(0, 0), [])
  usePermission('admin')
  return (
    <Router>
      <ApplicationDashboard path="/" />
      <AdminUserApplicationsByUser path="user/:refId/*" />
      <AdminUserApplicationsByBase path="base/:refId/*" />
      <BaseApplications path="applications/*" />
    </Router>
  )
}
export default ApplicationsAdmin
