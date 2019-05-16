import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton } from '../../../components/Elements'
import FormHeading from '../../../components/FormHeading'
import { IApiError, IApplication } from '../../../sharedTypes'
import api from '../../../utils/api'
import BaseApplicationForm from './BaseApplicationForm'
import { BaseApplicationContext } from './BaseApplications'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const BaseApplication: React.FC<IProps> = ({ _id = '', handleError }) => {
  const [baseApplication, setBaseApplication] = React.useState<IApplication | undefined>(undefined)
  const [action, setAction] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const baseApplicationContext = React.useContext(BaseApplicationContext)

  React.useEffect(() => {
    if (_id !== 'new') {
      // If the action is not already update set it to be update
      if (action !== 'update') {
        setAction('update')
      }
      const updateBaseApplication = baseApplicationContext.findById(_id)
      if (updateBaseApplication) {
        setBaseApplication(updateBaseApplication)
      } else {
        navigate('/applications-admin')
      }
    } else {
      setBaseApplication(undefined)
      setAction('create')
    }
  }, [_id])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/applications-admin')
  }

  const handleDeleteClicked = () => {
    if (baseApplication && timesDeleteClicked === 1) {
      api.applications
        .delete(baseApplication._id as string)
        .then(() => {
          baseApplicationContext.updateBaseApplications({ _id: baseApplication._id, action: 'delete' })
          navigate('/applications-admin')
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }
  return (
    <div>
      <FormHeading _id={_id} action={action} singular="Application" plural="Applications" route="/applications-admin" />
      <BaseApplicationForm
        action={action}
        handleError={handleError}
        baseApplication={baseApplication}
        updateBaseApplications={baseApplicationContext.updateBaseApplications}
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
          <Button form="BaseApplicationForm">{action === 'update' ? 'Update' : 'Create'} Application</Button>
        </RightButtons>
      </Buttons>
    </div>
  )
}

export default BaseApplication

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
