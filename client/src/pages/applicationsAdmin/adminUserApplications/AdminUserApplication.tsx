import { navigate, RouteComponentProps } from '@reach/router'
import { format } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import UnstyledBackButton from '../../../components/BackButton'
import {
  Button,
  DeleteButton,
  HighSevDeleteButton,
  OutlineButton,
  Section,
  SubHeading,
} from '../../../components/Elements'
import EmbedDocument from '../../../components/EmbedDocument'
import { createError } from '../../../hooks/useErrorHandler'
import { IApiError, IFullUserApplication } from '../../../sharedTypes'
import api from '../../../utils/api'
import { AdminUserApplicationContextByBase } from './AdminUserApplicationsByBase'
import { AdminUserApplicationContextByUser } from './AdminUserApplicationsByUser'
import Comments from './comments/Comments'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
  refId?: string
  type: 'base' | 'user'
}

const AdminUserApplication: React.FC<IProps> = ({ _id, handleError, refId, type }) => {
  const [adminUserApplication, setAdminUserApplication] = React.useState<IFullUserApplication | undefined>(undefined)
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const adminUserApplicationContext = React.useContext(
    type === 'base' ? AdminUserApplicationContextByBase : AdminUserApplicationContextByUser
  )

  React.useEffect(() => {
    const updateAdminUserApplication = adminUserApplicationContext.findById(_id as string)
    if (adminUserApplicationContext.isLoaded && !updateAdminUserApplication) {
      handleError(createError('The requested Application could not be found', 400))
    }
    setAdminUserApplication(updateAdminUserApplication)
  }, [_id, adminUserApplicationContext, adminUserApplicationContext.adminUserApplications]) // eslint-disable-line

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate(`/applications-admin/${type}/${refId}`)
  }

  const handleRejectClicked = () => {
    if (adminUserApplication && timesDeleteClicked === 1) {
      api.userApplications
        .update(adminUserApplication._id as string, { status: 'Rejected', url: adminUserApplication.url })
        .then(() => {
          adminUserApplicationContext.updateAdminUserApplications({
            _id: adminUserApplication._id,
            action: 'update',
            adminUserApplication,
          })
          navigate(`/applications-admin/${type}/${refId}`)
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }
  const handleApproveClicked = () => {
    if (adminUserApplication) {
      api.userApplications
        .update(adminUserApplication._id as string, { status: 'Approved', url: adminUserApplication.url })
        .then(() => {
          adminUserApplicationContext.updateAdminUserApplications({
            _id: adminUserApplication._id,
            action: 'update',
            adminUserApplication,
          })
          navigate(`/applications-admin/${type}/${refId}`)
        })
        .catch(handleError)
    }
  }
  return (
    <div>
      {adminUserApplication && (
        <>
          <HeaderWrapper>
            <UnstyledBackButton route={`/applications-admin/${type}/${refId}`} title={'Applications'} />
            <Title>
              <ApplicationHeading>{adminUserApplication.title}</ApplicationHeading>
              <StatusButton>{adminUserApplication.status}</StatusButton>
            </Title>
            <DueDate>Due {format(adminUserApplication.dueDate, 'MMMM D YYYY')}</DueDate>
          </HeaderWrapper>
          <Section>
            <Comments applicationId={adminUserApplication._id || ''} handleError={handleError} />
          </Section>
          <Section>
            <SubHeading>Application Submission</SubHeading>
            <EmbedDocument
              inPage={true}
              url={adminUserApplication.url}
              title={adminUserApplication.title}
              open={true}
              setOpen={() => null}
            />
          </Section>
          <Buttons>
            {timesDeleteClicked === 0 ? (
              <DeleteButton onClick={handleRejectClicked}>Reject Application</DeleteButton>
            ) : (
              <HighSevDeleteButton onClick={handleRejectClicked}>CONFIRM REJECT</HighSevDeleteButton>
            )}
            <RightButtons>
              <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
              <Button onClick={handleApproveClicked}>Approve Application</Button>
            </RightButtons>
          </Buttons>
        </>
      )}
    </div>
  )
}

export default AdminUserApplication
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3.2rem;
`
const ApplicationHeading = styled.h1`
  text-align: center;
  padding: 3.6rem 0;
  color: ${props => props.theme.primaryBlack};
`
const Title = styled.div`
  display: flex;
  align-items: center;
`
const StatusButton = styled.span`
  font-size: 1.2rem;
  border-radius: 50px;
  padding: 0.4rem 1rem;
  margin-left: 1.6rem;
  font-weight: 500;
  background: ${props => props.theme.primaryLink};
  color: ${props => props.theme.white};
`
const DueDate = styled.div`
  width: 25.5rem;
  font-weight: 500;
  font-size: 1.8rem;
  color: ${props => props.theme.primaryBlack};
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
