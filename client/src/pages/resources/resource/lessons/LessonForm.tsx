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
      _id: lesson ? lesson._id : undefined,
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
      <InputGroup>
        <label htmlFor="title">Lesson Title</label>
        <input type="text" id="title" defaultValue={(lesson && lesson.title) || ''} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="pdfUrl">Url to Pdf for Lesson</label>
        <input type="url" id="pdfUrl" defaultValue={lesson && lesson.pdfUrl} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="docUrl">Url to Word Document for Lesson</label>
        <input type="url" id="docUrl" defaultValue={lesson && lesson.docUrl} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="pptUrl">Url to PowerPoint for Lesson</label>
        <input type="url" id="pptUrl" defaultValue={lesson && lesson.pptUrl} />
      </InputGroup>
      <InputGroup>
        <label htmlFor="externalUrl">Url to external website for Lesson</label>
        <input type="url" id="externalUrl" defaultValue={lesson && lesson.externalUrl} />
      </InputGroup>
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
