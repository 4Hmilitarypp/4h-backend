import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Link } from './components/Elements'
import UserContext from './contexts/UserContext'
import { elevation } from './utils/mixins'

const Sidebar: React.FC<RouteComponentProps> = ({ location: { pathname: path = '' } = {} }: { location?: any }) => {
  const userContext = React.useContext(UserContext)
  return (
    <SidebarWrapper>
      {userContext.user && userContext.user.permissions.includes('admin') && (
        <LinkGroup>
          <GroupHeader>Family Content</GroupHeader>
          <Links>
            <SideBarLink to="/camps" className={path.includes('/camps') ? 'active' : ''}>
              Camps
            </SideBarLink>
            <SideBarLink to="/partners" className={path.includes('/partners') ? 'active' : ''}>
              Partners
            </SideBarLink>
            <SideBarLink to="/liaisons" className={path.includes('/liaisons') ? 'active' : ''}>
              Liaisons
            </SideBarLink>
          </Links>
        </LinkGroup>
      )}
      {userContext.user && userContext.user.permissions.includes('admin') && (
        <LinkGroup>
          <GroupHeader>Dynamic Pages</GroupHeader>
          <Links>
            <SideBarLink to="/page-info/home" className={path.includes('/page-info/home') ? 'active' : ''}>
              Home
            </SideBarLink>
          </Links>
        </LinkGroup>
      )}
      {userContext.user && userContext.user.permissions.includes('admin') && (
        <LinkGroup>
          <GroupHeader>Resources</GroupHeader>
          <Links>
            <SideBarLink to="/webinars" className={path.includes('/webinars') ? 'active' : ''}>
              Webinars
            </SideBarLink>
            <SideBarLink to="/research" className={path.includes('/research') ? 'active' : ''}>
              Research
            </SideBarLink>
            <SideBarLink to="/educator-resources" className={path.includes('/educator-resources') ? 'active' : ''}>
              Educator Resources
            </SideBarLink>
          </Links>
        </LinkGroup>
      )}
      {userContext.user && userContext.user.permissions.includes('admin') && (
        <LinkGroup>
          <GroupHeader>Website Admin</GroupHeader>
          <Links>
            <SideBarLink
              to="/admin/cloudinary-reports"
              className={path.includes('/admin/cloudinary-reports') ? 'active' : ''}
            >
              Cloudinary Reports
            </SideBarLink>
            <SideBarLink to="/admin/users" className={path.includes('/admin/users') ? 'active' : ''}>
              Manage Users
            </SideBarLink>
          </Links>
        </LinkGroup>
      )}
      {userContext.user &&
        (userContext.user.permissions.includes('admin') ||
          userContext.user.permissions.includes('application-user')) && (
          <LinkGroup>
            <GroupHeader>Grant Applications</GroupHeader>
            <Links>
              <SideBarLink
                to="/applications"
                className={path.includes('/applications') && !path.includes('/applications-admin') ? 'active' : ''}
              >
                Applications
              </SideBarLink>
              {userContext.user.permissions.includes('admin') && (
                <SideBarLink to="/applications-admin" className={path.includes('/applications-admin') ? 'active' : ''}>
                  Applications Admin
                </SideBarLink>
              )}
            </Links>
          </LinkGroup>
        )}
    </SidebarWrapper>
  )
}
export default Sidebar

const SidebarWrapper = styled.div`
  background: ${props => props.theme.white};
  padding: 2rem 2rem 6rem;
  height: 100%;
  overflow-y: auto;
  width: 24rem;
  position: fixed;
  z-index: 10;
  ${elevation(3)};
`

const LinkGroup = styled.nav`
  padding: 1.2rem 0;
`
const GroupHeader = styled.h4`
  color: ${props => props.theme.primaryGrey};
`
const Links = styled.div`
  padding: 0 0.8rem;
`
const SideBarLink = styled(Link)`
  display: block;
  color: ${props => props.theme.black};
  &.active {
    background: ${props => props.theme.inputGray};
    margin: 0 -2.8rem;
    padding: 0.4rem 2.2rem;
    border-left: 0.6rem solid ${props => props.theme.primary};
  }
  padding: 0.4rem 0;
`
