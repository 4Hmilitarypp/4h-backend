import { navigate, RouteComponentProps } from '@reach/router'
import { format } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Heading, Link, P, Section, SubHeading } from '../../components/Elements'
import Modal from '../../components/Modal'
import useErrorHandler from '../../hooks/useErrorHandler'
import api from '../../utils/api'
import { hoveredRow } from '../../utils/mixins'

const ApplicationDashboard: React.FC<RouteComponentProps> = () => {
  const [users, setUsers] = React.useState<any[]>([])
  const [baseApplications, setBaseApplications] = React.useState<any[]>([])
  const [open, setOpen] = React.useState(false)
  const [reviewType, setReviewType] = React.useState<'user' | 'base'>('user')

  const handleError = useErrorHandler()

  React.useEffect(() => {
    api.users
      .getApplicationUserIds()
      .then(u => setUsers(u))
      .catch(handleError)
    api.applications
      .getIds()
      .then(a => setBaseApplications(a))
      .catch(handleError)
  }, [])

  const handleClick = (type: 'user' | 'base') => {
    setReviewType(type)
    setOpen(true)
  }

  const handleSelect = (id: string) => {
    navigate(`applications-admin/${reviewType}/${id}`)
  }

  return (
    <ApplicationDashboardContainer>
      <Modal open={open} setOpen={setOpen}>
        <ModalWrapper>
          <SubHeading>Select {reviewType === 'user' ? 'A User' : 'An Application'}</SubHeading>
          {reviewType === 'user'
            ? users.map(u => (
                <Wrapper to={`${reviewType}/${u._id}`} onClick={() => handleSelect(u._id)} key={u._id}>
                  <CityAndState>{u.name}</CityAndState>
                  <DueDate>{u.email}</DueDate>
                </Wrapper>
              ))
            : baseApplications.map(a => (
                <Wrapper to={`${reviewType}/${a._id}`} onClick={() => handleSelect(a._id)} key={a._id}>
                  <CityAndState>{`${a.title}`}</CityAndState>
                  <DueDate>{`${format(a.dueDate, 'MMMM D YYYY')}`}</DueDate>
                </Wrapper>
              ))}
        </ModalWrapper>
      </Modal>
      <Heading>Admin Application Dashboard</Heading>
      <Section>
        <P>
          <CustomSpanButton as="button" onClick={() => handleClick('user')}>
            Review User Applications By User
          </CustomSpanButton>
        </P>
        <P>
          <CustomSpanButton as="button" onClick={() => handleClick('base')}>
            Review User Applications By Base Application
          </CustomSpanButton>
        </P>
        <P>
          <Link to="applications">Create or Update Applications</Link>
        </P>
      </Section>
    </ApplicationDashboardContainer>
  )
}
export default ApplicationDashboard

const ApplicationDashboardContainer = styled.div`
  padding: 1.2rem 3.6rem;
`
const ModalWrapper = styled.div`
  padding: 0 2rem 2rem;
  background: ${props => props.theme.primaryBackground};
  overflow-y: auto;
`
const Wrapper = styled(Link)`
  padding: 1.2rem 2rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  background: ${props => props.theme.white};
  ${hoveredRow()};
  &:nth-child(2n - 1) {
    background: ${props => props.theme.primaryLight};
  }
`
const CityAndState = styled.span`
  color: ${props => props.theme.primaryGrey};
  padding-right: 2.4rem;
`
const DueDate = styled.span`
  font-weight: 500;
  color: ${props => props.theme.primaryGrey};
`
const CustomSpanButton = styled.button`
  background: none;
  color: ${props => props.theme.primaryLink};
  font-weight: 500;
  border: none;
  padding: 0;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
