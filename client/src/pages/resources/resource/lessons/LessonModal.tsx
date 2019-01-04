import * as React from 'react'
import {
  Button,
  DeleteButton,
  HighSevDeleteButton,
  ModalButtons,
  ModalHeading,
  OutlineButton,
  RightButtons,
} from '../../../../components/Elements'
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
      <LessonForm action={action} setOpen={setOpen} lesson={lesson} />
      <ModalButtons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button form="lessonForm">{action === 'update' ? 'Update' : 'Create'} Lesson</Button>
        </RightButtons>
      </ModalButtons>
    </Modal>
  )
}

export default LessonModal