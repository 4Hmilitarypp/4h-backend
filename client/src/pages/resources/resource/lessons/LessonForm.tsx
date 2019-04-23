import * as React from 'react'
import styled from 'styled-components'
import { theme } from '../../../../App'
import { IForm } from '../../../../clientTypes'
import { CreateButton, InputGroup, ModalForm } from '../../../../components/Elements'
import Icon from '../../../../components/Icon'
import { ILessonLink } from '../../../../sharedTypes'
import api from '../../../../utils/api'
import { IModalController } from './useLessons'

interface IProps {
  modalController: IModalController
}

const getType = (url: string) => {
  if (url.includes('.doc')) {
    return 'doc'
  } else if (url.includes('.pdf')) {
    return 'pdf'
  } else if (url.includes('.ppt')) {
    return 'ppt'
  } else {
    return 'external'
  }
}

const LessonForm: React.FC<IProps> = ({ modalController }) => {
  const { handleError, reset: resetModalState, updateLessons } = modalController
  const { lesson, action } = modalController.state

  const [resources, setResources] = React.useState<ILessonLink[]>(lesson ? lesson.links : [])

  const openCloudinary = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'resources-lessons',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setResources([...resources, { url: res.info.secure_url, type: getType(res.info.secure_url) }])
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { category, title } = e.currentTarget.elements

    const updateLesson = {
      _id: lesson ? lesson._id : undefined,
      category: category ? category.value : undefined,
      links: resources,
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

  const removeResource = (url: string) => {
    setResources(resources.filter(r => r.url !== url))
  }

  return (
    <ModalForm onSubmit={handleSubmit} id="lessonForm">
      <InputGroup>
        <label htmlFor="title">Lesson Title</label>
        <input type="text" id="title" defaultValue={(lesson && lesson.title) || ''} autoFocus={true} />
      </InputGroup>
      {resources.length ? <ResourceLabel>Lesson resources</ResourceLabel> : null}
      {resources.map(resource => (
        <Resource key={resource.url}>
          {resource.url}
          <DeleteIcon name="delete" height={2.2} color={theme.warning} onClick={() => removeResource(resource.url)} />
        </Resource>
      ))}
      <CustomCreateButton type="button" onClick={openCloudinary}>
        + New Lesson Resource
      </CustomCreateButton>
    </ModalForm>
  )
}

export default LessonForm

const CustomCreateButton = styled(CreateButton)`
  align-self: center;
  margin-top: 2rem;
`
const ResourceLabel = styled.label`
  font-size: 1.8rem;
  color: ${props => props.theme.primaryGrey};
  padding: 1.2rem 0 0.8rem;
`
const Resource = styled.p`
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:nth-child(2n - 1) {
    background: ${props => props.theme.primaryLight};
  }
`
const DeleteIcon = styled(Icon)`
  margin-left: 0.8rem;
  &:hover {
    cursor: pointer;
  }
`
