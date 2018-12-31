import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../../components/Elements'
import FlashContext from '../../../../contexts/FlashContext'
import { ILesson } from '../../../../sharedTypes'
import { IApiError, IForm } from '../../../../types'
import api from '../../../../utils/api'
import { LessonContext } from './Lessons'

const formatError = (err: IApiError) => err.response.data.message

interface IProps {
  action: 'create' | 'update'
  lesson?: ILesson
  setOpen: (isOpen: boolean) => void
}

const LessonForm: React.FC<IProps> = ({ action, children, lesson, setOpen }) => {
  const lessonContext = React.useContext(LessonContext)
  const flashContext = React.useContext(FlashContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { category, docUrl, externalUrl, pdfUrl, pptUrl, title } = e.currentTarget.elements
    const updateLesson = {
      category: category ? category.value : undefined,
      docUrl: docUrl ? docUrl.value : undefined,
      externalUrl: externalUrl ? externalUrl.value : undefined,
      pdfUrl: pdfUrl ? pdfUrl.value : undefined,
      pptUrl: pptUrl ? pptUrl.value : undefined,
      title: title.value,
    }
    api.lessons[action](lessonContext.resourceId, updateLesson)
      .then(newLesson => {
        lessonContext.updateLessons({ lesson: newLesson, action })
        setOpen(false)
      })
      .catch((err: IApiError) => flashContext.set({ message: formatError(err), isError: true }))
  }
  return (
    <Form onSubmit={handleSubmit}>
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
}

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
