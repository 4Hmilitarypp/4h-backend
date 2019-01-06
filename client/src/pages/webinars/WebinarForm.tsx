import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../components/Elements'
import { IWebinar } from '../../sharedTypes'

interface IProps {
  onSubmit: (e: any) => void
  webinar?: IWebinar
}

const WebinarForm: React.FC<IProps> = ({ onSubmit, webinar, children }) => (
  <Form onSubmit={onSubmit}>
    <InputGroup>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" defaultValue={(webinar && webinar.title) || ''} />
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
      <label htmlFor="description">Description</label>
      <textarea id="description" defaultValue={(webinar && webinar.description) || ''} rows={5} />
    </InputGroup>
    {children}
  </Form>
)

export default WebinarForm
const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
