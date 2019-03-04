import * as React from 'react'
import { ModalHeading } from '../../../../components/Elements'
import Modal, { ModalButtons } from '../../../../components/Modal'
import api from '../../../../utils/api'
import LessonForm from './LessonForm'
import { IModalController } from './useLessons'

const LessonModal: React.FC<{ controller: IModalController }> = ({ controller }) => {
  const { state, reset, handleError, updateLessons, incTimesDeleteClicked } = controller

  const [open, setOpen] = React.useState(false)

  React.useLayoutEffect(() => {
    if (state.action === 'update' || state.action === 'create') {
      setOpen(true)
    }
    if (state.action === 'close') {
      setOpen(false)
    }
  }, [state])

  const handleCancel = () => {
    reset()
  }
  const handleDeleteClicked = () => {
    if (state.lesson && state.timesDeleteClicked === 1) {
      api.lessons
        .delete(state.resourceId, state.lesson._id as string)
        .then(() => updateLessons({ _id: state.lesson ? state.lesson._id : '', action: 'delete' }))
        .catch(handleError)
    } else {
      incTimesDeleteClicked()
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${state.action === 'update' ? 'Updating a Lesson' : 'Create a new Lesson'}`}</ModalHeading>
      <LessonForm modalController={controller} />
      <ModalButtons
        action={state.action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        formId="lessonForm"
        itemName="Lesson"
        timesDeleteClicked={state.timesDeleteClicked || 0}
      />
    </Modal>
  )
}

export default LessonModal
