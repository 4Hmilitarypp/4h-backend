import { navigate } from '@reach/router'
import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import Editor from '../../components/Editor'
import {
  BlankUploadBox,
  InputGroup,
  ResourceSection,
  Select,
  SubHeading,
  TextUploadBox,
  TrashCan,
  UploadButton,
  UploadImage,
  UploadLabel,
} from '../../components/Elements'
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
  const [flyerUrl, setFlyerUrl] = React.useState<string | undefined>(undefined)
  const [campType, setCampType] = React.useState<'Day' | 'Residential'>('Day')
  const [serviceBranch, setServiceBranch] = React.useState<'Air Force' | 'Navy' | 'Army'>('Air Force')
  const [description, setDescription] = React.useState<string>()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (camp) setDescription(camp.description)
    if (camp && camp.featuredImage) {
      setFeaturedImageUrl(camp.featuredImage.url)
      setFlyerUrl(camp.flyerUrl)
      setCampType(camp.type)
      setServiceBranch(camp.serviceBranch)
    }
    if (!camp && formRef.current) {
      formRef.current.reset()
      setFeaturedImageUrl(undefined)
      setFlyerUrl(undefined)
    }
  }, [camp])

  const uploadImage = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'camp-images',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          const optimizedUrl = res.info.secure_url.split('/upload/').join('/upload/c_fill,f_auto,h_850,q_80,w_1650/')
          setFeaturedImageUrl(optimizedUrl)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const uploadFlyer = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'camp-flyers',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setFlyerUrl(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  const handleTypeChange = (e: any) => setCampType(e.target.value)
  const handleServiceChange = (e: any) => setServiceBranch(e.target.value)

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
      description: description || '',
      descriptionTitle: descriptionTitle.value,
      featuredImage,
      flyerUrl,
      serviceBranch,
      state: state.value,
      title: title.value,
      type: campType,
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
        <label htmlFor="type">Camp Type</label>
        <Select id="type" value={campType} onChange={e => handleTypeChange(e)}>
          <option value="Day">Day</option>
          <option value="Residential">Residential</option>
        </Select>
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="serviceBranch">Service Branch</label>
        <Select id="serviceBranch" value={serviceBranch} onChange={e => handleServiceChange(e)}>
          <option value="Air Force">Air Force</option>
          <option value="Navy">Navy</option>
          <option value="Army">Army</option>
        </Select>
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="descriptionTitle">Description Title</label>
        <input type="text" id="descriptionTitle" defaultValue={(camp && camp.descriptionTitle) || ''} />
      </CustomInputGroup>
      <CustomInputGroup>
        <label>Description</label>
        <Editor initialData={description} handleChange={setDescription} />
      </CustomInputGroup>
      <SubHeading>Camp Resources</SubHeading>
      <CampResources>
        <ResourceSection>
          <UploadLabel hasImage={featuredImageUrl}>
            Featured Image
            {featuredImageUrl && <TrashCan onClick={() => setFeaturedImageUrl(undefined)} />}
          </UploadLabel>
          {featuredImageUrl ? (
            <UploadImage
              src={featuredImageUrl.split('h_850,q_80,w_1650').join('h_250,q_80,w_250')}
              onClick={uploadImage}
            />
          ) : (
            <BlankUploadBox onClick={uploadImage}>
              <UploadButton>Upload Image</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
        <ResourceSection>
          <UploadLabel hasImage={flyerUrl}>
            Camp Flyer
            {flyerUrl && <TrashCan onClick={() => setFlyerUrl(undefined)} />}
          </UploadLabel>
          {flyerUrl ? (
            <TextUploadBox>{flyerUrl}</TextUploadBox>
          ) : (
            <BlankUploadBox onClick={uploadFlyer}>
              <UploadButton>Upload Flyer</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
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
  textarea,
  select {
    background: ${props => props.theme.white};
  }
`
const CampResources = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
