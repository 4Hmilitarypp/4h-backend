import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../components/Elements'
import { ILesson } from '../../../sharedTypes'

interface IProps {
  onSubmit: (e: any) => void
  lesson?: ILesson
}

const LessonForm: React.FC<IProps> = ({ onSubmit, lesson, children }) => (
  <Form onSubmit={onSubmit}>
    {console.log(lesson)}
    <CustomInputGroup>
      <label htmlFor="title">Lesson Title</label>
      <input type="text" id="title" defaultValue={(lesson && lesson.title) || ''} />
    </CustomInputGroup>
    <CustomInputGroup>
      <label htmlFor="pdfUrl">Url to Lesson</label>
      <input type="url" id="pdfUrl" defaultValue={lesson && lesson.pdfUrl} />
    </CustomInputGroup>
    {children}
  </Form>
)

export default LessonForm
const Form = styled.form`
  padding: 1.2rem 2rem 0;
  display: flex;
  flex-direction: column;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`
