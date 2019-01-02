import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../components/Elements'
import FlashContext from '../../../contexts/FlashContext'
import { ICurriculumResource } from '../../../sharedTypes'
import { IApiError, IForm } from '../../../types'
import api from '../../../utils/api'
import { CurriculumResourceContext } from '../CurriculumResources'

const formatError = (err: IApiError) => err.response.data.message

interface IProps {
  action: 'create' | 'update'
  curriculumResource?: ICurriculumResource
  setRef: (ref: React.RefObject<HTMLFormElement>) => void
}

const CurriculumResourceForm: React.FC<IProps> = ({ action, curriculumResource, setRef }) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const flashContext = React.useContext(FlashContext)
  const curriculumResourceContext = React.useContext(CurriculumResourceContext)

  React.useEffect(() => setRef(formRef), [formRef])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { description, title, featuredImageAlt, featuredImageUrl } = e.currentTarget.elements
    const featuredImage = { alt: featuredImageAlt.value, url: featuredImageUrl.value }
    const updateCurriculumResource = {
      _id: curriculumResource ? curriculumResource._id : undefined,
      description: description.value,
      featuredImage,
      title: title.value,
    }
    api.curriculumResources[action](updateCurriculumResource)
      .then(newCurriculumResource => {
        curriculumResourceContext.updateCurriculumResources({ curriculumResource: newCurriculumResource, action })
        navigate(`/curriculum-resources/${newCurriculumResource._id}`)
      })
      .catch((err: IApiError) => flashContext.set({ message: formatError(err), isError: true }))
  }

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <CustomInputGroup>
        <label htmlFor="title">Curriculum Resource Title</label>
        <input type="text" id="title" defaultValue={(curriculumResource && curriculumResource.title) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImageUrl">Featured Image Url</label>
        <input
          type="text"
          id="featuredImageUrl"
          defaultValue={
            (curriculumResource && curriculumResource.featuredImage && curriculumResource.featuredImage.url) || ''
          }
        />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImageAlt">Featured Image Description</label>
        <input
          type="text"
          id="featuredImageAlt"
          defaultValue={
            (curriculumResource && curriculumResource.featuredImage && curriculumResource.featuredImage.alt) || ''
          }
        />
        <CustomInputGroup>
          <label htmlFor="description">Description</label>
          {/* Had to do the following because the description was not showing up for some reason */}
          {curriculumResource ? (
            <>
              <textarea id="description" defaultValue={curriculumResource.description} rows={5} />
            </>
          ) : (
            <textarea id="description" rows={5} />
          )}
        </CustomInputGroup>
      </CustomInputGroup>
    </Form>
  )
}

export default CurriculumResourceForm
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
