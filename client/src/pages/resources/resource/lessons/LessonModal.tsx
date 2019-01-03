import * as React from 'react'
import styled from 'styled-components/macro'
import { Button } from '../../../../components/Elements'
import Modal from '../../../../components/Modal'
import FlashContext from '../../../../contexts/FlashContext'
import { ILesson } from '../../../../sharedTypes'
import { IApiError } from '../../../../types'
import api from '../../../../utils/api'
import LessonForm from './LessonForm'
import { LessonContext } from './Lessons'

interface IProps {
  lesson?: ILesson
  open: boolean
  setOpen: (isOpen: boolean) => void
  action: 'update' | 'create'
}

const formatError = (err: IApiError) => err.response.data.message

const LessonModal: React.FC<IProps> = ({ open, setOpen, lesson, action }) => {
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const lessonContext = React.useContext(LessonContext)
  const flashContext = React.useContext(FlashContext)

  const handleCancel = () => {
    setOpen(false)
    setTimesDeleteClicked(0)
  }

  const handleDeleteClicked = () => {
    if (lesson && timesDeleteClicked === 1) {
      api.lessons
        .delete(lessonContext.resourceId, lesson._id as string)
        .then(res => {
          lessonContext.updateLessons({ _id: lesson._id, action: 'delete' })
        })
        .catch((err: IApiError) => {
          flashContext.set({ message: formatError(err), isError: true })
        })
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${action === 'update' ? 'Updating a Lesson' : 'Create a new Lesson'}`}</ModalHeading>
      <LessonForm action={action} setOpen={setOpen} lesson={lesson}>
        <Buttons>
          {action === 'update' &&
            (timesDeleteClicked === 0 ? (
              <DeleteButton type="button" onClick={handleDeleteClicked}>
                Delete
              </DeleteButton>
            ) : (
              <HighSevDeleteButton type="button" onClick={handleDeleteClicked}>
                CONFIRM DELETE
              </HighSevDeleteButton>
            ))}
          <RightButtons>
            <OutlineButton type="button" onClick={handleCancel}>
              Cancel
            </OutlineButton>
            <Button>{action === 'update' ? 'Update' : 'Create'} Lesson</Button>
          </RightButtons>
        </Buttons>
      </LessonForm>
    </Modal>
  )
}

export default LessonModal

const ModalHeading = styled.h3`
  color: ${props => props.theme.primaryText};
  padding: 1.2rem 1.6rem 0;
  text-align: center;
`
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.2rem;
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
