import * as React from 'react'
import styled from 'styled-components'
import { IForm } from '../../../../clientTypes'
import { CreateButton, InputGroup, ModalForm } from '../../../../components/Elements'
import { ILesson, ILessonLink, LessonLinkType } from '../../../../sharedTypes'
import api from '../../../../utils/api'
import { IModalController } from './useLessons'

interface IProps {
  modalController: IModalController
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

const LessonForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateLessons } = modalController
  const { lesson, action } = modalController.state

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
    if (action === 'create') {
      api.lessons
        .create(modalController.state.resourceId, updateLesson)
        .then(newLesson => {
          updateLessons({ lesson: newLesson, action })
          resetModalState()
        })
        .catch(handleError)
    } else {
      api.lessons
        .update(modalController.state.resourceId, updateLesson._id as string, updateLesson)
        .then(newLesson => {
          updateLessons({ lesson: newLesson, action })
          resetModalState()
        })
        .catch(handleError)
    }
  }

  const createLinkInput = () => {
    setNumberLinks(numberLinks + 1)
  }

  return (
    <ModalForm onSubmit={handleSubmit} id="lessonForm">
      <InputGroup>
        <label htmlFor="title">Lesson Title</label>
        <input type="text" id="title" defaultValue={(lesson && lesson.title) || ''} autoFocus={true} />
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
      {Array.from({ length: numberLinks }, (_, index) => (
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
