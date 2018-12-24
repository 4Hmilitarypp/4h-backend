import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../components/Elements'
import { IResearch } from '../../sharedTypes'

interface IProps {
  onSubmit: (e: any) => void
  research?: IResearch
}

const ResearchForm: React.FC<IProps> = ({ onSubmit, research, children }) => (
  <Form onSubmit={onSubmit}>
    <InputGroup>
      <label htmlFor="title">Research Title</label>
      <input type="text" id="title" defaultValue={(research && research.title) || ''} />
    </InputGroup>
    <InputGroup>
      <label htmlFor="type">Research Type</label>
      <select id="type" name="type" required={true} value={research ? research.type : ''}>
        <option disabled={true} selected={true} value="">
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
    {children}
  </Form>
)

export default ResearchForm
const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
