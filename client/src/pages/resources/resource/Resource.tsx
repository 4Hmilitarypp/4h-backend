import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, Heading } from '../../../components/Elements'
import FlashContext from '../../../contexts/FlashContext'
import { IResource } from '../../../sharedTypes'
import { IApiError } from '../../../types'
import api from '../../../utils/api'
import { ResourceContext } from '../Resources'
import ResourceForm from './ResourceForm'
import Lessons from './lessons/Lessons'

const formatError = (err: IApiError) => err.response.data.message

interface IProps extends RouteComponentProps {
  _id?: string
}

const Resource: React.FC<IProps> = ({ _id }) => {
  // the full resource
  const [resource, setResource] = React.useState<IResource | undefined>(undefined)
  const [curriculumFormRef, setCurriculumFormRef] = React.useState<React.RefObject<HTMLFormElement> | undefined>(
    undefined
  )
  const [action, setAction] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const resourceContext = React.useContext(ResourceContext)
  const flashContext = React.useContext(FlashContext)

  React.useEffect(
    () => {
      if (_id === 'new') {
        setAction('create')
      } else {
        setAction('update')
      }
      if (action === 'update' && _id) {
        api.resources
          .getById(_id)
          .then(r => setResource(r))
          .catch(err => console.error(err))
      }
    },
    [_id]
  )

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/curriculum-resources')
  }

  const handleDeleteClicked = () => {
    if (resource && timesDeleteClicked === 1) {
      api.resources
        .delete(resource._id as string)
        .then(res => {
          resourceContext.updateResources({ _id: resource._id, action: 'delete' })
          navigate('/curriculum-resources')
        })
        .catch((err: IApiError) => {
          flashContext.set({ message: formatError(err), isError: true })
        })
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <div>
      <CustomHeading>{`${action === 'update' ? 'Updating a Resource' : 'Create a new Resource'}`}</CustomHeading>
      <ResourceForm action={action} resource={resource} setRef={setCurriculumFormRef} />
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button
            onClick={() => {
              if (curriculumFormRef && curriculumFormRef.current) {
                curriculumFormRef.current.dispatchEvent(new Event('submit'))
              }
            }}
          >
            {action === 'update' ? 'Update' : 'Create'} Resource
          </Button>
        </RightButtons>
      </Buttons>
      {_id && action === 'update' && <Lessons resourceId={_id} />}
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
  padding: 2rem 1.4rem 2rem;
  align-items: center;
`
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.warning};
  font-weight: 500;
  padding: 0;
  margin-left: 1.2rem;
  &:hover {
    cursor: pointer;
  }
`
const HighSevDeleteButton = styled(Button)`
  background: ${props => props.theme.warning};
  letter-spacing: 0.6px;
`
const RightButtons = styled.div`
  margin-left: auto;
`
const OutlineButton = styled(Button)`
  border: 2px solid ${props => props.theme.primaryLink};
  padding: 0.8rem 1.4rem;
  background: none;
  color: ${props => props.theme.primaryLink};
  margin-right: 1.6rem;
`
