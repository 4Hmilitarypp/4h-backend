import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../components/Elements'
import FlashContext from '../../../contexts/FlashContext'
import { IResource } from '../../../sharedTypes'
import { IApiError, IForm } from '../../../types'
import api from '../../../utils/api'
import { ResourceContext } from '../Resources'

const formatError = (err: IApiError) => err.response.data.message

interface IProps {
  action: 'create' | 'update'
  resource?: IResource
  setRef: (ref: React.RefObject<HTMLFormElement>) => void
}

const ResourceForm: React.FC<IProps> = ({ action, resource, setRef }) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const flashContext = React.useContext(FlashContext)
  const resourceContext = React.useContext(ResourceContext)

  React.useEffect(() => setRef(formRef), [formRef])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { description, title, featuredImageAlt, featuredImageUrl } = e.currentTarget.elements
    const imageUrl = featuredImageUrl.value
    const imageAlt = featuredImageAlt.value || undefined
    let featuredImage
    if (imageUrl) {
      featuredImage = { url: imageUrl, alt: imageAlt }
    }
    const updateResource = {
      _id: resource ? resource._id : undefined,
      description: description.value,
      featuredImage,
      title: title.value,
    }
    api.resources[action](updateResource)
      .then(newResource => {
        resourceContext.updateResources({ resource: newResource, action })
        navigate(`/curriculum-resources/${newResource._id}`)
      })
      .catch((err: IApiError) => flashContext.set({ message: formatError(err), isError: true }))
  }

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <CustomInputGroup>
        <label htmlFor="title">Resource Title</label>
        <input type="text" id="title" defaultValue={(resource && resource.title) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImageUrl">Featured Image Url</label>
        <input
          type="text"
          id="featuredImageUrl"
          defaultValue={(resource && resource.featuredImage && resource.featuredImage.url) || ''}
        />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="featuredImageAlt">Featured Image Description</label>
        <input
          type="text"
          id="featuredImageAlt"
          defaultValue={(resource && resource.featuredImage && resource.featuredImage.alt) || ''}
        />
        <CustomInputGroup>
          <label htmlFor="description">Description</label>
          {/* Had to do the following because the description was not showing up for some reason */}
          {resource ? (
            <>
              <textarea id="description" defaultValue={resource.description} rows={5} />
            </>
          ) : (
            <textarea id="description" rows={5} />
          )}
        </CustomInputGroup>
      </CustomInputGroup>
    </Form>
  )
}

export default ResourceForm
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
