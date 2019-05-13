import { navigate, RouteComponentProps } from '@reach/router'
import { format } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import UnstyledBackButton from '../../components/BackButton'
import {
  Button,
  CreateButton,
  DeleteButton,
  HighSevDeleteButton,
  OutlineButton,
  P,
  Section,
  SubHeading,
} from '../../components/Elements'
import { IApiError, IFullUserApplication } from '../../sharedTypes'
import api from '../../utils/api'
import Comments from './comments/Comments'
import UserApplicationForm from './UserApplicationForm'
import { UserApplicationContext } from './UserApplications'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const UserApplication: React.FC<IProps> = ({ _id = '', handleError }) => {
  const [userApplication, setUserApplication] = React.useState<IFullUserApplication | undefined>(undefined)
  const [action, setAction] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const userApplicationContext = React.useContext(UserApplicationContext)

  React.useEffect(() => {
    if (_id !== 'new') {
      // If the action is not already update set it to be update
      if (action !== 'update') {
        setAction('update')
      }
      const updateUserApplication = userApplicationContext.findById(_id)
      if (updateUserApplication) {
        setUserApplication(updateUserApplication)
      } else {
        navigate('/applications')
      }
    } else {
      setUserApplication(undefined)
      setAction('create')
    }
  }, [_id])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/applications')
  }

  const handleDeleteClicked = () => {
    if (userApplication && timesDeleteClicked === 1) {
      api.userApplications
        .delete(userApplication._id as string)
        .then(() => {
          userApplicationContext.updateUserApplications({ _id: userApplication._id, action: 'delete' })
          navigate('/applications')
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }
  return (
    <div>
      {userApplication && (
        <>
          <HeaderWrapper>
            <UnstyledBackButton route={'/applications'} title={'Applications'} />
            <ApplicationHeading>{userApplication.title}</ApplicationHeading>
            <DueDate>Due {format(userApplication.dueDate, 'MMMM D YYYY')}</DueDate>
          </HeaderWrapper>
          <Section>
            <SubHeading>Application Information</SubHeading>
            <CustomP>Status: {userApplication.status}</CustomP>
            <DownloadSection>
              <CreateButton as="a" href={userApplication.baseApplicationUrl} target="_blank">
                Download Application
              </CreateButton>
            </DownloadSection>
            {_id !== 'new' && action === 'update' && userApplication && (
              <Comments applicationId={userApplication._id || ''} handleError={handleError} />
            )}
          </Section>
        </>
      )}
      <UserApplicationForm
        action={action}
        handleError={handleError}
        userApplication={userApplication}
        updateUserApplications={userApplicationContext.updateUserApplications}
      />
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete Application</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button form="UserApplicationForm">{action === 'update' ? 'Update' : 'Create'} Application</Button>
        </RightButtons>
      </Buttons>
    </div>
  )
}

export default UserApplication
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
const DueDate = styled.div`
  width: 25.5rem;
  font-weight: 500;
  font-size: 1.8rem;
  color: ${props => props.theme.primaryBlack};
`
/* const SplitSections = styled(Section)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding-bottom: 6rem;
` */
const CustomP = styled(P)`
  padding-bottom: 0.8rem;
`
const DownloadSection = styled.div``
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
