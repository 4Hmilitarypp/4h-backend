import * as React from 'react'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import { InputGroup, ModalForm } from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { IResearch, ResearchType } from '../../sharedTypes'
import api from '../../utils/api'

const getType = (url: string) => {
  let type: ResearchType
  if (url.includes('.doc')) {
    type = 'doc'
  } else if (url.includes('.pdf')) {
    type = 'pdf'
  } else {
    type = 'external'
  }
  return type
}

interface IProps {
  modalController: IModalController<IResearch>
}

const ResearchForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems } = modalController
  const { item: research, action } = modalController.state
  const [description, setDescription] = React.useState<string>()

  React.useEffect(() => {
    if (research) setDescription(research.description)
  }, [research])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title, url } = e.currentTarget.elements
    const updateResearch = {
      _id: research ? research._id : undefined,
      description: description || '',
      title: title.value,
      type: getType(url.value),
      url: url.value,
    }
    if (action === 'update') {
      api.research
        .update(updateResearch._id as string, updateResearch)
        .then(newResearch => {
          updateItems({ item: newResearch, action })
          resetModalState()
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.research
        .create(updateResearch)
        .then(newResearch => {
          updateItems({ item: newResearch, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }
  return (
    <ModalForm onSubmit={handleSubmit} id="ResearchForm">
      <InputGroup>
        <label htmlFor="title">Research Title</label>
        <input
          type="text"
          id="title"
          defaultValue={(research && research.title) || ''}
          required={true}
          autoFocus={true}
        />
      </InputGroup>
      <InputGroup>
        <label htmlFor="url">Url to Research</label>
        <input type="url" id="url" defaultValue={research && research.url} required={true} />
      </InputGroup>
      <InputGroup>
        <label>Description</label>
        <Editor initialData={description} handleChange={setDescription} />
      </InputGroup>
    </ModalForm>
  )
}

export default ResearchForm
