import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { InputGroup } from '../../../components/Elements'
import useErrorHandler from '../../../hooks/useErrorHandler'
import { IResource } from '../../../sharedTypes'
import { IForm } from '../../../types'
import api from '../../../utils/api'
import { ResourceContext } from '../Resources'

interface IProps {
  action: 'create' | 'update'
  resource?: IResource
}

const ResourceForm: React.FC<IProps> = ({ action, resource }) => {
  const { handleError } = useErrorHandler()
  const resourceContext = React.useContext(ResourceContext)
  const formRef = React.useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { featuredImageAlt, featuredImageUrl, longDescription, shortDescription, title } = e.currentTarget.elements
    const imageUrl = featuredImageUrl.value
    const imageAlt = featuredImageAlt.value || undefined
    let featuredImage
    if (imageUrl) {
      featuredImage = { url: imageUrl, alt: imageAlt }
    }
    const updateResource = {
      _id: resource ? resource._id : undefined,
      featuredImage,
      longDescription: longDescription.value,
      shortDescription: shortDescription.value,
      title: title.value,
    }
    api.resources[action](updateResource)
      .then(newResource => {
        resourceContext.updateResources({ resource: newResource, action })
        navigate(`/curriculum-resources/${newResource._id}`)
        if (formRef.current) {
          // reset the form so the actual returned data can be loaded
          formRef.current.reset()
        }
      })
      .catch(handleError)
  }

  return (
    <Form onSubmit={handleSubmit} id="resourceForm" ref={formRef}>
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
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="shortDescription">Short Description</label>
        {/* Had to do the following because the shortDescription was not showing up for some reason */}
        {resource ? (
          <>
            <textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={resource.shortDescription}
              rows={5}
              maxLength={300}
            />
          </>
        ) : (
          <textarea id="shortDescription" name="shortDescription" rows={5} maxLength={300} />
        )}
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="longDescription">Long Description</label>
        {/* Had to do the following because the longDescription was not showing up for some reason */}
        {resource ? (
          <>
            <textarea id="longDescription" name="longDescription" defaultValue={resource.longDescription} rows={5} />
          </>
        ) : (
          <textarea id="longDescription" name="longDescription" rows={5} maxLength={300} />
        )}
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
