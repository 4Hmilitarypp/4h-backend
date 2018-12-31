import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, SubHeading } from '../../../components/Elements'
import FlashContext from '../../../contexts/FlashContext'
import { ICurriculumResource } from '../../../sharedTypes'
import { IApiError } from '../../../types'
import api from '../../../utils/api'
import { CurriculumResourceContext } from '../CurriculumResources'
import CurriculumResourceForm from './CurriculumResourceForm'
import Lessons from './lessons/Lessons'

const formatError = (err: IApiError) => err.response.data.message

interface IProps extends RouteComponentProps {
  _id?: string
}

const CurriculumResource: React.FC<IProps> = ({ _id }) => {
  // the full curriculumResource
  const [curriculumResource, setCurriculumResource] = React.useState<ICurriculumResource | undefined>(undefined)
  const [curriculumFormRef, setCurriculumFormRef] = React.useState<React.RefObject<HTMLFormElement> | undefined>(
    undefined
  )
  const [action] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const curriculumResourceContext = React.useContext(CurriculumResourceContext)
  const flashContext = React.useContext(FlashContext)

  React.useEffect(() => {
    if (action === 'update' && _id) {
      api.curriculumResource
        .getById(_id)
        .then(r => setCurriculumResource(r))
        .catch(err => console.error(err))
    }
  }, [])

  const handleCancel = () => {
    setTimesDeleteClicked(0)
    navigate('/curriculum-resources')
  }

  const handleDeleteClicked = () => {
    if (curriculumResource && timesDeleteClicked === 1) {
      api.curriculumResource
        .delete(curriculumResource._id as string)
        .then(res => {
          curriculumResourceContext.updateCurriculumResources({ _id: curriculumResource._id, action: 'delete' })
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
      <ModalHeading>{`${
        action === 'update' ? 'Updating a Curriculum Resource' : 'Create a new Curriculum Resource'
      }`}</ModalHeading>
      <SubHeading>Curriculum Resource Form</SubHeading>
      <CurriculumResourceForm action={action} curriculumResource={curriculumResource} setRef={setCurriculumFormRef} />
      {_id && action === 'update' && <Lessons resourceId={_id} />}
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
            {action === 'update' ? 'Update' : 'Create'} Curriculum Resource
          </Button>
        </RightButtons>
      </Buttons>
    </div>
  )
}

export default CurriculumResource

const ModalHeading = styled.h3`
  color: ${props => props.theme.primaryText};
  padding: 1.2rem 1.6rem 0;
  text-align: center;
`
// const Lessons = styled.div``
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
  border: 2px solid ${props => props.theme.buttonBackground};
  padding: 0.8rem 1.4rem;
  background: none;
  color: ${props => props.theme.buttonBackground};
  margin-right: 1.6rem;
`
