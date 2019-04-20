import * as React from 'react'
import { ModalHeading } from '../../../components/Elements'
import Modal, { ModalButtons } from '../../../components/Modal'
import api from '../../../utils/api'
import ReportForm from './ReportForm'
import { IModalController } from './useReports'

const ReportModal: React.FC<{ controller: IModalController }> = ({ controller }) => {
  const { state, reset, handleError, updateReports, incTimesDeleteClicked } = controller

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
    if (state.report && state.timesDeleteClicked === 1) {
      api.reports
        .delete(state.partnerId, state.report._id as string)
        .then(() => updateReports({ _id: state.report ? state.report._id : '', action: 'delete' }))
        .catch(handleError)
    } else {
      incTimesDeleteClicked()
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${state.action === 'update' ? 'Updating a Report' : 'Create a new Report'}`}</ModalHeading>
      <ReportForm modalController={controller} />
      <ModalButtons
        action={state.action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        formId="reportForm"
        itemName="Report"
        timesDeleteClicked={state.timesDeleteClicked || 0}
      />
    </Modal>
  )
}

export default ReportModal
