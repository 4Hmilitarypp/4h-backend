import * as React from 'react'
import { ModalHeading } from '../../../components/Elements'
import Modal, { ModalButtons } from '../../../components/Modal'
import api from '../../../utils/api'
import CampDateForm from './CampDateForm'
import { IModalController } from './useCampDates'

const CampDateModal: React.FC<{ controller: IModalController }> = ({ controller }) => {
  const { state, reset, handleError, updateCampDates, incTimesDeleteClicked } = controller

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
    if (state.campDate && state.timesDeleteClicked === 1) {
      api.campDates
        .delete(state.campId, state.campDate._id as string)
        .then(() => updateCampDates({ _id: state.campDate ? state.campDate._id : '', action: 'delete' }))
        .catch(handleError)
    } else {
      incTimesDeleteClicked()
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${state.action === 'update' ? 'Updating a CampDate' : 'Create a new CampDate'}`}</ModalHeading>
      <CampDateForm modalController={controller} />
      <ModalButtons
        action={state.action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        formId="campDateForm"
        itemName="CampDate"
        timesDeleteClicked={state.timesDeleteClicked || 0}
      />
    </Modal>
  )
}

export default CampDateModal
