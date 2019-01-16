import * as React from 'react'
import { ModalHeading } from '../../components/Elements'
import Modal, { ModalButtons } from '../../components/Modal'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IResearch } from '../../sharedTypes'
import api from '../../utils/api'
import { ResearchContext } from './Researches'
import ResearchForm from './ResearchForm'

interface IProps {
  research?: IResearch
  open: boolean
  setOpen: (open: boolean) => void
  action: 'update' | 'create'
}

const ResearchModal: React.FC<IProps> = ({ open, setOpen, research, action }) => {
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const researchContext = React.useContext(ResearchContext)
  const { handleError } = useErrorHandler()

  const handleCancel = () => {
    setOpen(false)
    setTimesDeleteClicked(0)
  }

  const handleDeleteClicked = () => {
    if (research && timesDeleteClicked === 1) {
      api.research
        .delete(research._id as string)
        .then(() => researchContext.updateResearches({ _id: research._id, action: 'delete' }))
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${action === 'update' ? 'Updating a research item' : 'Create a new Research'}`}</ModalHeading>
      <ResearchForm research={research} action={action} setOpen={setOpen} />
      <ModalButtons
        action={action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        formId="researchForm"
        itemName="Research"
        timesDeleteClicked={timesDeleteClicked}
      />
    </Modal>
  )
}

export default ResearchModal
