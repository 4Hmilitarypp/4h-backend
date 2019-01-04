import * as React from 'react'
import {
  Button,
  ModalButtons,
  DeleteButton,
  ModalHeading,
  HighSevDeleteButton,
  RightButtons,
  OutlineButton,
} from '../../components/Elements'
import Modal from '../../components/Modal'
import FlashContext from '../../contexts/FlashContext'
import { IResearch } from '../../sharedTypes'
import { IApiError, IForm } from '../../types'
import api from '../../utils/api'
import { ResearchContext } from './Researches'
import ResearchForm from './ResearchForm'

interface IProps {
  research?: IResearch
  open: boolean
  setOpen: (open: boolean) => void
  action: 'update' | 'create'
}

const formatError = (err: IApiError) => err.response.data.message

const ResearchModal: React.FC<IProps> = ({ open, setOpen, research, action }) => {
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const researchContext = React.useContext(ResearchContext)
  const flashContext = React.useContext(FlashContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { description, title, type, url } = e.currentTarget.elements
    const updateResearch = {
      _id: research ? research._id : undefined,
      description: description.value,
      title: title.value,
      type: type.value as 'pdf' | 'doc' | 'link',
      url: url.value,
    }
    if (action === 'update') {
      api.research
        .update(updateResearch)
        .then(newResearch => {
          researchContext.updateResearches({ research: newResearch, action })
          setOpen(false)
        })
        .catch((err: IApiError) => flashContext.set({ message: formatError(err), isError: true }))
    } else if (action === 'create') {
      api.research
        .create(updateResearch)
        .then(newResearch => {
          researchContext.updateResearches({ research: newResearch, action })
          setOpen(false)
        })
        .catch((err: IApiError) => flashContext.set({ message: formatError(err), isError: true }))
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setTimesDeleteClicked(0)
  }

  const handleDeleteClicked = () => {
    if (research && timesDeleteClicked === 1) {
      api.research
        .delete(research._id as string)
        .then(res => {
          researchContext.updateResearches({ _id: research._id, action: 'delete' })
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
      <ModalHeading>{`${action === 'update' ? 'Updating a research item' : 'Create a new Research'}`}</ModalHeading>
      <ResearchForm onSubmit={handleSubmit} research={research} />
      <ModalButtons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button form="researchForm">{action === 'update' ? 'Update' : 'Create'} Research</Button>
        </RightButtons>
      </ModalButtons>
    </Modal>
  )
}

export default ResearchModal
