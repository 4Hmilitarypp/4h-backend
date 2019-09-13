import * as React from 'react'
import { ModalHeading } from '../../../../components/Elements'
import Modal, { ModalButtons } from '../../../../components/Modal'
import api from '../../../../utils/api'
import CommentForm from './CommentForm'
import { IModalController } from './useComments'

const CommentModal: React.FC<{ controller: IModalController }> = ({ controller }) => {
  const { state, reset, handleError, updateComments, incTimesDeleteClicked } = controller

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
    if (state.comment && state.timesDeleteClicked === 1) {
      api.comments
        .delete(state.applicationId, state.comment._id as string)
        .then(() => updateComments({ _id: state.comment ? state.comment._id : '', action: 'delete' }))
        .catch(handleError)
    } else {
      incTimesDeleteClicked()
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${state.action === 'update' ? 'Updating a Comment' : 'Create a new Comment'}`}</ModalHeading>
      <CommentForm modalController={controller} />
      <ModalButtons
        action={state.action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        formId="commentForm"
        itemName="Comment"
        timesDeleteClicked={state.timesDeleteClicked || 0}
      />
    </Modal>
  )
}

export default CommentModal
