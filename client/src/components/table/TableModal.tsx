import * as React from 'react'
import { ModalHeading } from '../Elements'
import Modal, { ModalButtons } from '../Modal'
import { IModalController } from './useTable'

const TableModal: React.FC<{ controller: IModalController<any>; itemTitle: string }> = ({
  controller,
  children,
  itemTitle,
}) => {
  const { api, handleError, reset, state, updateItems, incTimesDeleteClicked } = controller

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
    if (state.item && state.timesDeleteClicked === 1) {
      api
        .delete(state.item._id as string)
        .then(() => updateItems({ _id: state.item ? state.item._id : '', action: 'delete' }))
        .catch(handleError)
    } else {
      incTimesDeleteClicked()
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${
        state.action === 'update' ? `Updating a ${itemTitle}` : `Create a new ${itemTitle}`
      }`}</ModalHeading>
      {children}
      <ModalButtons
        action={state.action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        itemName={itemTitle}
        timesDeleteClicked={state.timesDeleteClicked || 0}
        formId={`${itemTitle}Form`}
      />
    </Modal>
  )
}

export default TableModal
