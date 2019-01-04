import * as React from 'react'
import styled from 'styled-components'
import { CreateButton, InputGroup, ModalForm } from '../../../../components/Elements'
import useErrorHandler from '../../../../hooks/useErrorHandler'
import { ILesson, ILessonLink, LessonLinkType } from '../../../../sharedTypes'
import { IForm } from '../../../../types'
import api from '../../../../utils/api'
import { LessonContext } from './Lessons'

interface IProps {
  action: 'create' | 'update'
  lesson?: ILesson
  setOpen: (isOpen: boolean) => void
}

const convertToLessonLinks = (elems: any, inputId: string, length: number) => {
  const links: ILessonLink[] = []
  for (let i = 0; i < length; i++) {
    const link = elems[`${inputId}${i}`]
    const url = link.value || undefined
    if (!url) {
      break
    }

    let type: LessonLinkType
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
  }
  return links
}

// if it is a new lesson, 1 createResource input will appear, otherwise none will appear
const setNumberOfNewLinks = (lesson?: ILesson) => {
  if (!lesson) {
    return 1
  }
  return lesson.links.length > 0 ? 0 : 1
}

const LessonForm: React.FC<IProps> = ({ action, lesson, setOpen }) => {
  const lessonContext = React.useContext(LessonContext)
  const { handleError } = useErrorHandler()
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
      .catch(handleError)
  }

  const createLinkInput = () => {
    setNumberLinks(numberLinks + 1)
  }

  return (
    <ModalForm onSubmit={handleSubmit} id="lessonForm">
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
      <CustomCreateButton type="button" onClick={createLinkInput}>
        + New Resource
      </CustomCreateButton>
    </ModalForm>
  )
}

export default LessonForm

const CustomCreateButton = styled(CreateButton)`
  align-self: center;
`
