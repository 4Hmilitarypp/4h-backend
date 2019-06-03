import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import { InputGroup } from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { IWebinar } from '../../sharedTypes'
import api from '../../utils/api'

interface IProps {
  modalController: IModalController<IWebinar>
}

const Webinar2Form: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems } = modalController
  const { item: webinar, action } = modalController.state
  const [description, setDescription] = React.useState<string>()

  React.useEffect(() => {
    if (webinar) setDescription(webinar.description)
  }, [webinar])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { category, title, url } = e.currentTarget.elements
    const updateWebinar = {
      _id: webinar ? webinar._id : undefined,
      category: category.value,
      description: description || '',
      title: title.value,
      url: url.value,
    }
    if (action === 'update') {
      api.webinars
        .update(updateWebinar._id as string, updateWebinar)
        .then(newWebinar => {
          updateItems({ item: newWebinar, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.webinars
        .create(updateWebinar)
        .then(newWebinar => {
          updateItems({ item: newWebinar, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  return (
    // the id must be what the corresponding modal submit button's formId is
    <Form onSubmit={handleSubmit} id="WebinarForm">
      <InputGroup>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" defaultValue={(webinar && webinar.title) || ''} autoFocus={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="category">Category</label>
        <input type="text" id="category" defaultValue={webinar && webinar.category} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="url">Url To Webinar</label>
        <input type="text" id="url" defaultValue={(webinar && webinar.url) || ''} />
      </InputGroup>
      <InputGroup>
        <label>Description</label>
        <Editor initialData={description} handleChange={setDescription} />
      </InputGroup>
    </Form>
  )
}

export default Webinar2Form

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
