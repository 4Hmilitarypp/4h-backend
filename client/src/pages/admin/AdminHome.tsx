import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading, Link, Section } from '../../components/Elements'

const AdminHome: React.FC<RouteComponentProps> = () => {
  return (
    <AdminContainer>
      <Heading>Admin Dashboard</Heading>
      <Section>
        <Link to="cloudinary-reports">Cloudinary Reports</Link>
      </Section>
    </AdminContainer>
  )
}
export default AdminHome

const AdminContainer = styled.div`
  padding: 1rem;
`
