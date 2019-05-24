import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, DeleteButton, HighSevDeleteButton, OutlineButton } from '../../../components/Elements'
import FormHeading from '../../../components/FormHeading'
import { IApiError, IResource } from '../../../sharedTypes'
import api from '../../../utils/api'
import { ResourceContext } from '../EducatorResources'
import ResourceForm from './EducatorResourceForm'
import Lessons from './lessons/Lessons'

interface IProps extends RouteComponentProps {
  _id?: string
  handleError: (err: IApiError) => void
}

const EducatorResource: React.FC<IProps> = ({ _id = '', handleError }) => {
  const [resource, setResource] = React.useState<IResource | undefined>(undefined)
  const [action, setAction] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)

  const resourceContext = React.useContext(ResourceContext)

  React.useEffect(() => {
    if (_id !== 'new') {
      // If the action is not already update set it to be update
      if (action !== 'update') {
        setAction('update')
      }
      const updatedResource = resourceContext.findById(_id)
      if (updatedResource) {
        setResource(updatedResource)
      } else {
        navigate('/educator-resources')
      }
    } else {
      setResource(undefined)
      setAction('create')
    }
  }, [resourceContext, _id])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/educator-resources')
  }

  const handleDeleteClicked = () => {
    if (resource && timesDeleteClicked === 1) {
      api.resources
        .delete(resource._id as string)
        .then(() => {
          resourceContext.updateResources({ _id: resource._id, action: 'delete' })
          navigate('/educator-resources')
        })
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <div>
      <FormHeading _id={_id} action={action} singular="Resource" plural="Resources" route="/educator-resources" />
      <ResourceForm
        action={action}
        handleError={handleError}
        resource={resource}
        updateResources={resourceContext.updateResources}
      />
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete Resource</DeleteButton>
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

export default EducatorResource

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem;
  align-items: center;
`
const RightButtons = styled.div`
  margin-left: auto;
`
