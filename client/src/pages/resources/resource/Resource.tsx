import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, DeleteButton, Heading, HighSevDeleteButton, OutlineButton } from '../../../components/Elements'
import { IApiError, IResource } from '../../../sharedTypes'
import api from '../../../utils/api'
import { ResourceContext } from '../Resources'
import Lessons from './lessons/Lessons'
import ResourceForm from './ResourceForm'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const Resource: React.FC<IProps> = ({ _id = '', handleError }) => {
  const [resource, setResource] = React.useState<IResource | undefined>(undefined)
  const [action, setAction] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const resourceContext = React.useContext(ResourceContext)

  React.useEffect(
    () => {
      if (_id !== 'new') {
        // If the action is not already update set it to be update
        if (action !== 'update') {
          setAction('update')
        }
        const updatedResource = resourceContext.findById(_id)
        setResource(updatedResource)
      }
    },
    [resourceContext, _id]
  )

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/curriculum-resources')
  }

  const handleDeleteClicked = () => {
    if (resource && timesDeleteClicked === 1) {
      api.resources
        .delete(resource._id as string)
        .then(() => {
          resourceContext.updateResources({ _id: resource._id, action: 'delete' })
          navigate('/curriculum-resources')
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <div>
      <CustomHeading>{`${action === 'update' ? 'Updating a Resource' : 'Create a new Resource'}`}</CustomHeading>
      <ResourceForm
        action={action}
        handleError={handleError}
        resource={resource}
        updateResources={resourceContext.updateResources}
      />
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button form="ResourceForm">{action === 'update' ? 'Update' : 'Create'} Resource</Button>
        </RightButtons>
      </Buttons>
      {_id && action === 'update' && <Lessons resourceId={_id} handleError={handleError} />}
    </div>
  )
}

export default Resource

const CustomHeading = styled(Heading)`
  font-size: 2.4rem;
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
