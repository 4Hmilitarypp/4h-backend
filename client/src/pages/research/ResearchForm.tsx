import * as React from 'react'
import { InputGroup, ModalForm } from '../../components/Elements'
import { IResearch } from '../../sharedTypes'

interface IProps {
  onSubmit: (e: any) => void
  research?: IResearch
}

const ResearchForm: React.FC<IProps> = ({ onSubmit, research, children }) => (
  <ModalForm onSubmit={onSubmit} id="researchForm">
    <InputGroup>
      <label htmlFor="title">Research Title</label>
      <input type="text" id="title" defaultValue={(research && research.title) || ''} />
    </InputGroup>
    <InputGroup>
      <label htmlFor="type">Research Type</label>
      <select id="type" name="type" required={true} defaultValue={research ? research.type : ''}>
        <option disabled={true} value="">
          -- select an option --
        </option>
        <option value={'pdf'}>PDF</option>
        <option value={'doc'}>Word Document</option>
        <option value={'link'}>External Link</option>
      </select>
    </InputGroup>
    <InputGroup>
      <label htmlFor="url">Url to Research</label>
      <input type="url" id="url" defaultValue={research && research.url} />
    </InputGroup>
    <InputGroup>
      <label htmlFor="description">Description</label>
      <textarea id="description" defaultValue={(research && research.description) || ''} rows={5} />
    </InputGroup>
  </ModalForm>
)

export default ResearchForm
