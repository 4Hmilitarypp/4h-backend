import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading, Link, P, Section } from '../../components/Elements'

const AdminHome: React.FC<RouteComponentProps> = () => {
  return (
    <AdminContainer>
      <Heading>Admin Dashboard</Heading>
      <Section>
        <P>
          <Link to="cloudinary-reports">Cloudinary Reports</Link>
        </P>
        <P>
          <Link to="users">Manage Users</Link>
        </P>
        <P>
          <Link to="/applications-admin">Applications Admin Dashboard</Link>
        </P>
      </Section>
    </AdminContainer>
  )
}
export default AdminHome

const AdminContainer = styled.div`
  padding: 1rem;
`
