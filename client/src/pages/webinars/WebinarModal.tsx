import * as React from 'react'
import { ModalHeading } from '../../components/Elements'
import Modal, { ModalButtons } from '../../components/Modal'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IWebinar } from '../../sharedTypes'
import { IForm } from '../../types'
import api from '../../utils/api'
import WebinarForm from './WebinarForm'
import { WebinarsContext } from './Webinars'

interface IProps {
  webinar?: IWebinar
  open: boolean
  setOpen: (open: boolean) => void
  action: 'update' | 'create'
}

const WebinarModal: React.FC<IProps> = ({ open, setOpen, webinar, action }) => {
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const webinarContext = React.useContext(WebinarsContext)

  const { handleError } = useErrorHandler()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { category, description, title, url } = e.currentTarget.elements
    const updateWebinar = {
      _id: webinar ? webinar._id : undefined,
      category: category.value,
      description: description.value,
      title: title.value,
      url: url.value,
    }
    if (action === 'update') {
      api.webinars
        .update(updateWebinar._id as string, updateWebinar)
        .then(newWebinar => {
          webinarContext.updateWebinars({ webinar: newWebinar, action })
          setOpen(false)
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.webinars
        .create(updateWebinar)
        .then(newWebinar => {
          webinarContext.updateWebinars({ webinar: newWebinar, action })
          setOpen(false)
        })
        .catch(handleError)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setTimesDeleteClicked(0)
  }

  const handleDeleteClicked = () => {
    if (webinar && timesDeleteClicked === 1) {
      api.webinars
        .delete(webinar._id as string)
        .then(() => webinarContext.updateWebinars({ _id: webinar._id, action: 'delete' }))
        .catch(handleError)
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <Modal open={open} setOpen={setOpen} closeButton={false}>
      <ModalHeading>{`${action === 'update' ? 'Updating a Webinar' : 'Create a new Webinar'}`}</ModalHeading>
      <WebinarForm onSubmit={handleSubmit} webinar={webinar} />
      <ModalButtons
        action={action}
        cancelHandler={handleCancel}
        deleteHandler={handleDeleteClicked}
        itemName="Webinar"
        timesDeleteClicked={timesDeleteClicked}
        formId="webinarForm"
      />
    </Modal>
  )
}

export default WebinarModal
