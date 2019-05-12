import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton } from '../../components/Elements'
import FormHeading from '../../components/FormHeading'
import { IApiError, IUserApplication } from '../../sharedTypes'
import api from '../../utils/api'
import Comments from './comments/Comments'
import UserApplicationForm from './UserApplicationForm'
import { UserApplicationContext } from './UserApplications'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const UserApplication: React.FC<IProps> = ({ _id = '', handleError }) => {
  const [userApplication, setUserApplication] = React.useState<IUserApplication | undefined>(undefined)
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
      <FormHeading _id={_id} action={action} singular="Application" plural="Applications" route="/applications" />
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
      {_id !== 'new' && action === 'update' && userApplication && (
        <Comments applicationId={userApplication._id || ''} handleError={handleError} />
      )}
    </div>
  )
}

export default UserApplication

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
