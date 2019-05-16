import { navigate, RouteComponentProps } from '@reach/router'
import { format } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/macro'
import BackButton from '../../components/BackButton'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton, Section } from '../../components/Elements'
import { createError } from '../../hooks/useErrorHandler'
import { IApiError, IFullUserApplication } from '../../sharedTypes'
import api from '../../utils/api'
import Comments from './comments/Comments'
import UserApplicationForm from './UserApplicationForm'
import { UserApplicationContext } from './UserApplications'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const UserApplication: React.FC<IProps> = ({ _id, handleError }) => {
  const [userApplication, setUserApplication] = React.useState<IFullUserApplication | undefined>(undefined)
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const userApplicationContext = React.useContext(UserApplicationContext)

  React.useEffect(() => {
    const updateUserApplication = userApplicationContext.findById(_id as string)
    if (userApplicationContext.isLoaded && !updateUserApplication) {
      handleError(createError('The requested Application could not be found', 400))
    }
    setUserApplication(updateUserApplication)
  }, [userApplicationContext.userApplications])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/applications')
  }

  const handleResetClicked = () => {
    if (userApplication && timesDeleteClicked === 1) {
      api.userApplications
        .delete(userApplication._id as string)
        .then(() => {
          userApplicationContext.updateUserApplications({ _id: userApplication._id, action: 'delete' })
          navigate('/applications')
          window.location.reload()
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
            <BackButton route={'/applications'} title={'Applications'} />
            <Title>
              <ApplicationHeading>{userApplication.title}</ApplicationHeading>
              <StatusButton>{userApplication.status}</StatusButton>
            </Title>
            <DueDate>Due {format(userApplication.dueDate, 'MMMM D YYYY')}</DueDate>
          </HeaderWrapper>
          <Section>
            <DownloadButton as="a" href={userApplication.baseApplicationUrl} target="_blank">
              Download Application Template
            </DownloadButton>
            <Comments applicationId={userApplication._id || ''} handleError={handleError} />
          </Section>
          <UserApplicationForm
            handleError={handleError}
            userApplication={userApplication}
            updateUserApplications={userApplicationContext.updateUserApplications}
          />
          <Buttons>
            {timesDeleteClicked === 0 ? (
              <DeleteButton onClick={handleResetClicked}>Reset Application</DeleteButton>
            ) : (
              <HighSevDeleteButton onClick={handleResetClicked}>CONFIRM RESET</HighSevDeleteButton>
            )}
            <RightButtons>
              <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
              <Button form="UserApplicationForm">Submit Application</Button>
            </RightButtons>
          </Buttons>
        </>
      )}
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
const DownloadButton = styled(Button)`
  margin-top: 4.8rem;
  display: block;
  margin-bottom: 4.8rem;
  text-align: center;
  padding: 1.6rem 2rem;
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
