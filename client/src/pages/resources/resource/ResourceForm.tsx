import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { theme } from '../../../App'
import { IForm } from '../../../clientTypes'
import { BlankUploadBox, InputGroup, UploadButton, UploadImage, UploadLabel } from '../../../components/Elements'
import Icon from '../../../components/Icon'
import { IApiError, IResource } from '../../../sharedTypes'
import api from '../../../utils/api'
import { TUpdateResources } from '../useResources'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  resource?: IResource
  updateResources: TUpdateResources
}

const ResourceForm: React.FC<IProps> = ({ action, resource, handleError, updateResources }) => {
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState<string | undefined>(undefined)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (resource && resource.featuredImage) {
      setFeaturedImageUrl(resource.featuredImage.url)
    }
    if (!resource && formRef.current) {
      formRef.current.reset()
      setFeaturedImageUrl(undefined)
    }
  }, [resource])

  const openCloudinary = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'resources-lessons',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setFeaturedImageUrl(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { longDescription, shortDescription, title } = e.currentTarget.elements
    const imageAlt = title.value
    const featuredImage = featuredImageUrl ? { url: featuredImageUrl, alt: imageAlt } : undefined
    const updateResource = {
      _id: resource ? resource._id : undefined,
      featuredImage,
      longDescription: longDescription.value,
      shortDescription: shortDescription.value,
      title: title.value,
    }
    if (action === 'create') {
      api.resources
        .create(updateResource)
        .then(newResource => {
          updateResources({ resource: newResource, action })
          navigate(`/curriculum-resources/${newResource._id}`)
          if (formRef.current) {
            // reset the form so the actual returned data can be loaded
            formRef.current.reset()
          }
        })
        .catch(handleError)
    } else {
      api.resources
        .update(updateResource._id as string, updateResource)
        .then(newResource => {
          updateResources({ resource: newResource, action })
          navigate(`/curriculum-resources/${newResource._id}`)
          if (formRef.current) {
            // reset the form so the actual returned data can be loaded
            formRef.current.reset()
          }
        })
        .catch(handleError)
    }
  }

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="ResourceForm" ref={formRef}>
      <CustomInputGroup>
        <label htmlFor="title">Resource Title</label>
        <input type="text" id="title" defaultValue={(resource && resource.title) || ''} />
      </CustomInputGroup>
      <ResourceSection>
        <UploadLabel hasImage={featuredImageUrl}>
          Featured Image
          {featuredImageUrl && (
            <DeleteIcon
              name="delete"
              height={2.5}
              color={theme.warning}
              onClick={() => setFeaturedImageUrl(undefined)}
            />
          )}
        </UploadLabel>
        {featuredImageUrl ? (
          <UploadImage src={featuredImageUrl} onClick={openCloudinary} />
        ) : (
          <BlankUploadBox onClick={openCloudinary}>
            <UploadButton>Upload Image</UploadButton>
          </BlankUploadBox>
        )}
      </ResourceSection>
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

const ResourceSection = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const DeleteIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`
