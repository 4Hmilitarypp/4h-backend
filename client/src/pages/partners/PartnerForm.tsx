import * as React from 'react'
import styled from 'styled-components/macro'
import { IForm } from '../../clientTypes'
import {
  BlankUploadBox,
  InputGroup,
  ResourceSection,
  TrashCan,
  UploadButton,
  UploadImage,
  UploadLabel,
} from '../../components/Elements'
import { createError } from '../../hooks/useErrorHandler'
import { IApiError, IPartner } from '../../sharedTypes'
import api from '../../utils/api'
import { TUpdatePartners } from './usePartners'

interface IProps {
  action: 'create' | 'update'
  handleError: (err: IApiError) => void
  partner?: IPartner
  updatePartners: TUpdatePartners
}

const PartnerForm: React.FC<IProps> = ({ action, partner, handleError, updatePartners }) => {
  const [featuredImageUrl1, setFeaturedImageUrl1] = React.useState<string | undefined>()
  const [featuredImageUrl2, setFeaturedImageUrl2] = React.useState<string | undefined>()

  React.useEffect(() => {
    if (partner) {
      setFeaturedImageUrl1(partner.featuredImage1.url)
      setFeaturedImageUrl2(partner.featuredImage2 && partner.featuredImage2.url)
    }
  }, [partner])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> & IForm) => {
    e.preventDefault()
    const { shortDescription, longDescription, title } = e.currentTarget.elements

    if (!featuredImageUrl1) return handleError(createError('Please supply a featured image', 400))

    const featuredImage1 = {
      alt: `${title.value} logo`,
      url: featuredImageUrl1,
    }
    const featuredImage2 = featuredImageUrl2
      ? {
          alt: `${title.value} logo`,
          url: featuredImageUrl2,
        }
      : undefined
    const updatePartner = {
      _id: partner ? partner._id : undefined,
      featuredImage1,
      featuredImage2,
      longDescription: longDescription.value,
      reports: partner ? partner.reports : [],
      shortDescription: shortDescription.value,
      title: title.value,
    }
    if (action === 'update') {
      api.partners
        .update(updatePartner._id as string, updatePartner)
        .then(newPartner => {
          updatePartners({ partner: newPartner, action })
        })
        .catch(handleError)
    } else if (action === 'create') {
      api.partners
        .create(updatePartner)
        .then(newPartner => {
          updatePartners({ partner: newPartner, action })
        })
        .catch(handleError)
    }
  }

  const uploadImage1 = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'partners-and-liaisons',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setFeaturedImageUrl1(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }
  const uploadImage2 = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'four-hmpp',
        uploadPreset: 'partners-and-liaisons',
      },
      (err: any, res: any) => {
        if (!err && res && res.event === 'success') {
          setFeaturedImageUrl2(res.info.secure_url)
        }
        if (err) handleError(err)
      }
    )
    if (widget) widget.open()
  }

  return (
    // the id on the form must be what the corresponding submit button's formId is
    <Form onSubmit={handleSubmit} id="PartnerForm">
      <CustomInputGroup>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" defaultValue={(partner && partner.title) || ''} autoFocus={true} />
      </CustomInputGroup>
      <CampResources>
        <ResourceSection>
          <UploadLabel hasImage={featuredImageUrl1}>
            Featured Image
            {featuredImageUrl1 && <TrashCan onClick={() => setFeaturedImageUrl1(undefined)} />}
          </UploadLabel>
          {featuredImageUrl1 ? (
            <UploadImage src={featuredImageUrl1} onClick={uploadImage1} />
          ) : (
            <BlankUploadBox onClick={uploadImage1}>
              <UploadButton>Upload Image</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
        <ResourceSection>
          <UploadLabel hasImage={featuredImageUrl2}>
            Optional Second Featured Image
            {featuredImageUrl2 && <TrashCan onClick={() => setFeaturedImageUrl2(undefined)} />}
          </UploadLabel>
          {featuredImageUrl2 ? (
            <UploadImage src={featuredImageUrl2} onClick={uploadImage2} />
          ) : (
            <BlankUploadBox onClick={uploadImage2}>
              <UploadButton>Upload Image</UploadButton>
            </BlankUploadBox>
          )}
        </ResourceSection>
      </CampResources>
      <CustomInputGroup>
        <label htmlFor="shortDescription">Short Description</label>
        {/* Had to do the following because the shortDescription was not showing up for some reason */}
        {partner ? (
          <>
            <textarea id="shortDescription" defaultValue={partner.shortDescription || ''} cols={100} rows={5} />
          </>
        ) : (
          <textarea id="shortDescription" cols={100} rows={5} />
        )}
      </CustomInputGroup>
      <CustomInputGroup>
        <label htmlFor="longDescription">Long Description</label>
        {/* Had to do the following because the longDescription was not showing up for some reason */}
        {partner ? (
          <>
            <textarea id="longDescription" defaultValue={partner.longDescription} cols={100} rows={5} />
          </>
        ) : (
          <textarea id="longDescription" cols={100} rows={5} />
        )}
      </CustomInputGroup>
    </Form>
  )
}

export default PartnerForm

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
