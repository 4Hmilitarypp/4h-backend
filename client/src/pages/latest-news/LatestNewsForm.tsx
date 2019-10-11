import * as React from 'react'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import { InputGroup, ModalForm } from '../../components/Elements'
import { IModalController } from '../../components/table/useTable'
import { IResearch, ResearchType } from '../../sharedTypes'
import api from '../../utils/api'
import UserContext from '../../contexts/UserContext'

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

const LatestNewsForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateItems } = modalController
  const { item: research, action } = modalController.state
  const [shortDescription, setShortDescription] = React.useState<string>()
  const userContext = React.useContext(UserContext)
  console.log(userContext)

  React.useEffect(() => {
    if (research) setShortDescription(research.description)
  }, [research])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { title, url } = e.currentTarget.elements
    const updateResearch = {
      _id: research ? research._id : undefined,
      description: shortDescription || '',
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
    <ModalForm onSubmit={handleSubmit} id="News ItemForm">
      <InputGroup>
        <label htmlFor="title">Article Title</label>
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
        <input type="url" id="url" defaultValue={research && research.url} required={false} />
      </InputGroup>
      <InputGroup>
        <label>Short Description</label>
        <Editor initialData={shortDescription} handleChange={setShortDescription} />
      </InputGroup>
    </ModalForm>
  )
}

export default LatestNewsForm
