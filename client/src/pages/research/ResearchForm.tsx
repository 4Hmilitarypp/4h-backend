import * as React from 'react'
import { InputGroup, ModalForm } from '../../components/Elements'
import useErrorHandler from '../../hooks/useErrorHandler'
import { IResearch, ResearchType } from '../../sharedTypes'
import { IForm } from '../../types'
import api from '../../utils/api'
import { ResearchContext } from './Researches'

interface IProps {
  action: 'update' | 'create'
  setOpen: (open: boolean) => void
  research?: IResearch
}

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

const ResearchForm: React.FC<IProps> = ({ setOpen, research, action }) => {
  const researchContext = React.useContext(ResearchContext)
  const { handleError } = useErrorHandler()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { description, title, url } = e.currentTarget.elements
    const updateResearch = {
      _id: research ? research._id : undefined,
      description: description.value,
      title: title.value,
      type: getType(url.value),
      url: url.value,
    }
    if (action === 'update') {
      api.research
        .update(updateResearch)
        .then(newResearch => {
          researchContext.updateResearches({ research: newResearch, action })
          setOpen(false)
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.research
        .create(updateResearch)
        .then(newResearch => {
          researchContext.updateResearches({ research: newResearch, action })
          setOpen(false)
        })
        .catch(handleError)
    }
  }
  return (
    <ModalForm onSubmit={handleSubmit} id="researchForm">
      <InputGroup>
        <label htmlFor="title">Research Title</label>
        <input type="text" id="title" defaultValue={(research && research.title) || ''} required={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="url">Url to Research</label>
        <input type="url" id="url" defaultValue={research && research.url} required={true} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="description">Description</label>
        <textarea id="description" defaultValue={(research && research.description) || ''} rows={5} />
      </InputGroup>
    </ModalForm>
  )
}

export default ResearchForm
