import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { Button, SubHeading } from '../../../components/Elements'
import Flash from '../../../components/Flash'
import { useFlash } from '../../../hooks/hooks'
import { ICurriculumResource, ILesson } from '../../../sharedTypes'
import { IApiError, IForm } from '../../../types'
import api from '../../../utils/api'
import { CurriculumResourceContext } from '../CurriculumResources'
import CurriculumResourceForm from './CurriculumResourceForm'
import LessonForm from './LessonForm'

interface IProps extends RouteComponentProps {
  _id?: string
}

const formatError = (err: IApiError) => err.response.data.message

const CurriculumResource: React.FC<IProps> = ({ _id }) => {
  // the full curriculumResource
  const [curriculumResource, setCurriculumResource] = React.useState<ICurriculumResource | undefined>(undefined)
  // the lessons belonging to a curriculumResource
  const [lessons, setLessons] = React.useState<ILesson[]>([])
  const [clickedLesson, setClickedLesson] = React.useState<ILesson | undefined>(undefined)
  const [curriculumFormRef, setCurriculumFormRef] = React.useState<React.RefObject<HTMLFormElement> | undefined>(
    undefined
  )
  const [action] = React.useState<'create' | 'update'>(_id === 'new' ? 'create' : 'update')
  const { error, setError } = useFlash({ initialSubmitted: false })
  const [timesDeleteClicked, setTimesDeleteClicked] = React.useState(0)
  const context = React.useContext(CurriculumResourceContext)

  React.useEffect(() => {
    if (action === 'update' && _id) {
      api.curriculumResource
        .getById(_id)
        .then(r => setCurriculumResource(r))
        .catch(err => console.error(err))
    }
  }, [])

  const handleCurriculumResourceSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { description, title, featuredImageAlt, featuredImageUrl } = e.currentTarget.elements
    const featuredImage = { alt: featuredImageAlt.value, url: featuredImageUrl.value }
    const updateCurriculumResource = {
      _id: curriculumResource ? curriculumResource._id : undefined,
      description: description.value,
      featuredImage,
      lessons,
      title: title.value,
    }
    api.curriculumResource[action](updateCurriculumResource)
      .then(newCurriculumResource => {
        context.setCurriculumResources({ curriculumResource: newCurriculumResource, action })
        navigate('/curriculum-resources')
        // setOpen(false)
      })
      .catch((err: IApiError) => setError(formatError(err)))
  }

  const handleLessonSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { category, docUrl, externalUrl, pdfUrl, pptUrl, title } = e.currentTarget.elements
    const lesson = {
      category: category ? category.value : undefined,
      docUrl: docUrl ? docUrl.value : undefined,
      externalUrl: externalUrl ? externalUrl.value : undefined,
      pdfUrl: pdfUrl ? pdfUrl.value : undefined,
      pptUrl: pptUrl ? pptUrl.value : undefined,
      title: title.value,
    }
    setLessons([...lessons, lesson])
  }

  const handleCancel = () => {
    // setOpen(false)
    setTimesDeleteClicked(0)
    navigate('/curriculum-resources')
  }

  const handleDeleteClicked = () => {
    if (curriculumResource && timesDeleteClicked === 1) {
      api.curriculumResource
        .delete(curriculumResource._id as string)
        .then(res => {
          context.setCurriculumResources({ _id: curriculumResource._id, action: 'delete' })
          navigate('/curriculum-resources')
        })
        .catch((err: IApiError) => {
          setError(formatError(err))
        })
    } else {
      setTimesDeleteClicked(1)
    }
  }

  return (
    <div>
      <Flash error={error} closeClicked={() => setError(undefined)} fixed={false} />
      <ModalHeading>{`${
        action === 'update' ? 'Updating a curriculumResource item' : 'Create a new CurriculumResource'
      }`}</ModalHeading>
      <SubHeading>Curriculum Resource Form</SubHeading>
      <CurriculumResourceForm
        onSubmit={handleCurriculumResourceSubmit}
        curriculumResource={curriculumResource}
        setRef={setCurriculumFormRef}
      />
      <Lessons>
        {lessons.map(l => (
          <div key={l.title} onClick={() => setClickedLesson(l)}>
            {l.title}
          </div>
        ))}
      </Lessons>
      {clickedLesson}
      <SubHeading>Lesson Form</SubHeading>
      <LessonForm onSubmit={handleLessonSubmit} lesson={curriculumResource && curriculumResource.lessons[0]}>
        <Buttons>
          {action === 'update' &&
            (timesDeleteClicked === 0 ? (
              <DeleteButton type="button" onClick={handleDeleteClicked}>
                Delete
              </DeleteButton>
            ) : (
              <HighSevDeleteButton type="button" onClick={handleDeleteClicked}>
                CONFIRM DELETE
              </HighSevDeleteButton>
            ))}
          <RightButtons>
            <OutlineButton type="button" onClick={handleCancel}>
              Cancel
            </OutlineButton>
            <Button>{action === 'update' ? 'Update' : 'Create'} Curriculum Resource</Button>
          </RightButtons>
        </Buttons>
      </LessonForm>
      <Buttons>
        {action === 'update' &&
          (timesDeleteClicked === 0 ? (
            <DeleteButton onClick={handleDeleteClicked}>Delete</DeleteButton>
          ) : (
            <HighSevDeleteButton onClick={handleDeleteClicked}>CONFIRM DELETE</HighSevDeleteButton>
          ))}
        <RightButtons>
          <OutlineButton onClick={handleCancel}>Cancel</OutlineButton>
          <Button
            onClick={() => {
              if (curriculumFormRef && curriculumFormRef.current) {
                curriculumFormRef.current.dispatchEvent(new Event('submit'))
              }
            }}
          >
            {action === 'update' ? 'Update' : 'Create'} Curriculum Resource
          </Button>
        </RightButtons>
      </Buttons>
    </div>
  )
}

export default CurriculumResource

const ModalHeading = styled.h3`
  color: ${props => props.theme.primaryText};
  padding: 1.2rem 1.6rem 0;
  text-align: center;
`
const Lessons = styled.div``
const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 1.4rem 2rem;
  align-items: center;
`
const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.warning};
  font-weight: 500;
  padding: 0;
  margin-left: 1.2rem;
  &:hover {
    cursor: pointer;
  }
`
const HighSevDeleteButton = styled(Button)`
  background: ${props => props.theme.warning};
  letter-spacing: 0.6px;
`
const RightButtons = styled.div`
  margin-left: auto;
`
const OutlineButton = styled(Button)`
  border: 2px solid ${props => props.theme.buttonBackground};
  padding: 0.8rem 1.4rem;
  background: none;
  color: ${props => props.theme.buttonBackground};
  margin-right: 1.6rem;
`
