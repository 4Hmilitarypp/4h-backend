import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../../components/Elements'
import FlashContext from '../../../../contexts/FlashContext'
import { ILesson, ILessonLink } from '../../../../sharedTypes'
import { IApiError, IForm } from '../../../../types'
import api from '../../../../utils/api'
import { LessonContext } from './Lessons'

const formatError = (err: IApiError) => err.response.data.message

interface IProps {
  action: 'create' | 'update'
  lesson?: ILesson
  setOpen: (isOpen: boolean) => void
}

const convertToLessonLinks = (elems: any, inputId: string, length: number) => {
  const links: ILessonLink[] = []
  ;[...Array(length)].forEach((_, i) => {
    const link = elems[`${inputId}${i}`]
    const url = link.value || undefined
    if (!url) {
      return
    }
    let type: 'ppt' | 'pdf' | 'doc' | 'external'
    if (url.includes('.doc')) {
      type = 'doc'
    } else if (url.includes('.pdf')) {
      type = 'pdf'
    } else if (url.includes('.ppt')) {
      type = 'ppt'
    } else {
      type = 'external'
    }
    links.push({ url, type })
  })
  return links
}

const setNumberOfNewLinks = (lesson?: ILesson) => {
  if (!lesson) {
    return 1
  }
  return lesson.links.length > 0 ? 0 : 1
}

const LessonForm: React.FC<IProps> = ({ action, children, lesson, setOpen }) => {
  const lessonContext = React.useContext(LessonContext)
  const flashContext = React.useContext(FlashContext)
  const [numberLinks, setNumberLinks] = React.useState(setNumberOfNewLinks(lesson))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { category, title } = e.currentTarget.elements
    const otherInputs = e.currentTarget.elements
    const updatedLinks = lesson ? convertToLessonLinks(otherInputs, 'link', lesson.links.length) : []
    const createdLinks = convertToLessonLinks(otherInputs, 'newLink', numberLinks)

    const updateLesson = {
      _id: lesson ? lesson._id : undefined,
      category: category ? category.value : undefined,
      links: [...updatedLinks, ...createdLinks],
      title: title.value,
    }
    api.lessons[action](lessonContext.resourceId, updateLesson)
      .then(newLesson => {
        lessonContext.updateLessons({ lesson: newLesson, action })
        setOpen(false)
      })
      .catch((err: IApiError) => flashContext.set({ message: formatError(err), isError: true }))
  }

  const createLink = () => {
    setNumberLinks(numberLinks + 1)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <label htmlFor="title">Lesson Title</label>
        <input type="text" id="title" defaultValue={(lesson && lesson.title) || ''} autoFocus={!lesson} />
      </InputGroup>
      {lesson &&
        lesson.links.map((link, index) => {
          return (
            <InputGroup key={link.url}>
              <label htmlFor={`link${index}`}>Lesson Resource</label>
              <input type="url" id={`link${index}`} defaultValue={link.url} />
            </InputGroup>
          )
        })}
      {Array.from({ length: numberLinks }, (v, index) => (
        <InputGroup key={`newLink${index}`}>
          <label htmlFor={`newLink${index}`}>Add a new lesson resource</label>
          <input type="url" id={`newLink${index}`} />
        </InputGroup>
      ))}
      <CreateButton type="button" onClick={createLink}>
        + New Resource
      </CreateButton>
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
const CreateButton = styled.button`
  background: ${props => props.theme.primaryBackground};
  border: none;
  color: ${props => props.theme.primaryLink};
  font-weight: 500;
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-size: 1.4rem;
  align-self: center;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
