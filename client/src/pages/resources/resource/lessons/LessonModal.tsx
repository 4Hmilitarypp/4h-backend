import * as React from 'react'
import { ModalHeading } from '../../../../components/Elements'
import Modal, { ModalButtons } from '../../../../components/Modal'
import useErrorHandler from '../../../../hooks/useErrorHandler'
import { ILesson } from '../../../../sharedTypes'
import api from '../../../../utils/api'
import LessonForm from './LessonForm'
import { LessonContext } from './Lessons'

interface IProps {
  lesson?: ILesson
  open: boolean
  setOpen: (isOpen: boolean) => void
  action: 'update' | 'create'
}

const LessonModal: React.FC<IProps> = ({ open, setOpen, lesson, action }) => {
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const lessonContext = React.useContext(LessonContext)
  const { handleError } = useErrorHandler()

  const handleCancel = () => {
    setOpen(false)
    setTimesDeleteClicked(0)
  }

  const handleDeleteClicked = () => {
    if (lesson && timesDeleteClicked === 1) {
      api.lessons
        .delete(lessonContext.resourceId, lesson._id as string)
        .then(() => lessonContext.updateLessons({ _id: lesson._id, action: 'delete' }))
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${action === 'update' ? 'Updating a Lesson' : 'Create a new Lesson'}`}</ModalHeading>
      <LessonForm action={action} setOpen={setOpen} lesson={lesson} />
      <ModalButtons
        action={action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        timesDeleteClicked={timesDeleteClicked}
      />
    </Modal>
  )
}

export default LessonModal
