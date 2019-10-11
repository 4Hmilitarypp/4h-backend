import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Link } from './components/Elements'
import UserContext, { IUserContext } from './contexts/UserContext'
import { elevation } from './utils/mixins'

interface IConditionalLinkGroupProps {
  permissions: string[]
  userContext: IUserContext
}

const ConditionalLinkGroup: React.FC<IConditionalLinkGroupProps> = ({ children, permissions, userContext }) =>
  userContext.user && userContext.user.permissions.some(p => permissions.some(p2 => p2 === p)) ? (
    <LinkGroup>{children}</LinkGroup>
  ) : null
interface IActiveLinkProps {
  exact?: boolean
  path: string
  text: string
  to: string
}

const ActiveLink: React.FC<IActiveLinkProps> = ({ exact, path, text, to }) => {
  const isActive = exact ? path === to : path.includes(to)
  return (
    <SideBarLink to={to} className={isActive ? 'active' : ''}>
      {text}
    </SideBarLink>
  )
}

const Sidebar: React.FC<RouteComponentProps> = ({ location: { pathname: path = '' } = {} }: { location?: any }) => {
  const userContext = React.useContext(UserContext)
  return (
    <SidebarWrapper>
      <ConditionalLinkGroup permissions={['admin']} userContext={userContext}>
        <GroupHeader>Family Content</GroupHeader>
        <Links>
          <ActiveLink to="/camps" text="Camps" path={path} />
          <ActiveLink to="/partners" text="Partners" path={path} />
          <ActiveLink to="/liaisons" text="Liaisons" path={path} />
          <ActiveLink to="/latest-news" text="Latest News" path={path} />
        </Links>
      </ConditionalLinkGroup>
      <ConditionalLinkGroup permissions={['admin']} userContext={userContext}>
        <GroupHeader>Dynamic Pages</GroupHeader>
        <Links>
          <ActiveLink to="/page-info/home" text="Home" path={path} />
        </Links>
      </ConditionalLinkGroup>
      <ConditionalLinkGroup permissions={['admin']} userContext={userContext}>
        <GroupHeader>Resources</GroupHeader>
        <Links>
          <ActiveLink to="/webinars" text="Webinars" path={path} />
          <ActiveLink to="/research" text="Research" path={path} />
          <ActiveLink to="/educator-resources" text="Educator Resources" path={path} />
          <ActiveLink to="/tech-curriculum" text="Tech Curriculum" path={path} />
        </Links>
      </ConditionalLinkGroup>
      <ConditionalLinkGroup permissions={['admin']} userContext={userContext}>
        <GroupHeader>Website Admin</GroupHeader>
        <Links>
          <ActiveLink to="/admin/cloudinary-reports" text="Cloudinary Reports" path={path} />

          <ActiveLink to="/admin/users" text="Manage Users" path={path} />
        </Links>
      </ConditionalLinkGroup>
      <ConditionalLinkGroup permissions={['application-user', 'admin']} userContext={userContext}>
        <GroupHeader>Grant Applications</GroupHeader>
        <Links>
          <ActiveLink to="/applications" text="Applications" path={path} exact={true} />
          {userContext.user && userContext.user.permissions.includes('admin') && (
            <ActiveLink to="/applications-admin" text="Applications Admin" path={path} />
          )}
        </Links>
      </ConditionalLinkGroup>
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
