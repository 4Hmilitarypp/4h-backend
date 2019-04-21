import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { theme } from '../../App'
import { IForm } from '../../clientTypes'
import {
  BlankUploadBox,
  InputGroup,
  SubHeading,
  UploadButton,
  UploadImage,
  UploadLabel,
} from '../../components/Elements'
import Icon from '../../components/Icon'
import { IApiError, ICamp } from '../../sharedTypes'
import api from '../../utils/api'
import { TUpdateCamps } from './useCamps'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  camp?: ICamp
  updateCamps: TUpdateCamps
}

const CampForm: React.FC<IProps> = ({ action, camp, handleError, updateCamps }) => {
  const [featuredImageUrl, setFeaturedImageUrl] = React.useState<string | undefined>(undefined)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (camp && camp.featuredImage) {
      setFeaturedImageUrl(camp.featuredImage.url)
    }
    if (!camp && formRef.current) {
      formRef.current.reset()
      setFeaturedImageUrl(undefined)
    }
  }, [camp])

  const openCloudinary = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'camp-images',
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

    const {
      ageRange,
      city,
      contactEmail,
      contactName,
      contactPhoneNumber,
      contactUrl,
      contactUrlText,
      description,
      descriptionTitle,
      state,
      title,
    } = e.currentTarget.elements

    const featuredImage = featuredImageUrl
      ? {
          alt: `${title.value} featured image`,
          url: featuredImageUrl,
        }
      : undefined
    const contact = {
      email: contactEmail.value,
      name: contactName.value,
      phoneNumber: contactPhoneNumber.value,
      url: contactUrl.value,
      urlText: contactUrlText.value,
    }
    const updateCamp = {
      _id: camp ? camp._id : undefined,
      ageRange: ageRange.value,
      city: city.value,
      contact,
      description: description.value,
      descriptionTitle: descriptionTitle.value,
      featuredImage,
      state: state.value,
      title: title.value,
    }
    if (action === 'update') {
      api.camps
        .update(updateCamp._id as string, updateCamp)
        .then(newCamp => {
          updateCamps({ camp: newCamp, action })
          navigate(`/camps/${newCamp._id}`)
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.camps
        .create(updateCamp)
        .then(newCamp => {
          updateCamps({ camp: newCamp, action })
          navigate(`/camps/${newCamp._id}`)
        })
        .catch(handleError)
    }
  }

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="CampForm" ref={formRef}>
      <SubHeading>Camp Information</SubHeading>
      <CustomInputGroup>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" defaultValue={(camp && camp.title) || ''} autoFocus={true} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="city">City</label>
        <input type="text" id="city" defaultValue={(camp && camp.city) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="state">State</label>
        <input type="text" id="state" defaultValue={(camp && camp.state) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="ageRange">Campers Age Ranges</label>
        <input type="text" id="ageRange" defaultValue={(camp && camp.ageRange) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="descriptionTitle">Description Title</label>
        <input type="text" id="descriptionTitle" defaultValue={(camp && camp.descriptionTitle) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="description">Description</label>
        {/* Had to do the following because the description was not showing up for some reason */}
        {camp ? (
          <>
            <textarea id="description" defaultValue={camp.description || ''} cols={100} rows={5} />
          </>
        ) : (
          <textarea id="description" cols={100} rows={5} />
        )}
      </CustomInputGroup>
      <SubHeading>Camp Resources</SubHeading>
      <CampResources>
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
            <UploadImage
              src={featuredImageUrl.split('h_850,q_80,w_1650').join('h_250,q_80,w_250')}
              onClick={openCloudinary}
            />
          ) : (
            <BlankUploadBox onClick={openCloudinary}>
              <UploadButton>Upload Image</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
        {/* <ResourceSection>
          <ResourceLabel>File Upload</ResourceLabel>
          <BlankUploadBox onClick={openCloudinary}>
            <Upload>Upload File</Upload>
          </BlankUploadBox>
        </ResourceSection> */}
      </CampResources>
      <SubHeading>Camp's Contact Information</SubHeading>
      <CustomInputGroup>
        <label htmlFor="contactEmail">Contact Email</label>
        <input type="email" id="contactEmail" defaultValue={(camp && camp.contact.email) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="contactName">Contact Name</label>
        <input type="text" id="contactName" defaultValue={(camp && camp.contact.name) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
        <input type="tel" id="contactPhoneNumber" defaultValue={(camp && camp.contact.phoneNumber) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="contactUrl">Contact Url</label>
        <input type="url" id="contactUrl" defaultValue={(camp && camp.contact.url) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="contactUrl">Contact Url Text</label>
        <input type="text" id="contactUrlText" defaultValue={(camp && camp.contact.urlText) || ''} />
      </CustomInputGroup>
    </Form>
  )
}

export default CampForm

const Form = styled.form`
  padding: 1.2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
`
const CustomInputGroup = styled(InputGroup)`
  input,
  textarea {
    background: ${props => props.theme.white};
  }
`
const CampResources = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
